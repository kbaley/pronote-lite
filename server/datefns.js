exports.getTodayWithoutTime = () => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today;
}

exports.getSundayWithoutTime = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const newDate = new Date(today.setDate(diff));
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}
