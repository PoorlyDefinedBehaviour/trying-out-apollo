import { Service } from "typedi";
import UserRegisterArgs from "../dtos/UserRegisterArgs.dto";
import User from "../entity/User.entity";

@Service()
export default class UserService {
  public async create(payload: UserRegisterArgs) {
    const user = await User.create(payload).save();
    return user;
  }

  public findOneBy = async <T>(predicate: Partial<User>, options?: T) =>
    await User.findOne(predicate, options);

  public userExists = async (predicate: Partial<User>) =>
    !!(await this.findOneBy(predicate));

  public deleteOneBy = async (predicate: Partial<User>) =>
    await User.delete(predicate);
}
