import { Repository } from "typeorm";
import { User } from "../entities/User";
import { Subscription } from "../entities/Subscription";
import { dataSource } from "../tools/utils";
import * as argon2 from "argon2";

export const userRepository: Repository<User> = dataSource.getRepository(User);

export default {
  getAllUsers: async (): Promise<User[]> => {
    return await userRepository.find();
  },

  getByEmail: async (email: string): Promise<User> => {
    return await userRepository.findOneByOrFail({ email });
  },

  create: async (
    username: string,
    password: string,
    email: string,
    phone: string
  ): Promise<User> => {
    const newUser = new User();
    newUser.username = username;
    newUser.hashedPassword = await argon2.hash(password);
    newUser.email = email;
    newUser.phone = phone;

    return await userRepository.save(newUser);
  },

  update: async (
    id: number,
    username: string,
    phone: string
  ): Promise<User> => {
    const userToUpdate = await userRepository.findOneByOrFail({ id });
    userToUpdate.username = username;
    userToUpdate.phone = phone;
    userToUpdate.updatedAt = new Date();
    userToUpdate.createdAt = userToUpdate.createdAt;
    return await userRepository.save(userToUpdate);
  },

  deleteOne: async (id: number): Promise<any> => {
    return await userRepository.delete({
      id: id,
    });
  },

  saveUserSub: async (
    email: string,
    subscription: Subscription
  ): Promise<User> => {
    const userToUpdate = await userRepository.findOneByOrFail({ email });
    if (userToUpdate === null) {
      throw new Error("Utilisateur introuvable");
    }
    userToUpdate.subscriptionId = subscription;
    return await userRepository.save(userToUpdate);
  },
};
