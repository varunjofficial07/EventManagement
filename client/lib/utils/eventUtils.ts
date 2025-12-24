// Helper functions for event formatting

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (startTime: string, endTime?: string) => {
  const start = new Date(`2000-01-01T${startTime}`);
  const startFormatted = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (endTime) {
    const end = new Date(`2000-01-01T${endTime}`);
    const endFormatted = end.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
};

export const formatDateTime = (dateString: string, timeString: string) => {
  const date = formatDate(dateString);
  const time = formatTime(timeString);
  return `${date} at ${time}`;
};

