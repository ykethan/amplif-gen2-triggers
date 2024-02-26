import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";
import { Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { LogGroup, LogStream, RetentionDays } from "aws-cdk-lib/aws-logs";
import { RemovalPolicy } from "aws-cdk-lib";

const backend = defineBackend({
  auth,
  // data,
});

// created a group and new role for the admin group
const userPool = backend.auth;

const adminGroup = new Role(userPool, "AdminGroup", {
  assumedBy: new ServicePrincipal("cognito-idp.amazonaws.com"),
});

new CfnUserPoolGroup(userPool, "Admin", {
  userPoolId: userPool.resources.userPool.userPoolId,
  description: "Admin",
  groupName: "Admin",
  precedence: 1,
  roleArn: adminGroup.roleArn,
});

// Create a Cloudwatch log group

const logGroup = new LogGroup(userPool, "logGroup", {
  logGroupName: "/aws/lambda/preAuthenticationGen2",
  retention: RetentionDays.ONE_MONTH, // optional, modify as needed
  removalPolicy: RemovalPolicy.DESTROY, // optional, modify as needed
});

new LogStream(userPool, "logStream", {
  logGroup,
  logStreamName: "login_Attempt",
  removalPolicy: RemovalPolicy.DESTROY, // optional, modify as needed
});

// const sesStack = backend.createStack("sesStack")

// const senderEmail = "youemail@example.com";
// const verifiedEmail = "youemail@example.com";

// const identity = new ses.CfnEmailIdentity(sesStack, "Identity", {
//   emailIdentity: senderEmail,
// });

// new ses.CfnTemplate(sesStack, "sesTemplate", {
//   template: {
//     templateName: "MyTemplate",
//     subjectPart: "Hello, {{name}}!",
//     textPart: "Hello, {{name}}!",
//     htmlPart: "<p>Hello, {{name}}!</p>",
//   },
// });

// const policy = new iam.PolicyDocument({
//   statements: [
//     new iam.PolicyStatement({
//       effect: iam.Effect.ALLOW,
//       actions: ["ses:SendEmail", "ses:SendRawEmail"],
//       resources: ["*"],
//       conditions: {
//         StringEquals: {
//           "ses:FromAddress": verifiedEmail,
//         },
//       },
//     }),
//   ],
// });

// new ses.iden
