export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IOrderResult {
  id: string;
  total: number;
}

export interface IOrderForm {
  email: string;
  phone: string;
}

export interface IOrderInfo {
  payment: string;
  address: string; 
}

export interface IOrder extends IOrderForm, IOrderInfo {
  items: string[];
  total: number;
}