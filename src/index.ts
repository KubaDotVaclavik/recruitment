import { config as configEnv } from "dotenv";
import { prisma } from "./core/infrastructure/prisma";
import { v1Router } from "./core/infrastructure/api/v1";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

configEnv();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(helmet());

app.use("/api/v1", v1Router);

async function main() {
  await prisma.$connect();

  const PORT = process.env.PORT;
  app.listen(PORT, () =>
    console.log(`[API] Server is ready. Try open http://localhost:${PORT}/`)
  );
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => await prisma.$disconnect());
