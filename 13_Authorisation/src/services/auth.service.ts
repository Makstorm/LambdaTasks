import { Collection, Db } from "mongodb";
import { UserDto } from "../dtos";

export class AuthService {
  public async signUp(dto: UserDto) {}

  public async singIn(dto: UserDto) {
    const { login, password } = dto;

    console.log(dto);
  }

  public async check() {
    // const token = genereteJwt(req.user.id, req.user.email, req.user.role);
  }
}
