export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('en-GB', formatOptions).format(date);
}
