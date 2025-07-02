export default async function handler(req, res) {
  const { q = "nurse educator" } = req.query;

  try {
    const sources = [
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/adzuna?q=${q}`).then((res) => res.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/jooble?q=${q}`).then((res) => res.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/usajobs?q=${q}`).then((res) => res.json()).catch(() => []),
    ];

    const [adzuna, jooble, usajobs] = await Promise.all(sources);
    const jobs = [...adzuna, ...jooble, ...usajobs];

    if (jobs.length === 0) {
      return res.status(502).json({ error: "No results returned. External APIs may be unavailable." });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Job API fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch jobs. Please try again later." });
  }
}
