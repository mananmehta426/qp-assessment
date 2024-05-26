## Run Locally

Clone the project

```bash
  git clone https://github.com/mananmehta426/qp-assessment
```

Go to the project directory

```bash
  cd qp-assessment
```

Update Env variables
```bash
nano .env
```

Install dependencies

```bash
  npm install
```

Generate the prisma client (only use when you run for the first time)
```bash
  cd src/utils/prisma && npx prisma generate
```

Migrate and seed the database (only use when you run for the first time)
```bash
  npx prisma migrate dev --name init
  npx prisma db seed
```

Start the server
```bash
  npm run dev
```

## Run using docker

Start docker on your machine

```bash
  docker build -t my-app .
  docker run -p 3010:3010 my-app
```

Once you see "Server running...", open localhost on your machine

## API Reference

qp-assessment-api.json