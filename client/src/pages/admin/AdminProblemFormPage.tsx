import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2, Layers, Gauge, Code2 } from "lucide-react";

import { adminService } from "../../services/admin.service";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  PARAM_TYPES,
  DIFFICULTIES,
  type ParamType,
  type Difficulty,
  type ProblemFormPayload,
  type AdminTopic,
} from "../../types/admin.types";
import { CustomSelect } from "../../components/common/CustomSelect";

interface ParamFormState {
  name: string;
  type: ParamType;
}

interface TestCaseFormState {
  inputText: string;
  expectedOutputText: string;
  isHidden: boolean;
  explanation: string;
}

const TOPIC_BADGES: Record<string, string> = {
  Arrays: "ARR",
  Strings: "STR",
  "Linked List": "LL",
  "Stacks & Queues": "STK",
  Trees: "TREE",
  Graphs: "GRP",
  "Dynamic Programming": "DP",
  "Recursion & BackTracking": "REC",
  "Sorting & Searching": "SRT",
  Greedy: "GRD",
};

const DIFFICULTY_DOTS: Record<string, string> = {
  Easy: "bg-green-500",
  Medium: "bg-amber-500",
  Hard: "bg-red-500",
};

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition-all duration-300 focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#019bf0] dark:focus:ring-[#019bf0]/30";
const labelClass =
  "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const sectionClass =
  "rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900";

const emptyParam = (): ParamFormState => ({ name: "", type: "int" });
const emptyTestCase = (): TestCaseFormState => ({
  inputText: "{}",
  expectedOutputText: "",
  isHidden: false,
  explanation: "",
});

const AdminProblemFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [topic, setTopic] = useState<string>("");
  const [topics, setTopics] = useState<AdminTopic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState<string[]>([""]);
  const [functionName, setFunctionName] = useState("");
  const [parameters, setParameters] = useState<ParamFormState[]>([
    emptyParam(),
  ]);
  const [returnType, setReturnType] = useState<ParamType>("int");
  const [testCases, setTestCases] = useState<TestCaseFormState[]>([
    emptyTestCase(),
  ]);
  const [expectedTimeComplexity, setExpectedTimeComplexity] = useState("");
  const [expectedSpaceComplexity, setExpectedSpaceComplexity] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await adminService.getProblem(id);
        setTitle(data.title);
        setDifficulty(data.difficulty);
        setTopic(data.topic);
        setDescription(data.description);
        setConstraints(data.constraints.length > 0 ? data.constraints : [""]);
        setFunctionName(data.functionName);
        setParameters(
          data.parameters.length > 0 ? data.parameters : [emptyParam()],
        );
        setReturnType(data.returnType);
        setTestCases(
          data.testCases.length > 0
            ? data.testCases.map((tc) => ({
                inputText: JSON.stringify(tc.input, null, 2),
                expectedOutputText: JSON.stringify(tc.expectedOutput),
                isHidden: tc.isHidden,
                explanation: tc.explanation ?? "",
              }))
            : [emptyTestCase()],
        );
        setExpectedTimeComplexity(data.expectedTimeComplexity);
        setExpectedSpaceComplexity(data.expectedSpaceComplexity);
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't load problem"));
        navigate("/admin/problems");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await adminService.listTopics();
        setTopics(data);
        if (!id && data.length > 0) {
          setTopic((current) => current || data[0].name);
        }
      } catch (error) {
        toast.error(getErrorMessage(error, "Couldn't load topics"));
      } finally {
        setTopicsLoading(false);
      }
    })();
  }, [id]);

  const updateConstraint = (i: number, value: string) =>
    setConstraints((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  const addConstraint = () => setConstraints((prev) => [...prev, ""]);
  const removeConstraint = (i: number) =>
    setConstraints((prev) => prev.filter((_, idx) => idx !== i));

  const updateParam = (i: number, patch: Partial<ParamFormState>) =>
    setParameters((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    );
  const addParam = () => setParameters((prev) => [...prev, emptyParam()]);
  const removeParam = (i: number) =>
    setParameters((prev) => prev.filter((_, idx) => idx !== i));

  const updateTestCase = (i: number, patch: Partial<TestCaseFormState>) =>
    setTestCases((prev) =>
      prev.map((tc, idx) => (idx === i ? { ...tc, ...patch } : tc)),
    );
  const addTestCase = () => setTestCases((prev) => [...prev, emptyTestCase()]);
  const removeTestCase = (i: number) =>
    setTestCases((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !functionName.trim() || !description.trim()) {
      toast.error("Title, description, and function name are required");
      return;
    }
    if (parameters.some((p) => !p.name.trim())) {
      toast.error("Every parameter needs a name");
      return;
    }

    const parsedTestCases: ProblemFormPayload["testCases"] = [];
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      try {
        const input = JSON.parse(tc.inputText);
        const expectedOutput = JSON.parse(tc.expectedOutputText);
        parsedTestCases.push({
          input,
          expectedOutput,
          isHidden: tc.isHidden,
          explanation: tc.explanation.trim() || undefined,
        });
      } catch {
        toast.error(
          `Test case ${i + 1}: input/expected output must be valid JSON`,
        );
        return;
      }
    }

    const payload: ProblemFormPayload = {
      title: title.trim(),
      difficulty,
      topic,
      description: description.trim(),
      constraints: constraints.map((c) => c.trim()).filter(Boolean),
      functionName: functionName.trim(),
      parameters: parameters.map((p) => ({
        name: p.name.trim(),
        type: p.type,
      })),
      returnType,
      testCases: parsedTestCases,
      expectedTimeComplexity: expectedTimeComplexity.trim(),
      expectedSpaceComplexity: expectedSpaceComplexity.trim(),
    };

    setSaving(true);
    try {
      if (isEditMode && id) {
        await adminService.updateProblem(id, payload);
        toast.success("Problem updated");
      } else {
        await adminService.createProblem(payload);
        toast.success("Problem added");
      }
      navigate("/admin/problems");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't save problem"));
    } finally {
      setSaving(false);
    }
  };

  const difficultyOptions = DIFFICULTIES.map((d) => ({
    value: d as Difficulty,
    label: d,
    dotClass: DIFFICULTY_DOTS[d],
  }));

  const topicOptions = topics.map((t) => ({
    value: t.name,
    label: t.name,
    badge: TOPIC_BADGES[t.name] ?? "CODE",
  }));

  const paramTypeOptions = PARAM_TYPES.map((t) => ({
    value: t as ParamType,
    label: t,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-[#0e1316]">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 py-8 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <button
            onClick={() => navigate("/admin/problems")}
            className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to problems
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {isEditMode ? "Edit Problem" : "Add Problem"}
          </h1>
        </div>

        {!topicsLoading && topics.length === 0 && (
          <p className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            No topics exist yet.{" "}
            <button
              type="button"
              onClick={() => navigate("/admin/topics")}
              className="underline"
            >
              Add one first
            </button>
            .
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Basics */}
          <div className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Basics
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CustomSelect
                  label="Difficulty"
                  icon={<Gauge className="h-3.5 w-3.5" />}
                  value={difficulty}
                  onChange={(val) => setDifficulty(val as Difficulty)}
                  options={difficultyOptions}
                />
                <CustomSelect
                  label="Topic"
                  icon={<Layers className="h-3.5 w-3.5" />}
                  value={topic}
                  onChange={(val) => setTopic(val)}
                  options={topicOptions}
                />
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Expected time complexity</label>
                  <input
                    className={inputClass}
                    value={expectedTimeComplexity}
                    onChange={(e) => setExpectedTimeComplexity(e.target.value)}
                    placeholder="O(n)"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Expected space complexity
                  </label>
                  <input
                    className={inputClass}
                    value={expectedSpaceComplexity}
                    onChange={(e) => setExpectedSpaceComplexity(e.target.value)}
                    placeholder="O(1)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className={sectionClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Constraints
              </h2>
              <button
                type="button"
                onClick={addConstraint}
                className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] dark:text-[#019bf0]"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {constraints.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    value={c}
                    onChange={(e) => updateConstraint(i, e.target.value)}
                    placeholder="1 <= nums.length <= 10^4"
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(i)}
                    className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Function signature */}
          <div className={sectionClass}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Function Signature
            </h2>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Function name</label>
                  <input
                    className={inputClass}
                    value={functionName}
                    onChange={(e) => setFunctionName(e.target.value)}
                    placeholder="twoSum"
                  />
                </div>
                <CustomSelect
                  label="Return type"
                  icon={<Code2 className="h-3.5 w-3.5" />}
                  value={returnType}
                  onChange={(val) => setReturnType(val as ParamType)}
                  options={paramTypeOptions}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className={labelClass}>Parameters</label>
                  <button
                    type="button"
                    onClick={addParam}
                    className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] dark:text-[#019bf0]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {parameters.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className={inputClass}
                        value={p.name}
                        onChange={(e) =>
                          updateParam(i, { name: e.target.value })
                        }
                        placeholder="paramName"
                      />
                      <div className="w-36 shrink-0">
                        <CustomSelect
                          value={p.type}
                          onChange={(val) =>
                            updateParam(i, { type: val as ParamType })
                          }
                          options={paramTypeOptions}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeParam(i)}
                        className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Test cases */}
          <div className={sectionClass}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Test Cases
              </h2>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-1 text-xs font-semibold text-[#1a3a5c] dark:text-[#019bf0]"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {testCases.map((tc, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">
                      Test case {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTestCase(i)}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={labelClass}>
                        Input (JSON object, keyed by parameter name)
                      </label>
                      <textarea
                        className={`${inputClass} min-h-20 resize-y font-mono text-xs`}
                        value={tc.inputText}
                        onChange={(e) =>
                          updateTestCase(i, { inputText: e.target.value })
                        }
                        placeholder='{"nums": [2,7,11,15], "target": 9}'
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Expected output (JSON value)
                      </label>
                      <input
                        className={`${inputClass} font-mono text-xs`}
                        value={tc.expectedOutputText}
                        onChange={(e) =>
                          updateTestCase(i, {
                            expectedOutputText: e.target.value,
                          })
                        }
                        placeholder="[0,1]"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Explanation (optional)
                      </label>
                      <input
                        className={inputClass}
                        value={tc.explanation}
                        onChange={(e) =>
                          updateTestCase(i, { explanation: e.target.value })
                        }
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) =>
                          updateTestCase(i, { isHidden: e.target.checked })
                        }
                      />
                      Hidden test case
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#1a3a5c] px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
          >
            {saving ? "Saving…" : isEditMode ? "Save changes" : "Add problem"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProblemFormPage;
