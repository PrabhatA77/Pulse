import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { AdminProblemSummary } from "../../types/admin.types";
import { DIFFICULTIES } from "../../types/admin.types";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { CustomSelect } from "../../components/common/CustomSelect";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

const DIFFICULTY_DOTS: Record<string, string> = {
  Easy: "bg-green-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

const PAGE_SIZE = 10;

const AdminProblemsPage = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<AdminProblemSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const fetchProblems = async () => {
      try {
        const { data } = await adminService.listProblems();
        if (isMounted) setProblems(data);
      } catch (error) {
        if (isMounted)
          toast.error(getErrorMessage(error, "Couldn't load problems"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProblems();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const filteredProblems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return problems.filter((p) => {
      const matchesSearch =
        query === "" || p.title.toLowerCase().includes(query);
      const matchesDifficulty =
        difficultyFilter === "all" || p.difficulty === difficultyFilter;
      const matchesTag = tagFilter === "all" || (p.tags ?? []).includes(tagFilter);
      return matchesSearch && matchesDifficulty && matchesTag;
    });
  }, [problems, search, difficultyFilter, tagFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / PAGE_SIZE),
  );
  const clampedPage = Math.min(page, totalPages);
  const pagedProblems = filteredProblems.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

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

  const difficultyOptions = [
    { value: "all", label: "All difficulties" },
    ...DIFFICULTIES.map((d) => ({
      value: d,
      label: d,
      dotClass: DIFFICULTY_DOTS[d],
    })),
  ];

  const tagOptions = useMemo(() => {
    const uniqueTags = Array.from(
      new Set(problems.flatMap((p) => p.tags ?? [])),
    ).sort();
    return [
      { value: "all", label: "All tags" },
      ...uniqueTags.map((t) => ({ value: t, label: t })),
    ];
  }, [problems]);

  const difficultyDistribution = useMemo(() => {
    const counts = { Easy: 0, Medium: 0, Hard: 0 };
    for (const p of problems) {
      if (p.difficulty in counts) counts[p.difficulty as keyof typeof counts]++;
    }
    const total = problems.length || 1;
    return (["Easy", "Medium", "Hard"] as const).map((d) => ({
      label: d,
      count: counts[d],
      pct: (counts[d] / total) * 100,
    }));
  }, [problems]);

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
              {filteredProblems.length} of {problems.length} problem
              {problems.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex gap-5">
            <button
              onClick={() => navigate("/admin/problems/new")}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-[#1a3a5c] px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 dark:bg-[#019bf0]"
            >
              <Plus className="h-4 w-4" />
              Add problem
            </button>

            <button
              onClick={() => navigate("/admin/topics")}
              className="flex items-center justify-center gap-2 self-start rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80"
            >
              Manage Topics
            </button>
          </div>
        </div>

        {problems.length > 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              {difficultyDistribution.map((d) => (
                <div
                  key={d.label}
                  style={{ width: `${d.pct}%` }}
                  className={
                    d.label === "Easy"
                      ? "bg-green-500"
                      : d.label === "Medium"
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }
                  title={`${d.label}: ${d.count}`}
                />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
              {difficultyDistribution.map((d) => (
                <span key={d.label} className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      d.label === "Easy"
                        ? "bg-green-500"
                        : d.label === "Medium"
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                  />
                  {d.label}: {d.count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search + Dropdowns */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by title…"
              className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#019bf0] dark:focus:ring-[#019bf0]/30"
            />
          </div>

          <CustomSelect
            value={difficultyFilter}
            onChange={(val) => {
              setDifficultyFilter(val);
              setPage(1);
            }}
            options={difficultyOptions}
            className="sm:w-48"
          />

          <CustomSelect
            value={tagFilter}
            onChange={(val) => {
              setTagFilter(val);
              setPage(1);
            }}
            options={tagOptions}
            className="sm:w-56"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              Loading…
            </p>
          ) : problems.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              No problems yet — add your first one above.
            </p>
          ) : filteredProblems.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              No problems match your search/filters.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400 dark:border-zinc-800">
                      <th className="px-5 py-3 font-semibold">Title</th>
                      <th className="px-5 py-3 font-semibold">Difficulty</th>
                      <th className="px-5 py-3 font-semibold">Tags</th>
                      <th className="px-5 py-3 font-semibold">Test cases</th>
                      <th className="px-5 py-3 font-semibold">Added</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {pagedProblems.map((problem) => (
                      <tr
                        key={problem.id}
                        className="text-zinc-700 dark:text-zinc-300"
                      >
                        <td className="px-5 py-3 font-medium text-zinc-900 dark:text-white">
                          {problem.title}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLOR[problem.difficulty]}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {problem.tags?.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3">{problem.testCaseCount}</td>
                        <td className="px-5 py-3 text-zinc-400">
                          {new Date(problem.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/problems/${problem.id}`)
                              }
                              className="rounded-lg p-1.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                              aria-label="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(problem.id, problem.title)
                              }
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Page {clampedPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={clampedPage === 1}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Prev
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={clampedPage === totalPages}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-all duration-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProblemsPage;