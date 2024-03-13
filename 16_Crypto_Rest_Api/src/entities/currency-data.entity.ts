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

  @Column({ type: "float", nullable: true })
  public coinmarketcapPrice: number;

  @Column({ type: "float", nullable: true })
  public coinbasePrice: number;

  @Column({ type: "float", nullable: true })
  public kucoinPrice: number;

  @Column({ type: "float", nullable: true })
  public coinpapricaPrice: number;

  public getAverage(api = null): number {
    let sum = 0;
    let count = 0;

    if (this.coinmarketcapPrice !== null) {
      sum += this.coinmarketcapPrice;
      count++;
    }
    if (this.coinbasePrice !== null) {
      sum += this.coinbasePrice;
      count++;
    }
    if (this.kucoinPrice !== null) {
      sum += this.kucoinPrice;
      count++;
    }
    if (this.coinpapricaPrice !== null) {
      sum += this.coinpapricaPrice;
      count++;
    }

    return api && this[api] ? this[api] : sum / count;
  }
}
