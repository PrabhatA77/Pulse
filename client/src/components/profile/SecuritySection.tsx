import { useState } from "react";
import { KeyRound, Trash2 } from "lucide-react";
import type { User } from "../../types/auth.types";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";

const sectionClass =
  "rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900";

interface SecuritySectionProps {
  user: User;
}

const SecuritySection = ({ user }: SecuritySectionProps) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className={sectionClass}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Security
      </h2>

      {user.authProvider === "local" ? (
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="flex w-full items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 text-left transition-all duration-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/60"
        >
          <span className="flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <KeyRound className="h-4 w-4 text-zinc-400" />
            Change password
          </span>
          <span className="text-xs text-zinc-400">Update your password</span>
        </button>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          You signed in with Google — password changes aren't available for this account.
        </p>
      )}

      {/* Danger Zone — visually separated, always last */}
      <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-500">
          Danger Zone
        </h3>
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-500/5 px-4 py-3 text-left transition-all duration-300 hover:bg-red-500/10 dark:border-red-900/50"
        >
          <span className="flex items-center gap-2.5 text-sm font-medium text-red-500">
            <Trash2 className="h-4 w-4" />
            Delete account
          </span>
          <span className="text-xs text-red-400">Permanent — can't be undone</span>
        </button>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
};

export default SecuritySection;