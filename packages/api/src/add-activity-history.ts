import { APIGatewayEvent } from 'aws-lambda';
import _ from 'lodash';
import { sub, parseISO, isAfter, add, formatDistanceToNow } from 'date-fns';
import { IActivityHistory, getLastActivity } from '@one-up/common';
import {
  corsSuccessResponse,
  corsErrorResponse,
  runWarm,
  getOrCreateUser,
} from './utils';
import { addHistoryForActivity, invalidAddress } from './utils/temp';

const addActivityHistory: Function = async (event: APIGatewayEvent) => {
  const timestamp = new Date().toISOString();
  const account: any = _.toLower(_.get(event, 'pathParameters.userId'));
  const activityKey: any = _.toLower(
    _.get(event, 'pathParameters.activityKey'),
  );
  let userActivityHistory: IActivityHistory[] = [];

  if (!account || invalidAddress(account)) {
    return corsErrorResponse({ error: 'No `userId` found' });
  }

  return getOrCreateUser(account).then((user) => {
    userActivityHistory = JSON.parse(_.get(user, 'activitiesTimeline'));
    const userActivities = JSON.parse(_.get(user, 'activities'));

    // check the activity exists for the user
    if (_.isEmpty(_.filter(userActivities, ['activity', activityKey]))) {
      return corsErrorResponse({
        error: `No activity found with key: ${activityKey}`,
      });
    }

    // activity has not been recorded in timeline before
    if (_.isEmpty(_.filter(userActivityHistory, ['activity', activityKey]))) {
      userActivityHistory.push({
        activity: activityKey,
        timestamp,
      });

      return addHistoryForActivity(account, activityKey, userActivityHistory)
        .then((result) => corsSuccessResponse({ success: true, result }))
        .catch((error) => corsErrorResponse({ error }));
    }

    const { cooldown } = _.first(
      _.filter(userActivities, ['activity', activityKey]),
    );
    const lastActivity = getLastActivity(
      userActivities,
      userActivityHistory,
      activityKey,
    );
    const lastActivityTimestamp = parseISO(
      _.get(lastActivity, 'timestamp') || '',
    );

    if (
      _.get(lastActivity, 'timestamp') &&
      isAfter(
        sub(parseISO(timestamp), { minutes: cooldown }),
        lastActivityTimestamp,
      )
    ) {
      return addHistoryForActivity(account, activityKey, userActivityHistory)
        .then((result) => corsSuccessResponse({ success: true, result }))
        .catch((error) => corsErrorResponse({ error }));
    }
    const cooldownExpires = add(lastActivityTimestamp, {
      minutes: cooldown,
    });
    const cooldownRemaining = formatDistanceToNow(cooldownExpires);
    return corsErrorResponse({
      error: `Please wait for ${cooldownRemaining} to log '${activityKey}' again`,
    });
  });
};

export default runWarm(addActivityHistory);
