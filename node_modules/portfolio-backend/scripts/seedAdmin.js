import dotenv from "dotenv";
import connectDB from "../config/db.js";
import { createDefaultAdmin } from "../utils/adminSeeder.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await createDefaultAdmin();
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
