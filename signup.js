// Vercel serverless function: POST /api/signup
// Receives a driver sign-up from the GTC website and stores it in Firebase.
// The Firebase database URL is kept secret in an environment variable
// (FIREBASE_DB_URL) instead of being written into the website's code.

export default async function handler(req, res) {
  // Allow the GitHub Pages site (or any site) to call this API.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browsers send an OPTIONS request first to check it's allowed (CORS
  // preflight). Just say yes and stop.
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }

  const dbUrl = process.env.FIREBASE_DB_URL;
  if (!dbUrl) {
    res.status(500).json({ error: "Server isn't configured yet (missing FIREBASE_DB_URL)." });
    return;
  }

  try {
    const body = req.body || {};
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      res.status(400).json({ error: "A name is required." });
      return;
    }

    // Only store the fields we expect, so nothing unexpected gets saved.
    const record = {
      name,
      country: String(body.country || "").trim(),
      games: String(body.games || "").trim(),
      driverType: String(body.driverType || "").trim(),
      vtc: String(body.vtc || "").trim(),
      truckersMpId: String(body.truckersMpId || "").trim(),
      stream: String(body.stream || "").trim(),
      submittedAt: new Date().toISOString(),
    };

    const firebaseRes = await fetch(dbUrl.replace(/\/$/, "") + "/signups.json", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    if (!firebaseRes.ok) {
      res.status(502).json({ error: "Couldn't save the sign-up right now." });
      return;
    }

    const data = await firebaseRes.json(); // { name: "-Nxxxxx" } — Firebase's generated ID
    res.status(200).json({ ok: true, id: data.name });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong saving the sign-up." });
  }
}
