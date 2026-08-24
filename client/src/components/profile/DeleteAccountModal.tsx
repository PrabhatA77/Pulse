import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getErrorMessage } from "../../utils/getErrorMessage";

const CONFIRM_WORD = "DELETE";

interface DeleteAccountModalProps {
  onClose: () => void;
}

const DeleteAccountModal = ({ onClose }: DeleteAccountModalProps) => {
  const navigate = useNavigate();
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canDelete = confirmText === CONFIRM_WORD;

  const handleDelete = async () => {
    if (!canDelete) return;
    setSubmitting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't delete account"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-xl dark:border-red-900/50 dark:bg-zinc-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-500">
              <AlertTriangle className="h-5 w-5" />
              Delete account
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-400 transition-all duration-300 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            This permanently deletes your account, submissions, and profile
            data. This action can't be undone.
          </p>

          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Type <span className="font-mono font-bold text-red-500">{CONFIRM_WORD}</span> to confirm
            </label>
            <input
              className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition-all duration-300 focus:border-red-400 focus:ring-2 focus:ring-red-400/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_WORD}
              autoComplete="off"
            />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete || submitting}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow transition-all duration-300 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Deleting…" : "Delete my account"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteAccountModal;