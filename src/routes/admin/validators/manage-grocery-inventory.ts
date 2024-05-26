import { asConst, FromSchema } from 'json-schema-to-ts';

const manageGroceryInventorySchema = asConst({
  type: 'array',
  $id: 'schema:admin:manage:grocery:inventory',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['itemId', 'quantity'],
    properties: {
      itemId: {
        type: 'number',
      },
      quantity: {
        type: 'number',
      },
    },
  },
});

const manageGroceryInventoryResponse = asConst({
  type: 'object',
  $id: 'schema:admin:manage:grocery:inventory:response',
  additionalProperties: false,
  required: ['message'],
  properties: {
    message: {
      type: 'string',
    },
  },
});

type ManageGroceryInventorySchema = FromSchema<typeof manageGroceryInventorySchema>;

type ManageGroceryInventoryResponse = FromSchema<typeof manageGroceryInventoryResponse>;

export type { ManageGroceryInventorySchema, ManageGroceryInventoryResponse };
export { manageGroceryInventorySchema, manageGroceryInventoryResponse };
