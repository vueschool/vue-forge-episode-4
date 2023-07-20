export function getDateXMonthsFromNow(months: number) {
  return new Date(new Date().setMonth(new Date().getMonth() + months));
}
