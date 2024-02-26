import { PreAuthenticationTriggerEvent } from "aws-lambda";
import {
  CloudWatchLogsClient,
  PutLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

const cloudWatchLogsClient = new CloudWatchLogsClient({});
const logGroupName = process.env.LOG_GROUP; // Customize this as needed
const logStreamName = process.env.STREAM_NAME; // Customize this as needed

export const handler = async (event: PreAuthenticationTriggerEvent) => {
  const userName = event.userName;
  const userPoolId = event.userPoolId;
  const timestamp = new Date().toISOString();

  const message = `Login attempt for user ${userName} in UserPool ${userPoolId} at ${timestamp}`;

  // checking if the log group and stream exists may be a good idea in case it was manually deleted
  try {
    await cloudWatchLogsClient.send(
      new PutLogEventsCommand({
        logGroupName,
        logStreamName,
        logEvents: [{ message, timestamp: Date.now() }],
      })
    );

    console.log(`Logged login attempt for user ${userName}.`);
  } catch (error) {
    console.error(`Error logging login attempt for user ${userName}:`, error);
    // Even if logging fails, allow authentication to proceed
  }

  return event;
};

// use cases
// 1. allow authentication based on group membership
