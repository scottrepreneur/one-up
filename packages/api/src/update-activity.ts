import { APIGatewayEvent } from 'aws-lambda';
import {
  corsSuccessResponse,
  corsErrorResponse,
  runWarm,
  ActivityRecord,
  getOrCreateUser,
  updateActivities,
} from './utils';

const updateActivity: Function = async (event: APIGatewayEvent) => {
  // @ts-ignore
  const { userId, activityKey } = event.pathParameters;
  const activityData: ActivityRecord = JSON.parse(event.body || '{}');
  activityData.points = parseFloat(activityData.points);

  if (userId && activityKey && activityData) {
    const user = await getOrCreateUser(userId.toLowerCase());
    const activitiesList = JSON.parse(user.activities);
    // console.log(activitiesList);
    const filteredActivities = activitiesList.filter((activity: any) => (
      activity.activity !== activityData.activity));
    const updatedActivities = [
      ...filteredActivities,
      activityData,
    ];
    try {
      await updateActivities(userId.toLowerCase(), updatedActivities);
      // console.log(result);

      return corsSuccessResponse({
        activities: updatedActivities,
      });
    } catch (err) {
      console.log(err);
      corsErrorResponse({ error: err });
    }
  }
};

export default runWarm(updateActivity);
