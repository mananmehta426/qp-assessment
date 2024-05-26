FROM node:alpine

WORKDIR /src

# Copy Prisma schema and generate client
COPY ./src/utils/prisma /src/utils/prisma
RUN npx prisma generate --schema=/src/utils/prisma/schema.prisma

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3010

# Start the application
CMD ["npm", "run", "dev"]
