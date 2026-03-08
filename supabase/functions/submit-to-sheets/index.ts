import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Google Sheets API helpers
async function getAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const toBase64Url = (data: Uint8Array | string) => {
    const str = typeof data === "string" ? data : base64Encode(data);
    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const encode = (obj: unknown) =>
    toBase64Url(btoa(JSON.stringify(obj)));

  const unsignedJwt = `${encode(header)}.${encode(claim)}`;

  // Import the private key
  const pemContents = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = base64Decode(pemContents);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedJwt)
  );

  const signedJwt = `${unsignedJwt}.${toBase64Url(new Uint8Array(signature))}`;

  // Exchange for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(
      `Failed to get access token [${tokenRes.status}]: ${JSON.stringify(tokenData)}`
    );
  }
  return tokenData.access_token;
}

async function appendToSheet(
  accessToken: string,
  spreadsheetId: string,
  values: string[]
) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Google Sheets API error [${res.status}]: ${JSON.stringify(data)}`
    );
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientEmail = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    if (!clientEmail) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is not configured");
    }

    const privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");
    if (!privateKey) {
      throw new Error("GOOGLE_PRIVATE_KEY is not configured");
    }

    const sheetId = Deno.env.get("GOOGLE_SHEET_ID");
    if (!sheetId) {
      throw new Error("GOOGLE_SHEET_ID is not configured");
    }

    const { answers, totalScore, qualified } = await req.json();

    // Build row: Timestamp, then each answer in order, then score, then status
    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      ...Object.values(answers as Record<string, { label: string }>).map(
        (a) => a.label
      ),
      String(totalScore),
      qualified ? "Qualifié" : "Non qualifié",
    ];

    // Fix escaped newlines in private key
    const formattedKey = privateKey.replace(/\\n/g, "\n");

    const accessToken = await getAccessToken(clientEmail, formattedKey);
    await appendToSheet(accessToken, sheetId, row);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error submitting to Google Sheets:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
