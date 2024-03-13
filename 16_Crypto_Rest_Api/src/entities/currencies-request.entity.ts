import { Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { CurrencyDataEntity } from "./currency-data.entity";

@Entity("currencies-request")
export class CurrenciesRequestEntity extends AbstractEntity {
  @OneToMany(() => CurrencyDataEntity, (currency) => currency.request)
  public curensies: CurrencyDataEntity[];
}
