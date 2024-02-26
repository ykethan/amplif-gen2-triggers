import { PreSignUpTriggerEvent } from "aws-lambda";

export const handler = async (
  event: PreSignUpTriggerEvent
): Promise<PreSignUpTriggerEvent> => {
  const allowedDomains = process.env.ALLOWED_DOMAINS?.split(",").map((d) =>
    d.trim()
  );

  // Extract the domain from the user's email
  const { email } = event.request.userAttributes;
  const domain = email.substring(email.indexOf("@") + 1);

  // Check if the domain is in the allowlist
  if (!allowedDomains?.includes(domain)) {
    throw new Error(`Invalid email domain: ${domain}`);
  }

  // 1. Auto-verify the email if the domain is allowed
  event.response.autoVerifyEmail = true;

  // 2. auto confirm based on specific domain
  const autoConfirmDomains = ["trusteddomain.com"]; // maybe from env variable
  if (autoConfirmDomains.includes(domain)) {
    event.response.autoConfirmUser = true;
  }

  return event;
};
// use cases
// 1. Automatically set/modify user attributes
