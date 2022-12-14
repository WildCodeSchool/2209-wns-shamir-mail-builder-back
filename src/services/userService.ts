import { Repository } from "typeorm";
import { User } from "../entities/User";
import { dataSource } from "../tools/utils";
import * as argon2 from "argon2";

const userRepository: Repository<User> = dataSource.getRepository(User);

export default {
    getByEmail: async (email: string): Promise<User> => {
        return await userRepository.findOneByOrFail({ email });
    },

    create: async (email: string, username: string, password: string, phone: string): Promise<User> => {
        const newUser = new User();
        newUser.email = email;
        newUser.username = username;
        newUser.hashedPassword = await argon2.hash(password);
        newUser.phone = phone;
        
        return await userRepository.save(newUser);
    },

    deleteOne: async (id: number): Promise<any> => {
        return await userRepository.delete(id);
    },
}