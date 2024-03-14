import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract.entity";

@Entity("link")
export class LinkEntity extends AbstractEntity {
  @Column()
  public originalLink: string;

  @Column()
  public shortLink: string;
}
