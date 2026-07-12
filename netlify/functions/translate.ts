import { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // Allow the frontend to talk to this function safely
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const params = new URLSearchParams(event.body || "");
    const text = params.get("text") || "";
    const target_lang = params.get("target_lang") || "";
    const source_lang = params.get("source_lang") || "";

    // Pull the key securely directly from Netlify's Environment Variables
    const apiKey = process.env.VITE_DEEPL_API_KEY || "";

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "DeepL API key is missing on Netlify environment setup." }),
      };
    }

    // Determine correct DeepL URL endpoint inside our secure server environment
    const url = apiKey.endsWith(":fx") 
      ? "https://api-free.deepl.com/v2/translate" 
      : "https://api.deepl.com/v2/translate";

    const deeplBody = new URLSearchParams();
    deeplBody.append("text", text);
    deeplBody.append("target_lang", target_lang);
    if (source_lang) deeplBody.append("source_lang", source_lang);

    // Send request server-to-server using standard Authorization header rules
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: deeplBody,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err instanceof Error ? err.message : "Internal Server Error" }),
    };
  }
};
