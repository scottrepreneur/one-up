import AWS from 'aws-sdk';
import { ActivityRecord, StringifiedUserRecord } from './definitions';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getUser = async (
  user: string,
): Promise<{
  Items: any[],
  Count: number,
  ScannedCount: number
}> => {
  const params: any = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    KeyConditionExpression: 'userId = :hkey',
    ExpressionAttributeValues: {
      ':hkey': user,
    },
  };

  return new Promise((res, rej) => {
    dynamoDb.query(params, (err: any, data: any) => {
      if (err) {
        console.log('Error', err);
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

const addRecord = (params: any) => {
  return new Promise((res, rej) => {
    dynamoDb.put(params, (err: any, data: any) => {
      if (err) {
        console.log('Error', err);
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

export const getOrCreateUser = async (user: string) => {
  const timestamp = new Date().getTime();

  const userRecord = await getUser(user);

  if (userRecord.Items.length > 0) {
    return userRecord.Items[0];
  }

  const newUserRecord: StringifiedUserRecord = {
    userId: user,
    currentGoal: 1,
    goalHistory: JSON.stringify([]),
    activities: JSON.stringify([]),
    activitiesTimeline: JSON.stringify([]),
    email: '',
    emailPreferences: JSON.stringify({
      marketing: false,
      notifications: true,
    }),
    created: timestamp,
    updated: timestamp,
  };

  const newUserParams = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Item: newUserRecord,
  };

  try {
    const newRecord = await addRecord(newUserParams);
    console.log('User created', newRecord);
    return newUserRecord;
  } catch (err) {
    console.log('User couldn\'t be created');
    return err;
  }
};

export const updateUser = (params: any) => {
  return new Promise((res, rej) => {
    dynamoDb.update(params, (err: any, data: any) => {
      if (err) {
        console.log('Error', err);
        rej(err);
      } else {
        res(data);
      }
    });
  });
};

export const addActivityToDb = async (
  account: string,
  activityList: Array<ActivityRecord>,
) => {
  const timestamp = new Date().getTime();
  const params: any = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Key: {
      userId: account,
    },
    ExpressionAttributeNames: {
      '#activities': 'activities',
      '#updated': 'updated',
    },
    ExpressionAttributeValues: {
      ':activities': JSON.stringify(activityList),
      ':updated': timestamp,
    },
    UpdateExpression: 'SET #activities = :activities, #updated = :updated',
    ReturnValues: 'ALL_NEW',
  };

  try {
    updateUser(params);
  } catch (err) {
    console.log(err);
  }
};

export const addActivityHistoryToDb = async (
  account: string,
  userActivityHistory: Array<{
    activity: string,
    timestamp: number
}>) => {
  const timestamp = new Date().getTime();

  const params: any = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Key: {
      userId: account,
    },
    ExpressionAttributeNames: {
      '#activitiesTimeline': 'activitiesTimeline',
      '#updated': 'updated',
    },
    ExpressionAttributeValues: {
      ':activitiesTimeline': JSON.stringify(userActivityHistory),
      ':updated': timestamp,
    },
    UpdateExpression: 'SET #activitiesTimeline = :activitiesTimeline, #updated = :updated',
    ReturnValues: 'ALL_NEW',
  };

  try {
    updateUser(params);
  } catch (err) {
    console.log(err);
  }
};
