
export function getInitials(
  name: string,
): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

export function formatDate(
  value: string | Date,
): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatTime(
  value: string | Date,
): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatDateTime(
  value: string | Date,
): string {
  return `${formatDate(value)} à ${formatTime(value)}`
}

export function formatDay(
  value: string | Date,
): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(value))
}

export function getGreeting(
  date = new Date(),
): string {
  const hour = date.getHours()

  if (hour < 18) {
    return 'Bonjour'
  }

  return 'Bonsoir'
}
