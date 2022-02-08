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
