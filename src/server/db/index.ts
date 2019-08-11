import { createConnection } from "mongoose";

export const connection = createConnection(
  `mongodb://${process.env.MONGO_URL || "localhost:27017/data"}`,
  {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);
