export function getDateXMonthsFromNow(months: number) {
  return new Date(new Date().setMonth(new Date().getMonth() + months));
}

export function getDateXDaysFromNow(days: number) {
  return new Date(new Date().setDate(new Date().getDate() + days));
}

export function getDateXMinutesFromNow(minutes: number) {
  return new Date(new Date().setMinutes(new Date().getMinutes() + minutes));
}

export function getExactStartTimeFromDateField(startsAt: string) {
  const selectedDate = new Date(`${startsAt} 00:00:00`);
  const isToday = selectedDate.getDate() === new Date().getDate();

  return isToday
    ? new Date(
        new Date().setMinutes(new Date().getMinutes() + 20)
      ).toISOString()
    : new Date(startsAt).toISOString();
}
