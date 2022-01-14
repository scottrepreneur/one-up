import { APIGatewayEvent } from 'aws-lambda';
import _ from 'lodash';
import { ActivityRecord } from '@one-up/common';
import {
  corsSuccessResponse,
  corsErrorResponse,
  runWarm,
  getOrCreateUser,
  updateActivities,
} from './utils';

const updateActivity: Function = async (
  event: APIGatewayEvent,
): Promise<any> => {
  // @ts-ignore
  const { userId, activityKey } = _.get(event, 'pathParameters');
  const activityData: ActivityRecord = JSON.parse(event.body || '{}');
  activityData.points = parseFloat(_.get(activityData, 'points'));

  if (!userId || !activityKey || !activityData) {
    return corsErrorResponse({ error: 'No id or key found' });
  }
  return getOrCreateUser(_.toLower(userId))
    .then((user) => {
      const activitiesList = JSON.parse(_.get(user, 'activities'));
      // console.log(activitiesList);
      const filteredActivities = _.filter(
        activitiesList,
        (activity: any) => activity.activity !== activityData.activity,
      );
      const updatedActivities = [...filteredActivities, activityData];
      return updateActivities(_.toLower(userId), updatedActivities)
        .then((result) =>
          corsSuccessResponse({ activities: updatedActivities, result }),
        )
        .catch((error) => corsErrorResponse({ error }));
    })
    .catch((error) => corsErrorResponse({ error }));
};

export default runWarm(updateActivity);
