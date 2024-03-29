import { ICard } from "../../types";
import { EventEmitter, IEvents } from "./events";

export interface IViewCard extends IEvents {
  id: string;
  render:(card: ICard) => HTMLElement
  buyButtonView(force: string | undefined): void;
}

export interface IViewCardConstructor {
  new (template: HTMLTemplateElement): IViewCard
}

export class Card extends EventEmitter implements IViewCard {
  protected cardElement: HTMLElement;
  protected cardButton: HTMLButtonElement;
  protected title: HTMLElement;
  protected image: HTMLImageElement;
  protected category: HTMLElement;
  protected price: HTMLElement;
  protected _id: string;
  protected description: HTMLElement;
  protected handleCard: Function;
  protected buttonInCard: HTMLButtonElement;
  protected indexBasketCard: HTMLElement;
  protected deliteCard: HTMLButtonElement;
  protected _categoryColor: {[key: string]: string} = {
    soft: 'софт-скил',
    hard: 'хард-скил',
    other: 'другое',
    additional: 'дополнительное',
    button: 'кнопка'
  }

  constructor(template: HTMLTemplateElement) {
    super()
    this.cardElement = template.content.cloneNode(true) as HTMLElement;
    this.cardButton = this.cardElement.querySelector('.card');
    this.title = this.cardElement.querySelector('.card__title');
    this.image = this.cardElement.querySelector('.card__image');
    this.category = this.cardElement.querySelector('.card__category');
    this.price = this.cardElement.querySelector('.card__price');
    this.description = this.cardElement.querySelector('.card__text');
    this.buttonInCard = this.cardElement.querySelector('.button');
    this.indexBasketCard = this.cardElement.querySelector('.basket__item-index');

    this.cardButton.addEventListener('click', () => this.emit('card:open', (this)))
    
    if(this.buttonInCard === null) {
      this.buttonInCard = this.cardElement.querySelector('.basket__item-delete');
      if(this.buttonInCard) {
        this.buttonInCard.addEventListener('click', () => {
          this.emit('card:changed', (this));
        })
      }
    }
    else {
      this.buttonInCard.addEventListener('click', () => {
        this.emit('card:changed', (this));
      })
    }
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id || "";
  }

  render(card: ICard) {
    this.title.textContent = card.title;
    if(this.category) {
      this.category.textContent = card.category;
      this.category.classList.add(`card__category_${Object.keys(this._categoryColor).find(k => this._categoryColor[k] === card.category)}`)
    }

    if(card.price != null) {
      this.price.textContent = String(card.price) + ' синапсов'}
    else {
      this.price.textContent = 'Бесценно'
      if(this.buttonInCard) {
        this.buttonInCard.setAttribute('disabled', '');
      }
    }

    if(this.image) {
      this.image.src = card.image;
    }

    this._id = card.id;

    if(this.description) {
      this.description.textContent = card.description;
    }

    return this.cardElement;
  }

  buyButtonView(force: string | undefined) {
    if(force === undefined) {
      this.buttonInCard.textContent = 'В корзину';
    }
    else {
      this.buttonInCard.textContent = 'Удалить'
    }
  }
}