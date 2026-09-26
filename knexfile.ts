import dotenv from "dotenv";
dotenv.config();

export default {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "sua_senha_aqui",
    database: process.env.DB_NAME || "estudos_db",
  },
  migrations: {
    extension: "ts",
    directory: "./src/database/migrations",
  },
};