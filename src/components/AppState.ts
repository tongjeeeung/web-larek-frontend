import { ICard, IOrder } from "../types";
import { EventEmitter, IEvents } from './base/events';

export type CatalogChangeEvent = {
  catalog: ICard[];
}

export interface IAppState extends IEvents {
  setCatalog: (data: ICard[]) => void;
  setBasket: (id: string) => void;
  setOrderInfo(data: IOrder): void;
  getOrder(): void;
  clearBasket(): void;
  getBasket(): void;
  basket: string[];
  catalog: ICard[];
  order: IOrder;
  getCurrentCard: (id: string) => ICard;
}

export class AppState extends EventEmitter implements IAppState {
  basket: string[] = [];
  catalog: ICard[];
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    payment: '',
    total: 0,
    items: []
  };

  constructor() {
    super();
  }

  setOrderInfo(data: IOrder) {
    this.order = data
    this.emit('order:changed');
  }

  getOrder() {
    return this.order;
  }

  setBasket(id: string) {
    if(this.basket.find(idCard => id === idCard)) {
      this.basket.splice(this.basket.indexOf(this.basket.find(idCard => id === idCard)), 1)
    }
    else this.basket.push(id);
    this.emit('basket:changed');
  }

  clearBasket() {
    this.basket = [];
    this.emit('basket:changed');
  }

  getBasket() {
    return this.basket;
  }

  setCatalog(data: ICard[]) {
    this.catalog = data;
    this.emit('catalog:changed');
  }

  getCurrentCard(id: string) {
    return this.catalog.find(card => card.id === id)
  }
}