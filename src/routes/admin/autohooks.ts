import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify/types/instance';
import prisma from '../../utils/prisma';
import { AddGroceryItemResponse } from './validators/add-grocery-items';
import { ViewGroceryItemResponse } from './validators/view-grocery-items';
import { RemoveGroceryItemsResponse } from './validators/remove-grocery-items';
import { UpdateGroceryItemResponse, UpdateGroceryItemSchema } from './validators/update-grocery-items';
import { ManageGroceryInventoryResponse } from './validators/manage-grocery-inventory';

declare module 'fastify' {
  type adminService = {
    addGroceryItems: (
      items: Array<{
        itemName: string;
        price: number;
        quantity: number;
        description: string;
      }>,
    ) => Promise<AddGroceryItemResponse>;

    viewGroceryItems: () => Promise<ViewGroceryItemResponse>;

    removeGroceryItems: (
      items: number[],
    ) => Promise<RemoveGroceryItemsResponse>;

    updateGroceryItem: (
      itemId: number,
      item: UpdateGroceryItemSchema,
    ) => Promise<UpdateGroceryItemResponse>;

    manageGroceryInventory: (
      items: Array<{
        itemId: number;
        quantity: number;
      }>,
    ) => Promise<ManageGroceryInventoryResponse>;
  };

  interface FastifyInstance {
    adminService: adminService;
  }
}

export default fp(
  async function adminAutoHooks(fastify: FastifyInstance) {
    fastify.decorate('adminService', {
      async addGroceryItems(
        items: Array<{
          itemName: string;
          price: number;
          quantity: number;
          description: string;
        }>,
      ): Promise<AddGroceryItemResponse> {
        // Use Prisma's createMany method to insert multiple items
        const newGroceryItems = await prisma.groceryItem.createMany({
          data: items,
          // Specify `skipDuplicates: true` to skip insertion of duplicate items
          skipDuplicates: true,
        });

        // Construct the response message
        const message = `Successfully added ${newGroceryItems.count} grocery items.`;

        // Return the response
        return { message, data: items };
      },
      async viewGroceryItems(): Promise<ViewGroceryItemResponse> {
        const groceryItems = await prisma.groceryItem.findMany();

        const formattedItems = groceryItems.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          deletedAt: item.deletedAt ? item.deletedAt.toISOString() : null,
        }));
        return formattedItems;
      },
      async removeGroceryItems(
        items: number[],
      ): Promise<RemoveGroceryItemsResponse> {
        try {
          await prisma.groceryItem.deleteMany({
            where: {
              itemId: { in: items },
            },
          });
          return { message: "Grocery Items deleted" }
        } catch (error) {
          throw fastify.httpErrors.internalServerError(
            'Error removing grocery items',
          );
        }
      },
      async updateGroceryItem(
        itemId: number,
        item: UpdateGroceryItemSchema,
      ): Promise<UpdateGroceryItemResponse> {
        await prisma.groceryItem.update({
          where: {
            itemId: itemId,
          },
          data: item,
        });
        

        return { message: 'Item Updated', items: item };
      },
      async manageGroceryInventory(
        items: Array<{
          itemId: number;
          quantity: number;
        }>,
      ): Promise<ManageGroceryInventoryResponse> {
        try {
          const updatePromises = items.map(({ itemId, quantity }) => {
            return prisma.groceryItem.update({
              where: { itemId },
              data: { quantity },
            });
          });

          await Promise.all(updatePromises);
          const message = "Inventory updated successfully"
          return { message }
        } catch (error) {
          throw fastify.httpErrors.internalServerError(
            'Error managing inventory',
          );
        }
      },
    });
  },
  {
    name: 'adminAutoHooks',
    encapsulate: true,
  },
);
