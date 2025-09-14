import mongoose from "mongoose";
import { initMongoConnection } from "../db/initMongoConnection.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

import logger from "../utils/logger";
import { faker } from "@faker-js/faker";

const seedDatabase = async () => {
  try {
    await initMongoConnection();
    logger.info("Database connection established for seeding.");

    await User.deleteMany({});
    await Product.deleteMany({});
    logger.info("Cleared old users and products.");

    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        balance: faker.finance.amount({ min: 100, max: 500, dec: 2 }),
      });
    }

    await User.insertMany(users);
    logger.info(`Seeded ${users.length} users.`);

    const products = [];
    for (let i = 0; i < 10; i++) {
      products.push({
        name: faker.commerce.productName(),
        price: faker.commerce.price({ min: 10, max: 2000, dec: 2 }),
        stock: faker.number.int({ min: 0, max: 100 }),
      });
    }

    await Product.insertMany(products);
    logger.info(`Seeded ${products.length} products.`);

    logger.info("Database seeding completed successfully!");
  } catch (error) {
    logger.error("Error during database seeding:", error);
  } finally {
    await mongoose.disconnect(), logger.info("Database connection closed.");
  }
};

seedDatabase();
