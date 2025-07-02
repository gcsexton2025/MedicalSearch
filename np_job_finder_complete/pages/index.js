import React, { useEffect, useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("nurse educator");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/jobs?q=${encodeURIComponent(search)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setResults(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setResults([]);
      });
  }, [search]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Remote Nursing Education Jobs</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search jobs..."
        className="border p-2 w-full"
      />
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      <div className="grid gap-4">
        {results.map((job, i) => (
          <div key={i} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company} · {job.location} · {job.type}</p>
            <p className="mt-2">{job.description}</p>
            <a href={job.applyUrl} target="_blank" className="text-blue-500 underline mt-2 inline-block">Apply</a>
            <span className="block text-xs text-gray-400 mt-1">Source: {job.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
