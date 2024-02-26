import { defineFunction } from "@aws-amplify/backend";

export const preSignUpAllowDomains = defineFunction({
  entry: "./allow_domains.ts",
  name: "preSignUpGen2_allowDomains",
  environment: {
    ALLOWED_DOMAINS: "gmail.com,amazon.com,",
  },
});
