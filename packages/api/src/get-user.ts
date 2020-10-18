import {
  corsSuccessResponse,
  corsErrorResponse,
  runWarm,
  getOrCreateUser
} from './utils';

const getUser: Function = async (event: AWSLambda.APIGatewayEvent) => {
  // @ts-ignore
  const account = event.pathParameters.user.toLowerCase();

  if (account) {
    const user = await getOrCreateUser(account);

    return corsSuccessResponse(user);
  }
  return corsErrorResponse({ error: 'No user found' });
};

export default runWarm(getUser);
