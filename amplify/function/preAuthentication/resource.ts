import { defineFunction } from "@aws-amplify/backend";

export const preAuthenticationLoginAttempts = defineFunction({
  entry: "./logAttempts.ts",
  name: "preAuthenticationGen2_loginAttempts",
  environment: {
    LOG_GROUP: "/aws/lambda/preAuthenticationGen2",
    STREAM_NAME: "login_Attempt",
  },
});
