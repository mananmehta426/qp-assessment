import { asConst, FromSchema } from 'json-schema-to-ts';

const viewGroceryItemsResponse = asConst({
  type: 'array',
  $id: 'schema:admin:view:grocery:item:response',
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
      createdAt: { type: 'string', format: 'date-time' },
      deletedAt: { type: ['string', 'null'], format: 'date-time' },
    },
  },
});

type ViewGroceryItemResponse = FromSchema<typeof viewGroceryItemsResponse>;

export type { ViewGroceryItemResponse };
export { viewGroceryItemsResponse };