import { Role } from 'enums/role';
import { asConst, FromSchema } from 'json-schema-to-ts';

const signupSchema = asConst({
  type: 'object',
  $id: 'schema:users:signup',
  additionalProperties: false,
  required: ['email', 'password', 'role'],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    role: {
      type: 'string',
      enum: Object.values(Role),
    },
  },
});

const signUpResponse = asConst({
  type: 'object',
  $id: 'schema:users:signup:response',
  additionalProperties: false,
  required: ['message', 'userId'],
  properties: {
    message: {
      type: 'string',
    },
    userId: {
      type: 'number',
    },
  },
});



type SignUpRequest = FromSchema<typeof signupSchema>;

type SignUpResponse = FromSchema<typeof signUpResponse>;


export type { SignUpRequest, SignUpResponse };
export { signupSchema, signUpResponse };
