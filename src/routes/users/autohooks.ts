import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import prisma from '../../utils/prisma';
import { ViewGroceryItemResponse } from './validators/view-grocery-items';
import {
  CreateOrderResponse,
  CreateOrderSchema,
} from './validators/create-order';

declare module 'fastify' {
  type usersService = {
    viewGroceryItems: () => Promise<ViewGroceryItemResponse>;
    createOrder: (
      items: CreateOrderSchema,
      userId: number,
    ) => Promise<CreateOrderResponse>;
  };

  interface FastifyInstance {
    usersService: usersService;
  }
}

export default fp(
  async function usersAutoHooks(fastify: FastifyInstance) {
    fastify.decorate('usersService', {
      async viewGroceryItems(): Promise<ViewGroceryItemResponse> {
        const groceryItems = await prisma.groceryItem.findMany({
          where: { quantity: { gt: 1 } },
        });

        const formattedItems = groceryItems.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          deletedAt: item.deletedAt ? item.deletedAt.toISOString() : null,
        }));
        return formattedItems;
      },

      async createOrder(
        items: CreateOrderSchema,
        userId: number
      ): Promise<CreateOrderResponse> {
        try {
          const totalAmount = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          );

          const order = await prisma.order.create({
            data: {
              userId,
              totalAmount,
              orderDetails: {
                create: items.map((item) => ({
                  itemId: item.itemId,
                  quantity: item.quantity,
                })),
              },
            },
          });

          return {
            message: 'Order was placed!',
            order: [{
              orderId: order.orderId,
              userId: order.userId,
              totalAmount: order.totalAmount,
              createdAt: order.createdAt.toISOString(),
              deletedAt: order.deletedAt ? order.deletedAt.toISOString() : null,
            }],
          };

        } catch (error) {
          fastify.log.error(error);
          throw new Error('Error creating order');
        }
      },
    });
  },
  {
    name: 'usersAutoHooks',
    encapsulate: true,
  },
);
