import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode, decode as base64Decode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1pqeuCD4m9p-2IbAnwyWMQRvYtWgGNRi-JRfR0OaSOMc";

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
  // Try standard JSON parse first
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.client_email && parsed?.private_key) {
      return { client_email: parsed.client_email, private_key: parsed.private_key, token_uri: parsed.token_uri || "https://oauth2.googleapis.com/token" };
    }
  } catch {
    // Fall through to regex extraction
  }

  // Try wrapping with braces
  try {
    const parsed = JSON.parse(`{${raw.trim()}}`);
    if (parsed?.client_email && parsed?.private_key) {
      return { client_email: parsed.client_email, private_key: parsed.private_key, token_uri: parsed.token_uri || "https://oauth2.googleapis.com/token" };
    }
  } catch {
    // Fall through to regex extraction
  }

  // Regex extraction fallback — works even with broken JSON formatting
  const emailMatch = raw.match(/"client_email"\s*:\s*"([^"]+)"/);
  const tokenUriMatch = raw.match(/"token_uri"\s*:\s*"([^"]+)"/);

  // Private key is special — it contains \n inside the value
  const pkMatch = raw.match(/"private_key"\s*:\s*"(-----BEGIN PRIVATE KEY-----[^"]*-----END PRIVATE KEY-----\\n)"/);

  if (emailMatch && pkMatch) {
    console.log("Parsed credentials via regex fallback");
    return {
      client_email: emailMatch[1],
      private_key: pkMatch[1],
      token_uri: tokenUriMatch?.[1] || "https://oauth2.googleapis.com/token",
    };
  }

  throw new Error(
    `GOOGLE_CREDENTIALS_JSON is invalid. Could not extract client_email and private_key. Ensure the full JSON from credentials.json is saved as the secret value.`
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

  // Parse PEM private key - handle various escape formats
  let privateKey = creds.private_key;
  // Replace literal \n sequences with actual newlines
  privateKey = privateKey.replace(/\\n/g, "\n");
  // Also handle double-escaped \\n
  privateKey = privateKey.replace(/\\\\n/g, "\n");
  
  const pemBody = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "")
    // Remove any non-base64 characters
    .replace(/[^A-Za-z0-9+/=]/g, "");

  console.log("PEM body length:", pemBody.length);

  // Use Deno std base64 decode instead of atob
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
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });

  const data = await res.json();
  console.log("Sheets API response status:", res.status);
  console.log("Sheets API response body:", JSON.stringify(data));
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
    // Try individual secrets first, fall back to JSON
    let creds: ServiceAccountCredentials;
    const email = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    const privateKey = Deno.env.get("GOOGLE_PRIVATE_KEY");
    
    if (email && privateKey) {
      console.log("Using individual secrets. Email:", email);
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
      console.log("CREDENTIALS_JSON starts with:", JSON.stringify(credentialsJson.substring(0, 100)));
      creds = parseServiceAccountCredentials(credentialsJson);
    }
    console.log("Using client_email:", creds.client_email);

    const { answers, totalScore, qualified } = await req.json();
    const a = answers as Record<string, { label: string; score: number }>;

    const timestamp = new Date().toISOString();
    const row: string[] = [
      timestamp,                                // Timestamp
      a["5"]?.label ?? "",                       // Email Address
      a["1"]?.label ?? "",                       // Prénom
      a["2"]?.label ?? "",                       // Nom
      a["3"]?.label ?? "",                       // Âge
      a["4"]?.label ?? "",                       // Numéro de téléphone
      a["5"]?.label ?? "",                       // Adresse courriel
      a["6"]?.label ?? "",                       // Ville de résidence
      a["7"]?.label ?? "",                       // Expérience porte-à-porte
      a["8"]?.label ?? "",                       // Q1 environnement
      a["8"] ? String(a["8"].score) : "",        // Score question 1
      a["9"]?.label ?? "",                       // Q2 inacceptable
      a["9"] ? String(a["9"].score) : "",        // Score question 2
      a["10"]?.label ?? "",                      // Q3 type de journée
      a["10"] ? String(a["10"].score) : "",      // Score question 3
      a["11"]?.label ?? "",                      // Q4 situation récente
      a["11"] ? String(a["11"].score) : "",      // Score question 4
      a["12"]?.label ?? "",                      // Q5 objectif important
      a["12"] ? String(a["12"].score) : "",      // Score question 5
      a["13"]?.label ?? "",                      // Q6 mériter ta place
      a["13"] ? String(a["13"].score) : "",      // Score question 6
      a["14"]?.label ?? "",                      // Q7 modèle de travail
      a["14"] ? String(a["14"].score) : "",      // Score question 7
      a["15"]?.label ?? "",                      // Q8 moments de croissance
      a["15"] ? String(a["15"].score) : "",      // Score question 8
      a["16"]?.label ?? "",                      // Q9 sous pression
      a["16"] ? String(a["16"].score) : "",      // Score question 9
      String(totalScore),                        // Column 28
    ];

    const accessToken = await getAccessToken(creds);
    console.log("Access token obtained, calling Sheets API...");
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
