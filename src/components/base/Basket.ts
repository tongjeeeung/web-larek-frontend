import { EventEmitter, IEvents } from "./events";

export interface IViewBasket extends IEvents {
  render:(basketList: HTMLElement[]) => HTMLElement;
}

export interface IViewBasketContainer {
  new (templateBasket: HTMLTemplateElement, templateBasketElem: HTMLTemplateElement): IViewBasket
}

export class Basket extends EventEmitter implements IViewBasket {
  protected listElement: HTMLElement;
  protected elementTitle: HTMLElement;
  protected elementPrice: HTMLElement;
  protected elementButton: HTMLButtonElement;
  protected elementIndex: HTMLElement;
  protected modalElement: HTMLElement;
  protected modalButton: HTMLButtonElement;
  protected modalPrice: HTMLElement;
  protected modalList: HTMLUListElement;
  protected totalPrice: number;

  constructor(protected templateBasket: HTMLTemplateElement, protected templateBasketElem: HTMLTemplateElement) {
    super();
    this.modalElement = templateBasket.content.cloneNode(true) as HTMLElement;
    this.modalButton = this.modalElement.querySelector('.basket__button');
    this.modalPrice = this.modalElement.querySelector('.basket__price');
    this.modalList = this.modalElement.querySelector('.basket__list');
    this.listElement = templateBasketElem.content.cloneNode(true) as HTMLElement;
    this.elementTitle = this.listElement.querySelector('.card__title');
    this.elementButton = this.listElement.querySelector('.basket__item-delete');
    this.elementPrice = this.listElement.querySelector('.card__price');
    this.elementIndex = this.listElement.querySelector('.basket__item-index');

    this.modalButton.addEventListener('click', () => {
      this.emit('basket:submit', {totalPrice: this.totalPrice})
    })
  }

  render(basketList: HTMLElement[]) {
    this.totalPrice = 0;
    if(basketList.length != 0) {
    basketList.forEach(card => {
      card.querySelector('.basket__item-index').textContent = String(basketList.indexOf(card) + 1);
      this.totalPrice += Number(card.querySelector('.card__price').textContent.split(' ')[0]);
      this.modalList.appendChild(card);
    })}
    else {
      this.modalButton.setAttribute('disabled', '')
    }
    this.modalPrice.textContent = String(this.totalPrice) + ' синапсов';
    return this.modalElement;
  }
}