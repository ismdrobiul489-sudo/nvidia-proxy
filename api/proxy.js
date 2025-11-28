export default async function handler(req, res) {
  const invokeUrl = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell";

  // Read API key from environment variables
  const apiKey = process.env.NVIDIA_API_KEY;

  // Use client payload if provided, otherwise default values
  const payload = req.body || {
    prompt: "a simple coffee shop interior",
    width: 1024,
    height: 1024,
    seed: 0,
    steps: 4
  };

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
