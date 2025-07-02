export default async function handler(req, res) {
  const { q = "nurse educator" } = req.query;

  try {
    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(q)}&where=remote`
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch data from Adzuna." });
    }

    const data = await response.json();

    const jobs = data.results.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      type: job.contract_time || "N/A",
      description: job.description,
      applyUrl: job.redirect_url,
      source: "Adzuna",
    }));

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Adzuna fetch error:", error);
    res.status(500).json({ error: "Error fetching Adzuna jobs." });
  }
}
