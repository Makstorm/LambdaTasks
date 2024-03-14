import { IsString, IsUrl } from "class-validator";

export class LinkDto {
  @IsUrl()
  @IsString()
  public link: string;
}
