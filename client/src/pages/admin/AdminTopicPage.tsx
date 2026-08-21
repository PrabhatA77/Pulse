import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { AdminTopic } from "../../types/admin.types";
import { getErrorMessage } from "../../utils/getErrorMessage";

const AdminTopicsPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await adminService.listTopics();
        if (isMounted) setTopics(data);
      } catch (error) {
        if (isMounted) toast.error(getErrorMessage(error, "Couldn't load topics"));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    const name = newTopic.trim();
    if (!name) return;

    setAdding(true);
    try {
      const { data } = await adminService.createTopic(name);
      setTopics((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewTopic("");
      toast.success("Topic added");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't add topic"));
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? Existing problems keep this topic — it just won't be selectable for new ones.`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteTopic(id);
      setTopics((prev) => prev.filter((t) => t.id !== id));
      toast.success("Topic deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete topic"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <button
            onClick={() => navigate("/admin/problems")}
            className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to problems
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Manage Topics
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            {topics.length} topic{topics.length === 1 ? "" : "s"}
          </p>
        </div>

        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            placeholder="e.g. Bit Manipulation"
            className="flex-1 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#019bf0] dark:focus:ring-[#019bf0]/30"
          />
          <button
            type="submit"
            disabled={adding || !newTopic.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#1a3a5c] px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
          ) : topics.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500 dark:text-zinc-400">
              No topics yet — add your first one above.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {topics.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{t.name}</span>
                  <button
                    onClick={() => handleDelete(t.id, t.name)}
                    disabled={deletingId === t.id}
                    className="rounded-lg p-1.5 text-zinc-500 transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopicsPage;