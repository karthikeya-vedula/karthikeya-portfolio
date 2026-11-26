export default async function handler(req, res) {
  const rawUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const supabaseUrl = rawUrl.trim().replace(/\/+$/, "");
  const supabaseKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ""
  ).trim();
  const rowId = 1;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "SUPABASE_URL or SUPABASE_ANON_KEY missing on Vercel" });
  }

  const headers = { apikey: supabaseKey };
  if (!supabaseKey.startsWith("sb_publishable_")) {
    headers.Authorization = `Bearer ${supabaseKey}`;
  }

  const endpoint = `${supabaseUrl}/rest/v1/portfolio_config`;

  try {
    if (req.method === "GET") {
      const response = await fetch(`${endpoint}?id=eq.${rowId}&select=data`, { headers });
      const rows = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: rows });
      }
      return res.status(200).json({ data: rows?.[0]?.data || null });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { data } = body || {};
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          id: rowId,
          data,
          updated_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({ error: errText });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    const detail = err?.cause?.code || err?.cause?.message || err.message || "Proxy fetch failed";
    return res.status(500).json({ error: `Proxy error: ${detail}` });
  }
}