export function toPublicUser(user: any) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    authProvider: user.authProvider,
    fullName: user.fullName ?? null,
    bio: user.bio ?? null,
    avatarUrl: user.avatarUrl ?? null,
  };
}