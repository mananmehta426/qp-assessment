import { asConst, FromSchema } from 'json-schema-to-ts';

const addGroceryItemSchema = asConst({
  type: 'array',
  $id: 'schema:admin:add:grocery:item',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['itemName', 'price', 'quantity', 'description'],
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
  },
});

const addGroceryItemResponse = asConst({
  type: 'object',
  $id: 'schema:admin:add:grocery:item:response',
  additionalProperties: false,
  required: ['message', 'data'],
  properties: {
    message: {
      type: 'string',
    },
    data: {
      type: 'array',
      items: {
        type: 'object',
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
      },
    },
  },
});

type AddGroceryItemSchema = FromSchema<typeof addGroceryItemSchema>;

type AddGroceryItemResponse = FromSchema<typeof addGroceryItemResponse>;

export type { AddGroceryItemSchema, AddGroceryItemResponse };
export { addGroceryItemSchema, addGroceryItemResponse };
