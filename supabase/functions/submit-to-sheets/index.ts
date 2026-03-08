import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1dBFzUMXbEMDSPuoyDOi6l2gGnDG-fnK1dNt4h8ei_H0";

function toBase64Url(input: Uint8Array): string {
  return base64Encode(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function strToBase64Url(str: string): string {
  return toBase64Url(new TextEncoder().encode(str));
}

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
  token_uri: string;
}

function parseServiceAccountCredentials(raw: string): ServiceAccountCredentials {
  const attempts: string[] = [];

  const tryParse = (input: string): ServiceAccountCredentials | null => {
    try {
      const parsed = JSON.parse(input) as Partial<ServiceAccountCredentials>;
      if (parsed?.client_email && parsed?.private_key && parsed?.token_uri) {
        return parsed as ServiceAccountCredentials;
      }
      attempts.push("JSON parsed but required keys are missing");
      return null;
    } catch (err) {
      attempts.push(err instanceof Error ? err.message : "Unknown parse error");
      return null;
    }
  };

  // 1) Raw
  const rawTrimmed = raw.trim();
  const direct = tryParse(rawTrimmed);
  if (direct) return direct;

  // 2) Remove markdown code fences
  const withoutFences = rawTrimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const fenced = tryParse(withoutFences);
  if (fenced) return fenced;

  // 3) Extract object portion only
  const firstBrace = withoutFences.indexOf("{");
  const lastBrace = withoutFences.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const extracted = withoutFences.slice(firstBrace, lastBrace + 1);
    const extractedParsed = tryParse(extracted);
    if (extractedParsed) return extractedParsed;
  }

  // 4) Base64-encoded JSON fallback
  try {
    const decoded = atob(rawTrimmed);
    const decodedParsed = tryParse(decoded);
    if (decodedParsed) return decodedParsed;
  } catch {
    // Ignore base64 decode errors
  }

  throw new Error(
    `GOOGLE_CREDENTIALS_JSON is invalid. Save the exact raw credentials.json content in the secret. Parse attempts: ${attempts.join(" | ")}`
  );
}

async function getAccessToken(creds: ServiceAccountCredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = JSON.stringify({ alg: "RS256", typ: "JWT" });
  const claim = JSON.stringify({
    iss: creds.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: creds.token_uri,
    exp: now + 3600,
    iat: now,
  });

  const unsignedJwt = `${strToBase64Url(header)}.${strToBase64Url(claim)}`;

  // Parse PEM private key - handle both literal \n and actual newlines
  const privateKey = creds.private_key.replace(/\\n/g, "\n");
  const pemBody = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");

  // Decode base64 PEM to binary using atob
  const binaryStr = atob(pemBody);
  const binaryKey = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    binaryKey[i] = binaryStr.charCodeAt(i);
  }

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

  const tokenRes = await fetch(creds.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signedJwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(`Failed to get access token [${tokenRes.status}]: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function appendToSheet(accessToken: string, values: string[]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

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
    throw new Error(`Google Sheets API error [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const credentialsJson = Deno.env.get("GOOGLE_CREDENTIALS_JSON");
    if (!credentialsJson) {
      throw new Error("GOOGLE_CREDENTIALS_JSON is not configured");
    }

    const creds: ServiceAccountCredentials = JSON.parse(credentialsJson);

    const { answers, totalScore, qualified } = await req.json();

    const timestamp = new Date().toISOString();
    const row = [
      timestamp,
      ...Object.values(answers as Record<string, { label: string }>).map((a) => a.label),
      String(totalScore),
      qualified ? "Qualifié" : "Non qualifié",
    ];

    const accessToken = await getAccessToken(creds);
    await appendToSheet(accessToken, row);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error submitting to Google Sheets:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
