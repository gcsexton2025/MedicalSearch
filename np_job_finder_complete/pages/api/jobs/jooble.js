export default async function handler(req, res) {
  const { q = "nurse educator" } = req.query;

  try {
    const response = await fetch("https://jooble.org/api/" + process.env.JOOBLE_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: q,
        location: "Remote",
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch data from Jooble." });
    }

    const data = await response.json();

    if (!data.jobs || data.jobs.length === 0) {
      return res.status(200).json([]);
    }

    const jobs = data.jobs.map((job, index) => ({
      id: `jooble-${index}`,
      title: job.title,
      company: job.company,
      location: job.location,
      type: "N/A",
      description: job.snippet,
      applyUrl: job.link,
      source: "Jooble",
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Jooble fetch error:", error);
    res.status(500).json({ error: "Error fetching Jooble jobs." });
  }
}
