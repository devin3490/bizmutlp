import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode, decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1B4R0AlFFksMEjld8tKYcfK6Uy91XDWm2jsl_vmlmarM";

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
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.client_email && parsed?.private_key) {
      return { client_email: parsed.client_email, private_key: parsed.private_key, token_uri: parsed.token_uri || "https://oauth2.googleapis.com/token" };
    }
  } catch {}

  try {
    const parsed = JSON.parse(`{${raw.trim()}}`);
    if (parsed?.client_email && parsed?.private_key) {
      return { client_email: parsed.client_email, private_key: parsed.private_key, token_uri: parsed.token_uri || "https://oauth2.googleapis.com/token" };
    }
  } catch {}

  const emailMatch = raw.match(/"client_email"\s*:\s*"([^"]+)"/);
  const tokenUriMatch = raw.match(/"token_uri"\s*:\s*"([^"]+)"/);
  const pkMatch = raw.match(/"private_key"\s*:\s*"(-----BEGIN PRIVATE KEY-----[^"]*-----END PRIVATE KEY-----\\n)"/);

  if (emailMatch && pkMatch) {
    return {
      client_email: emailMatch[1],
      private_key: pkMatch[1],
      token_uri: tokenUriMatch?.[1] || "https://oauth2.googleapis.com/token",
    };
  }

  throw new Error("GOOGLE_CREDENTIALS_JSON is invalid.");
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

  let privateKey = creds.private_key;
  privateKey = privateKey.replace(/\\n/g, "\n");
  privateKey = privateKey.replace(/\\\\n/g, "\n");
  
  const pemBody = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "")
    .replace(/[^A-Za-z0-9+/=]/g, "");

  const binaryKey = base64Decode(pemBody);

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
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A2:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

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
    let creds: ServiceAccountCredentials;
    const email = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");
    
    if (email && privateKey) {
      creds = {
        client_email: email,
        private_key: privateKey,
        token_uri: "https://oauth2.googleapis.com/token",
      };
    } else {
      const credentialsJson = Deno.env.get("GOOGLE_CREDENTIALS_JSON");
      if (!credentialsJson) {
        throw new Error("No Google credentials configured");
      }
      creds = parseServiceAccountCredentials(credentialsJson);
    }

    const { answers } = await req.json();
    const a = answers as Record<string, { label: string; score: number }>;

    const timestamp = new Date().toISOString();
    const row: string[] = [
      timestamp,
      a["5"]?.label ?? "",   // Email
      a["1"]?.label ?? "",   // Prénom
      a["2"]?.label ?? "",   // Nom
      a["3"]?.label ?? "",   // Âge
      a["4"]?.label ?? "",   // Téléphone
      a["5"]?.label ?? "",   // Courriel
      a["6"]?.label ?? "",   // Ville
      a["7"]?.label ?? "",   // Porte-à-porte (Oui/Non)
      a["71"]?.label ?? "",  // Industrie & montant
      a["8"]?.label ?? "",   // Échelle 6j/7
      a["9"]?.label ?? "",   // Échelle déplacement
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
