import assert from 'assert';
import _ from 'lodash';
import activityList from './fixtures/activities';
import activityHistory from './fixtures/activityHistory';

import { getScore } from '../utils/score';

const todayUtc = () => _.gt(new Date().getHours(), 6); // TODO handle differnt timezone

describe('Score Utilities', () => {
  describe('getScore()', () => {
    it('should return 5 or 0 for score, depending on todayUtc', () => {
      const a = getScore(activityList, activityHistory);
      assert.equal(a, todayUtc() ? 5 : 0);
    });
  });
});
