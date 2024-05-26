import { asConst, FromSchema } from 'json-schema-to-ts';

const createOrderSchema = asConst({
  type: 'array',
  $id: 'schema:admin:view:grocery:item:response',
  items: {
    type: 'object',
    additionalProperties: false,
    required: ['itemId', 'quantity', 'price'],
    properties: {
      itemId: { type: 'integer' },
      price: { type: 'number' },
      quantity: { type: 'integer' },
    },
  },
});

const createOrderResponse = asConst({
  type: 'object',
  $id: 'schema:admin:add:grocery:item:response',
  additionalProperties: false,
  required: ['message', 'order'], // Changed 'data' to 'order'
  properties: {
    message: { type: 'string' },
    order: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          orderId: { type: 'number' },
          userId: { type: 'number' },
          totalAmount: { type: 'number' },
          createdAt: { type: 'string', format: 'date' },
          deletedAt: { type: ['string', 'null'], format: 'date' },
        },
      },
    },
  },
});


type CreateOrderSchema = FromSchema<typeof createOrderSchema>;

type CreateOrderResponse = FromSchema<typeof createOrderResponse>;

export type { CreateOrderSchema, CreateOrderResponse };
export { createOrderSchema, createOrderResponse };
