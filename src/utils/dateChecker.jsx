export function isDateInPast(date) {
  const now = new Date();
  // Zero out the time part
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date.getTime() < now.getTime();
}