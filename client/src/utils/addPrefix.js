export function addAvatarPrefix(avatar) {
  if (avatar === null || undefined) return '/static/mock-images/avatars/avatar_default.jpg';
  return `/static/avatar/${avatar}`;
}

export function addCoverPrefix(cover) {
  return `/static/cover/${cover}`;
}
