export const parseDate = (date: Date, withTime?: boolean): string => {
  const parseNumber = (number: number) => {
    return number < 10 ? '0' + number : number;
  };

  const day = parseNumber(date.getDate());
  const month = parseNumber(date.getMonth() + 1);

  let dateString = `${day}-${month}`;

  if (withTime) {
    const hour = parseNumber(date.getHours());
    const minutes = parseNumber(date.getMinutes());

    dateString += ` ${hour}:${minutes}`;
  }

  return dateString;
}