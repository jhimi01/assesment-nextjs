import { PrismaClient } from '@prisma/client'

// Function to create a new PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Use a global property to cache the PrismaClient instance
const globalThisWithPrisma = global;

const prisma = globalThisWithPrisma.prismaGlobal || prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThisWithPrisma.prismaGlobal = prisma;
}

module.exports = prisma;
