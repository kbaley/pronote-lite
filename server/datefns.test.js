require('dotenv').config();
const datefns = require('./datefns');

test('can get Sunday', () => {
  const mockDate = new Date();
  mockDate.setFullYear(2022, 1, 8); // Feb 8, 2022 at the current time
  const spy = jest
    .spyOn(global, 'Date')
    .mockImplementation(() => mockDate);
  const result = datefns.getSundayWithoutTime();
  spy.mockRestore();
  const expectedDate = new Date(2022, 1, 6);
  const diff = result - expectedDate;
  expect(diff).toBe(0);
});

test('can get weekdays between dates', () => {
  const start = new Date(2022, 2, 13, 5, 0, 0, 0);
  const end = new Date(2022, 2, 20, 5, 0, 0, 0);
  const result = datefns.getWeekdaysBetween(start, end);
  expect(result.length).toBe(5);
  expect(result[0].getDate()).toBe(14);
  expect(result[4].getDate()).toBe(18);
})
