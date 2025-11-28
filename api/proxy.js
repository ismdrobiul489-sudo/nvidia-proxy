export default async function handler(req, res) {
  const apiKey = process.env.NVIDIA_API_KEY; // Vercel Secrets থেকে পড়বে
  const { model, payload } = req.body;       // কোন মডেল কল করবেন, সেই নাম ও ডেটা

  // NVIDIA NIM endpoint URL গঠন
  const apiUrl = `https://api.nvidia.com/v1/${model}/predict`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
