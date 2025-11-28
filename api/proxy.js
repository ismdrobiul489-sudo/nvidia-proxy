export default async function handler(req, res) {
  const apiKey = process.env.NVIDIA_API_KEY;

  // Allow CORS so browser clients can call directly
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Client must send full payload (model, prompt, etc.)
  const { model, ...payload } = req.body || {};

  if (!model) {
    return res.status(400).json({ error: "Missing 'model' in request body" });
  }

  const invokeUrl = `https://ai.api.nvidia.com/v1/genai/${model}`;

  try {
    const response = await fetch(invokeUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({
        error: `Invocation failed with status ${response.status}`,
        details: errBody
      });
    }

    const responseBody = await response.json();
    return res.status(200).json(responseBody);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
