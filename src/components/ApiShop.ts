import { ICard, IOrderResult, IOrder } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IApiShop {
  getCardsArr: () => Promise<ICard[]>;
  getCardItem: (id: string) => Promise<ICard>;
  postCard: (order: IOrder) => Promise<IOrderResult>
}


export class ApiShop extends Api implements IApiShop {
  readonly cdn: string;

  constructor(cdn: string,baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
    this.cdn = cdn;
  }

  getCardsArr(): Promise<ICard[]> {
    return this.get('/product').then((data: ApiListResponse<ICard>) => 
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image
      }))
    )
  }

  getCardItem(id:string): Promise<ICard> {
    return this.get(`/product/${id}`).then((item: ICard) => ({
      ...item,
      image: this.cdn + item.image
    }))
  }

  postCard(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data)
  }
}