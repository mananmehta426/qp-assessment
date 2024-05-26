import { asConst, FromSchema } from 'json-schema-to-ts';

const logoutResponse = asConst({
  type: 'object',
  $id: 'schema:users:login:response',
  additionalProperties: false,
  required: ['message'],
  properties: {
    message: {
      type: 'string',
    },
  },
});

type LogoutResponse = FromSchema<typeof logoutResponse>;

export type { LogoutResponse };
export { logoutResponse };