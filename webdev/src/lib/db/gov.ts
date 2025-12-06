import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client-gov";

const connectionString = `${process.env.DATABASE_URL_GOV}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as {
  prismaGovRefreshed: PrismaClient;
};

export const prismaGov =
  globalForPrisma.prismaGovRefreshed || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaGovRefreshed = prismaGov;
