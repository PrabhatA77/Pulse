import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Layers, Gauge, ArrowLeft } from "lucide-react";
import { sessionService } from "../services/session.service";
import { problemService } from "../services/problem.service";
import { getErrorMessage } from "../utils/getErrorMessage";
import { CustomSelect } from "../components/common/CustomSelect";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DURATIONS = [15, 30, 45, 60];

const SessionSetupPage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<string[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("Easy");
  const [duration, setDuration] = useState(30);
  const [starting, setStarting] = useState(false);
  const [tag,setTag] = useState("any");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await problemService.getTopics();
        setTopics(data.map((t) => t.name));
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't load topics"));
      } finally {
        setTopicsLoading(false);
      }
    })();
  }, []);

  const handleStart = async () => {
    setStarting(true);
    try {
      const { data } = await sessionService.start({
        difficulty,
        tag: tag === "any" ? undefined : tag,
        durationMinutes: duration,
      });
      navigate(`/session/${data.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't start the session"));
    } finally {
      setStarting(false);
    }
  };

  const tagOptions = [{ value: "any", label: "Any tag" }, ...topics.map((t) => ({ value: t, label: t }))];
  const difficultyOptions = DIFFICULTIES.map((d) => ({ value: d, label: d }));
  const durationOptions = DURATIONS.map((d) => ({ value: String(d), label: `${d} minutes` }));

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 py-12 dark:bg-[#0e1316]">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to dashboard
        </button>

        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Timed Mock Interview</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          One problem, a real clock. Submitting after time's up still counts, just marked late.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <CustomSelect label="Topic" icon={<Layers className="h-3.5 w-3.5" />} value={tag} onChange={setTag} options={tagOptions} />
          <CustomSelect label="Difficulty" icon={<Gauge className="h-3.5 w-3.5" />} value={difficulty} onChange={setDifficulty} options={difficultyOptions} />
          <CustomSelect
            label="Duration"
            icon={<Clock className="h-3.5 w-3.5" />}
            value={String(duration)}
            onChange={(v) => setDuration(Number(v))}
            options={durationOptions}
          />
        </div>

        <button
          onClick={handleStart}
          disabled={starting || topicsLoading}
          className="mt-6 w-full rounded-xl bg-[#1a3a5c] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
        >
          {starting ? "Starting…" : "Start Session"}
        </button>
      </div>
    </div>
  );
};

export default SessionSetupPage;