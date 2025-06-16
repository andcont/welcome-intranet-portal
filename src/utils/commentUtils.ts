
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getUserProfileImage = (userEmail?: string, users?: Record<string, any>) => {
  if (!userEmail || !users) return null;
  return users[userEmail]?.profileImage || null;
};
