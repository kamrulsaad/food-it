import { PrismaClient } from "../../prisma/generated/prisma";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

export default prisma;
