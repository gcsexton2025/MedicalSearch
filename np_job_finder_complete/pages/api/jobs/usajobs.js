export default async function handler(req, res) {
  const { q = "nurse educator" } = req.query;

  try {
    const response = await fetch(
      `https://data.usajobs.gov/api/search?Keyword=${encodeURIComponent(q)}&RemoteIndicator=true`,
      {
        headers: {
          "Host": "data.usajobs.gov",
          "User-Agent": process.env.USAJOBS_USER_AGENT,
          "Authorization-Key": process.env.USAJOBS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch data from USAJobs." });
    }

    const data = await response.json();

    const jobs = data.SearchResult.SearchResultItems.map((item) => {
      const job = item.MatchedObjectDescriptor;
      return {
        id: item.MatchedObjectId,
        title: job.PositionTitle,
        company: job.OrganizationName,
        location: job.PositionLocationDisplay,
        type: job.PositionSchedule?.[0]?.Name || "N/A",
        description: job.UserArea.Details.JobSummary,
        applyUrl: job.PositionURI,
        source: "USAJobs",
      };
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("USAJobs fetch error:", error);
    res.status(500).json({ error: "Error fetching USAJobs data." });
  }
}
