import { defineFunction } from "@aws-amplify/backend";

export const postConfirmationAddUserToGroup = defineFunction({
  entry: "./addUserToGroup.ts",
  name: "postConfirmationGen2_addUserToGroup",
  environment: {
    GROUP: "Admin",
  },
});
