import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  AddGroceryItemSchema,
  addGroceryItemResponse,
  addGroceryItemSchema,
} from './validators/add-grocery-items';
import { viewGroceryItemsResponse } from './validators/view-grocery-items';
import {
  RemoveGroceryItemsRequest,
  removeGroceryItemsResponse,
} from './validators/remove-grocery-items';
import { UpdateGroceryItemParam, UpdateGroceryItemSchema, updateGroceryItemResponse, updateGroceryItemSchema } from './validators/update-grocery-items';
import { ManageGroceryInventorySchema, manageGroceryInventoryResponse, manageGroceryInventorySchema } from './validators/manage-grocery-inventory';

const adminRoutesPlugin: FastifyPluginAsyncJsonSchemaToTs = async function (
  fastify: FastifyInstance,
) {
  fastify.post(
    '/add-grocery-items',
    {
      schema: {
        body: addGroceryItemSchema,
        response: {
          200: addGroceryItemResponse,
        },
      },
    },
    async (request) => {
      const addGroceryItemRequest = request.body as AddGroceryItemSchema;
      const data = await fastify.adminService.addGroceryItems(
        addGroceryItemRequest,
      );
      return data;
    },
  );

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
      const data = await fastify.adminService.viewGroceryItems();
      return data;
    },
  );

  fastify.delete(
    '/delete-grocery-items',
    {
      schema: {
        response: {
          200: removeGroceryItemsResponse,
        },
      },
    },
    async (request: FastifyRequest<{ Body: RemoveGroceryItemsRequest }>) => {
      const itemsToBeDeleted: RemoveGroceryItemsRequest = request.body;
      const data =
        await fastify.adminService.removeGroceryItems(itemsToBeDeleted);
      return data;
    },
  );

  fastify.patch(
    '/update-grocery-items/:itemId',
    {
      schema: {
        body: updateGroceryItemSchema,
        response: {
          200: updateGroceryItemResponse,
        },
      },
    },
    async (request) => {
      const { itemId } = request.params as UpdateGroceryItemParam;
      const updateGroceryItemRequest = request.body as UpdateGroceryItemSchema;
      const data = await fastify.adminService.updateGroceryItem(
        itemId,
        updateGroceryItemRequest,
      );
      return data;
    },
  );

  fastify.post(
    '/manage-inventory',
    {
      schema: {
        body: manageGroceryInventorySchema,
        response: {
          200: manageGroceryInventoryResponse,
        },
      },
    },
    async (request) => {
      const manageGroceryInventoryRequest = request.body as ManageGroceryInventorySchema;
      const data = await fastify.adminService.manageGroceryInventory(
        manageGroceryInventoryRequest,
      );
      return data;
    },
  );
};

export default adminRoutesPlugin;
