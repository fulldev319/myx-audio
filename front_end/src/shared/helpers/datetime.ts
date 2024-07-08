import format from 'date-fns/format';
import intervalToDuration from 'date-fns/intervalToDuration';

export const formatDateTime = (date: Date) => date.toLocaleString();

export const formatDateTimeWithNA = (date: Date | undefined) =>
  date ? formatDateTime(date) : 'N/A';

export const formatSecondsDuration = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  return [duration.hours, duration.minutes, duration.seconds]
    .map((value) => (value || 0).toString().padStart(2, '0'))
    .join(':');
};

export const formatDateDefault = (
  date: string | number | Date = new Date()
) => {
  if (date instanceof Date) {
    return format(date, 'dd MMM yyyy');
  }

  return format(new Date(date), 'dd MMM yyyy');
};

export const formatDateTimeDefault = (
  date: string | number | Date = new Date()
) => {
  if (date instanceof Date) {
    return format(date, 'ddd, dd MMM yyyy');
  }

  return format(new Date(date), 'dd MMM yyyy');
};
