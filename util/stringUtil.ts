// Thx ChatGPT
export const timeAgo = (dateString: string, timeString: string): string => {
  const now = new Date();
  const [year, month, day] = dateString.split('-').map((part) => parseInt(part, 10));
  const [hours, minutes, rawSeconds] = timeString.split(':').map(Number);
  const seconds = Math.round(rawSeconds);
  const inputDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

  const units = [
    { value: 60, label: 'second' },
    { value: 60, label: 'minute' },
    { value: 24, label: 'hour' },
    { value: 30.44, label: 'day' },
    { value: 12, label: 'month' },
  ];

  let diff = (now.getTime() - inputDate.getTime()) / 1000;

  for (const unit of units) {
    const quotient = diff / unit.value;
    if (quotient < 1) {
      return `${Math.floor(diff)} ${unit.label}${Math.floor(diff) > 1 ? 's' : ''} ago`;
    }
    diff = quotient;
  }

  return `${Math.floor(diff)} year${Math.floor(diff) > 1 ? 's' : ''} ago`;
};

export const localDateTime = (dateString: string, timeString: string): string => {
  const [year, month, day] = dateString.split('-').map((part) => parseInt(part, 10));
  const [hours, minutes, rawSeconds] = timeString.split(':').map((part) => parseFloat(part));
  const seconds = Math.round(rawSeconds);
  const inputDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  }).format(inputDate);

  return `on ${formattedDate}`;
};
