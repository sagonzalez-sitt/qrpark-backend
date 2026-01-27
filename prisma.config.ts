import "dotenv/config";
import { defineConfig } from "prisma/config";
import {environmentVariables} from "./src/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: environmentVariables.DATABASE_URL,
  },
});
