import { Module } from "../entities/Module";
import { Repository } from "typeorm";
import { dataSource } from "../tools/utils";
import { ModuleInput } from "../inputs/ModuleInput";
import { User } from "../entities/User";

export const moduleRepository: Repository<Module> =
  dataSource.getRepository(Module);
export const userRepository: Repository<User> = dataSource.getRepository(User);

export class ModuleService {
  static async getAll(): Promise<Module[]> {
    return await moduleRepository.find();
  }

  static async createModule(module: ModuleInput): Promise<Module> {
    const user = await userRepository.findOneByOrFail({
      id: Number(module.userId),
    });
    const newModule = new Module();
    newModule.name = module.name;
    newModule.preview = module.preview;
    newModule.render = module.render;
    newModule.user = user;
    return await moduleRepository.save(newModule);
  }

  static async removeModule(id: number): Promise<Module | { id: number }> {
    const module = await moduleRepository.findOneByOrFail({ id });
    if (module) {
      const id = module.id;
      await moduleRepository.remove(module);
      return {
        id,
      };
    } else {
      return new Module();
    }
  }
}
