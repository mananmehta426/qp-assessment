import { asConst, FromSchema } from 'json-schema-to-ts';

const removeGroceryItemsResponse = asConst({
  type: 'object',
  $id: 'schema:admin:remove:grocery:items',
  additionalProperties: false,
  required: ['message'],
  properties: {
    message: {
      type: 'string',
    },
  },
});

const removeGroceryItemsRequest = asConst({
  type: 'array',
  $id: 'schema:admin:remove:grocery:items',
  additionalProperties: false,
  required: ['items'],
  items: { type: 'number' },
});

type RemoveGroceryItemsResponse = FromSchema<typeof removeGroceryItemsResponse>;

type RemoveGroceryItemsRequest = FromSchema<typeof removeGroceryItemsRequest>;

export type { RemoveGroceryItemsResponse, RemoveGroceryItemsRequest };
export { removeGroceryItemsResponse, removeGroceryItemsRequest };
