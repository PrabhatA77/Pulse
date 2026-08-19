import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { AdminProblemSummary } from "../../types/admin.types";
import { getErrorMessage } from "../../utils/getErrorMessage";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

const AdminProblemsPage = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<AdminProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const { data } = await adminService.listProblems();
      setProblems(data);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't load problems"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteProblem(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
      toast.success("Problem deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete problem"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to dashboard
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Manage Problems
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {problems.length} problem{problems.length === 1 ? "" : "s"} in the bank
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/problems/new")}
            className="flex items-center justify-center gap-2 self-start rounded-xl bg-[#1a3a5c] px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 dark:bg-[#019bf0]"
          >
            <Plus className="h-4 w-4" />
            Add problem
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
          ) : problems.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              No problems yet — add your first one above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400 dark:border-zinc-800">
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Difficulty</th>
                    <th className="px-5 py-3 font-semibold">Topic</th>
                    <th className="px-5 py-3 font-semibold">Test cases</th>
                    <th className="px-5 py-3 font-semibold">Added</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {problems.map((problem) => (
                    <tr key={problem.id} className="text-zinc-700 dark:text-zinc-300">
                      <td className="px-5 py-3 font-medium text-zinc-900 dark:text-white">
                        {problem.title}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3">{problem.topic}</td>
                      <td className="px-5 py-3">{problem.testCaseCount}</td>
                      <td className="px-5 py-3 text-zinc-400">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/problems/${problem.id}`)}
                            className="rounded-lg p-1.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(problem.id, problem.title)}
                            disabled={deletingId === problem.id}
                            className="rounded-lg p-1.5 text-zinc-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProblemsPage;