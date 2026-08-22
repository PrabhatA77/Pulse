import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, Trash2, Loader2, Target, CheckCircle2 } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { dashboardService } from "../services/dashboard.service";
import { getErrorMessage } from "../utils/getErrorMessage";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 outline-none transition-all duration-300 focus:border-[#1a3a5c] focus:ring-2 focus:ring-[#1a3a5c]/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#019bf0] dark:focus:ring-[#019bf0]/30";
const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300";
const sectionClass =
  "rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900";

interface ProfileInfoFormProps {
  initialFullName: string;
  initialBio: string;
  username: string;
  email: string;
  savingProfile: boolean;
  onSave: (fullName: string, bio: string) => Promise<void>;
}

const ProfileInfoForm = ({
  initialFullName,
  initialBio,
  username,
  email,
  savingProfile,
  onSave,
}: ProfileInfoFormProps) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(fullName, bio);
  };

  return (
    <form onSubmit={handleSubmit} className={sectionClass}>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Profile Info
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            className={inputClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            maxLength={60}
            placeholder="Add your name"
          />
        </div>
        <div>
          <label className={labelClass}>Bio</label>
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={160}
            placeholder="A short line about yourself"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Username</label>
            <input className={`${inputClass} opacity-60`} value={username} disabled />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={`${inputClass} opacity-60`} value={email} disabled />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="self-start rounded-xl bg-[#1a3a5c] px-4 py-2.5 text-sm font-semibold text-white shadow transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
        >
          {savingProfile ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, uploadAvatar, removeAvatar, changePassword } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const [stats, setStats] = useState<{ totalInterviews: number; totalSolved: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await dashboardService.get();
        setStats(data.stats);
      } catch {
        // Non-critical — profile page still works without stats.
      }
    })();
  }, []);

  const handleAvatarSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setAvatarBusy(true);
    try {
      await uploadAvatar(file);
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't upload photo"));
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarBusy(true);
    try {
      await removeAvatar();
      toast.success("Profile photo removed");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't remove photo"));
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleProfileSubmit = async (fullName: string, bio: string) => {
    setSavingProfile(true);
    try {
      await updateProfile(fullName.trim(), bio.trim());
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't change password"));
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  const initials = user.username.slice(0, 1).toUpperCase();

  return (
    <div className="min-h-screen w-full px-4 py-8 dark:bg-[#0e1316] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition-all duration-300 hover:text-[#1a3a5c] dark:text-zinc-400 dark:hover:text-[#019bf0]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Profile
          </h1>
        </div>

        {/* Avatar + quick stats */}
        <div className={sectionClass}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1a3a5c] text-3xl font-semibold text-white dark:bg-[#019bf0]">
                  {initials}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarBusy}
                title="Change photo"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a3a5c] text-white shadow-lg transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#019bf0]"
              >
                {avatarBusy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {user.fullName || user.username}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>

              {user.avatarUrl && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  disabled={avatarBusy}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-500 transition-all duration-300 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove photo
                </button>
              )}

              {stats && (
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" /> {stats.totalInterviews} attempts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {stats.totalSolved} solved
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editable profile info */}
        <ProfileInfoForm
          key={`${user.fullName ?? ""}-${user.bio ?? ""}`}
          initialFullName={user.fullName ?? ""}
          initialBio={user.bio ?? ""}
          username={user.username}
          email={user.email}
          savingProfile={savingProfile}
          onSave={handleProfileSubmit}
        />

        {/* Security */}
        <div className={sectionClass}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Security
          </h2>

          {user.authProvider !== "local" ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You signed in with Google — password changes aren't available for this account.
            </p>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Current password</label>
                <input
                  type="password"
                  className={inputClass}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>New password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className={labelClass}>Confirm new password</label>
                  <input
                    type="password"
                    className={inputClass}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={changingPassword}
                className="self-start rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all duration-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {changingPassword ? "Updating…" : "Change password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;