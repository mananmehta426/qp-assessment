import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';
import { viewGroceryItemsResponse } from './validators/view-grocery-items';
import { CreateOrderSchema, createOrderResponse, createOrderSchema } from './validators/create-order';

const userRoutesPlugin: FastifyPluginAsyncJsonSchemaToTs = async function (
  fastify: FastifyInstance,
) {
  fastify.get(
    '/view-grocery-items',
    {
      schema: {
        response: {
          200: viewGroceryItemsResponse,
        },
      },
    },
    async () => {
      const data = await fastify.usersService.viewGroceryItems();
      return data;
    },
  );

  fastify.post(
    '/create-order',
    {
      schema: {
        body: createOrderSchema,
        response: {
          200: createOrderResponse,
        },
      },
    },
    async (request) => {
      const userId = request.user.userId;
      const items = request.body as CreateOrderSchema;
      const data = await fastify.usersService.createOrder(items, userId);
      return data;
    },
  );

};

export default userRoutesPlugin;
