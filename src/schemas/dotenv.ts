import { asConst, FromSchema } from "json-schema-to-ts";

const schema = asConst({
  type: "object",
  required: [
    "DATABASE_URL",
    "JWT_SECRET",
    "SALT_ROUNDS",
    "KEY_LEN",
    "DIGEST",
    "NODE_ENV"
  ],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    JWT_SECRET: {
      type: "string",
    },
    SALT_ROUNDS: {
      type: "number",
    },
    KEY_LEN: {
      type: "number",
    },
    DIGEST: {
      type: "string",
    },
    NODE_ENV: {
      type: "string",
    }

  },
});

type EnvSchema = FromSchema<typeof schema>;

export default EnvSchema;
export { schema };
