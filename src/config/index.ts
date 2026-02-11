import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "8000", 10),
  mongoUri: process.env.MONGO_URI ?? "mongodb://mongo:27017/reportheld",
  nodeEnv: process.env.NODE_ENV ?? "development",
};
