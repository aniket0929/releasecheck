import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRelease, toggleStep, updateRelease, deleteRelease, type Release } from "../api/api";
import STEPS from "../lib/steps";

export default function ReleaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [release, setRelease] = useState<Release | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    fetchRelease();
  }, [id]);

  const fetchRelease = async () => {
    const data = await getRelease(Number(id));
    setRelease(data);
    setAdditionalInfo(data.additional_info || "");
  };

  const handleToggle = async (stepIndex: number, current: boolean) => {
    await toggleStep(Number(id), stepIndex, !current);
    fetchRelease();
  };

  const handleSave = async () => {
    await updateRelease(Number(id), additionalInfo);
    navigate("/");
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this release?")) return;
    await deleteRelease(Number(id));
    navigate("/");
  };

  if (!release) return <p className="text-center mt-20 text-slate-400">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 px-5 font-sans text-slate-700">
      <div className="text-center mb-10">
        <h1 className="text-[2.2rem] font-bold text-slate-800 tracking-tight m-0">ReleaseCheck</h1>
        <p className="text-slate-500 mt-2 font-medium">Your all-in-one release checklist tool</p>
      </div>

      <div className="bg-white border border-slate-300 pb-8 rounded-sm">
        {/* Breadcrumb row */}
        <div className="flex justify-between items-center p-5 border-b border-slate-300 mb-6">
          <div className="flex items-center gap-2 text-lg font-medium">
            <button onClick={() => navigate("/")} className="text-[#6c5dd3] hover:underline">All releases</button>
            <span className="text-slate-400">›</span>
            <span className="text-[#aab2ca]">{release.name}</span>
          </div>
          <button 
            onClick={handleDelete}
            className="bg-[#6c5dd3] hover:bg-[#5b4ebf] text-white flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-colors"
          >
            Delete
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
          </button>
        </div>

        <div className="px-5">
          {/* Info blocks */}
          <div className="flex gap-6 mb-8 w-1/2">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Release</label>
              <div className="p-2 border border-slate-300 rounded bg-white text-slate-800 font-medium">
                {release.name}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
              <div className="p-2 border border-slate-300 rounded bg-white text-slate-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {new Date(release.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Steps checklist */}
          <div className="mb-8 space-y-3">
            {STEPS.map((stepLabel, index) => {
              const isCompleted = release.steps?.[index] ?? false;
              return (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => handleToggle(index, isCompleted)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-sm checked:bg-[#6c5dd3] checked:border-[#6c5dd3] transition-colors cursor-pointer"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 pointer-events-none hidden peer-checked:block text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-slate-600 font-medium select-none group-hover:text-slate-800 transition-colors">
                    {stepLabel}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Additional info */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Additional remarks / tasks</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Please enter any other important notes for the release"
              className="w-full p-4 border border-slate-300 rounded h-40 resize-y focus:outline-none focus:ring-2 focus:ring-[#6c5dd3] text-slate-600 font-medium"
            />
            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSave} 
                className="bg-[#6c5dd3] hover:bg-[#5b4ebf] text-white flex items-center gap-2 rounded px-6 py-2 text-sm font-medium transition-colors"
              >
                Save
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}