import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const dataSource = new DataSource({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: "bragagre",
    password: "example",
    database: "mail-builder",
    synchronize: true,
    entities: [User],
})