import { getDateTimestamps } from '../date-time';

describe('getDateTimestamps...', () => {
  it('generates array of proper length', () => {
    const timestamps = getDateTimestamps(new Date(), 8, 12);
    expect(timestamps.length).toBe(16);
  });
});
