import { asConst, FromSchema } from 'json-schema-to-ts';

const updateGroceryParam = asConst({
  type: 'object',
  $id: 'schema:portfolios:delete-portfolio',
  required: ['itemId'],
  additionalProperties: false,
  properties: {
    itemId: {
      type: 'integer',
    },
  },
});

const updateGroceryItemSchema = asConst({
  type: 'object',
  $id: 'schema:admin:update:grocery:item',
  required: ['itemName', 'price', 'quantity', 'description'],
  additionalProperties: false,
  properties: {
    itemName: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    quantity: {
      type: 'number',
    },
    description: {
      type: 'string',
    },
  },
});

const updateGroceryItemResponse = asConst({
  type: 'object',
  $id: 'schema:admin:update:grocery:item:response',
  additionalProperties: false,
  required: ['message', 'items'],
  properties: {
    message: {
      type: 'string',
    },
    items: {
      type: 'object',
      additionalProperties: false,
      required: [],
      properties: {
        itemId: { type: 'integer' },
        itemName: { type: 'string' },
        price: { type: 'number' },
        quantity: { type: 'integer' },
        description: { type: 'string' },
        createdAt: { type: 'string', format: 'date' },
        deletedAt: { type: ['string', 'null'], format: 'date' },
      },
    },
  },
});

type UpdateGroceryItemSchema = FromSchema<typeof updateGroceryItemSchema>;

type UpdateGroceryItemResponse = FromSchema<typeof updateGroceryItemResponse>;

type UpdateGroceryItemParam = FromSchema<typeof updateGroceryParam>;

export type {
  UpdateGroceryItemSchema,
  UpdateGroceryItemResponse,
  UpdateGroceryItemParam,
};
export {
  updateGroceryItemResponse,
  updateGroceryItemSchema,
  updateGroceryParam,
};
