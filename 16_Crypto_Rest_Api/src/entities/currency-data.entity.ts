import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { CurrenciesRequestEntity } from "./currencies-request.entity";

@Entity("currency-data")
export class CurrencyDataEntity extends AbstractEntity {
  @Column()
  public code: string;

  @ManyToOne(() => CurrenciesRequestEntity, (request) => request.curensies)
  @JoinColumn({ name: "request_id" })
  public request: CurrenciesRequestEntity;

  @Column({ name: "request_id" })
  public requestId: string;

  @Column({ nullable: true })
  public coinmarketcapPrice: number;

  @Column({ nullable: true })
  public coinbasePrice: number;

  @Column({ nullable: true })
  public kucoinPrice: number;

  @Column({ nullable: true })
  public coinpapricaPrice: number;
}
