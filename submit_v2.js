export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SHEET_API = 'https://script.google.com/macros/s/AKfycbz9h9D2V4MpS9-jBGb3I_b4JuDMWqoZ0U75tEov2g6pKXvW-EHczuEO471aLbUNvfA/exec';

  try {
    // 支援 GET 和 POST
    let params;
    if (req.method === 'POST') {
      // POST body 是 URLSearchParams 格式
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      params = new URLSearchParams(body);
    } else {
      params = new URLSearchParams(req.query);
    }

    const url = SHEET_API + '?' + params.toString();
    await fetch(url);
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
