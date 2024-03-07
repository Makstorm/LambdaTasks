import { IsNotEmpty, IsString } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  @IsString()
  public login: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
