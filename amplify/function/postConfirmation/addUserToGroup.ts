import { PostConfirmationTriggerEvent } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  GetGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event: PostConfirmationTriggerEvent) => {
  const groupName = process.env.GROUP;
  if (!groupName) {
    throw new Error("Environment variable GROUP is not set.");
  }

  const userPoolId = event.userPoolId;
  const userName = event.userName;

  try {
    await cognitoClient.send(
      new GetGroupCommand({
        GroupName: groupName,
        UserPoolId: userPoolId,
      })
    );

    // If the group exists, add the user to the group
    await cognitoClient.send(
      new AdminAddUserToGroupCommand({
        GroupName: groupName,
        UserPoolId: userPoolId,
        Username: userName,
      })
    );

    console.log(`User ${userName} added to group ${groupName}`);
  } catch (error) {
    // If the group does not exist, log a message or maybe auto-create the group
    console.error(
      `Group ${groupName} does not exist in UserPool ${userPoolId}. User ${userName} was not added to any group.`
    );
  }

  return event;
};

//use cases
// 1. SES welcome email
// 2. Add user to DynamoDB table
