import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReleases, createRelease, deleteRelease, type Release } from "../api/api";

export default function ReleaseList() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    const data = await getReleases();
    setReleases(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!name || !date) return alert("Name and date are required!");
    await createRelease({ name, date, additional_info: additionalInfo });
    setName("");
    setDate("");
    setAdditionalInfo("");
    setShowForm(false);
    fetchReleases();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this release?")) return;
    await deleteRelease(id);
    fetchReleases();
  };

  return (
    <div className="max-w-4xl mx-auto my-10 px-5 font-sans text-slate-700">
      <div className="text-center mb-10">
        <h1 className="text-[2.2rem] font-bold text-slate-800 tracking-tight m-0">ReleaseCheck</h1>
        <p className="text-slate-500 mt-2 font-medium">Your all-in-one release checklist tool</p>
      </div>

      <div className="bg-white border border-slate-300">
        {/* Header row */}
        <div className="flex justify-between items-center p-5 border-b border-slate-300">
          <span className="text-[#6c5dd3] font-medium text-lg">All releases</span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#6c5dd3] hover:bg-[#5b4ebf] text-white flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
          >
            New release
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg>
          </button>
        </div>

        {/* New release form */}
        {showForm && (
          <div className="bg-slate-50 p-6 border-b border-slate-300">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Create New Release</h3>
            <div className="space-y-4">
              <input
                placeholder="Release name (e.g. Version 1.0.1)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6c5dd3]"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6c5dd3]"
              />
              <textarea
                placeholder="Additional info (optional)"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded h-24 resize-y focus:outline-none focus:ring-2 focus:ring-[#6c5dd3]"
              />
              <div className="flex gap-2">
                <button onClick={handleCreate} className="bg-[#6c5dd3] hover:bg-[#5b4ebf] text-white px-4 py-2 rounded text-sm font-medium">Save</button>
                <button onClick={() => setShowForm(false)} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-medium hover:bg-slate-50">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <p className="text-center text-slate-400 p-8">Loading...</p>
        ) : releases.length === 0 ? (
          <p className="text-center text-slate-400 p-8">No releases yet. Create one!</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 text-slate-800">
                <th className="p-4 font-bold w-1/3">Release</th>
                <th className="p-4 font-bold w-1/4">Date</th>
                <th className="p-4 font-bold w-1/6">Status</th>
                <th className="p-4 font-bold text-center border-l border-slate-300 w-[100px]"></th>
                <th className="p-4 font-bold text-center border-l border-slate-300 w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {releases.map((r, i) => (
                <tr key={r.id} className={i !== releases.length - 1 ? "border-b border-slate-300" : ""}>
                  <td className="p-4 text-slate-600 font-medium">{r.name}</td>
                  <td className="p-4 text-slate-600 font-medium">
                    {new Date(r.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="p-4 text-slate-600 font-medium capitalize">{r.status}</td>
                  <td className="p-4 border-l border-slate-300 text-slate-600 font-medium whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/release/${r.id}`)}
                      className="flex items-center justify-between w-full hover:text-[#6c5dd3] transition-colors"
                    >
                      <span>View</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-2" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                      </svg>
                    </button>
                  </td>
                  <td className="p-4 border-l border-slate-300 text-slate-600 font-medium whitespace-nowrap">
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="flex items-center justify-between w-full hover:text-red-500 transition-colors"
                    >
                      <span>Delete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-2" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}