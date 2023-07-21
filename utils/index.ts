export function getDateXMonthsFromNow(months: number) {
  return new Date(new Date().setMonth(new Date().getMonth() + months));
}

export function getDateXDaysFromNow(days: number) {
  return new Date(new Date().setDate(new Date().getDate() + days));
}
