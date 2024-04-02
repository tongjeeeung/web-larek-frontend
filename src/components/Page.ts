import { EventEmitter, IEvents } from "./base/events";

export interface IPage extends IEvents{
  catalogContainer:HTMLElement[];
  popupContainer: HTMLElement;
  counter: number;
}

export class Page extends EventEmitter implements IPage {
  _catalogContainer: HTMLElement;
  _popupContainer: HTMLElement;
  _counter: HTMLElement;
  _basket: HTMLElement;
  _wrapper: HTMLElement;

  constructor(protected containerCatalog: HTMLElement, protected containerPopup: HTMLElement, protected basketContauner: HTMLElement ) {
    super()
    this._catalogContainer = this.containerCatalog;
    this._popupContainer = this.containerPopup;
    this._basket = this.basketContauner;
    this._counter = this._basket.querySelector('.header__basket-counter');
    this._wrapper = document.querySelector('.page__wrapper');
    this._basket.addEventListener('click', () => {
      this.emit('basket:open', this);
    })
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  set catalogContainer(cards: HTMLElement[]) {
    this._catalogContainer.replaceChildren(...cards);
  }

  set popupContainer(data: HTMLElement) {
    this._popupContainer.replaceChildren(data);
  }

  set locked(value: boolean) {
    if(value) {
      this._wrapper.classList.add('page__wrapper_locked');
    }
    else this._wrapper.classList.remove('page__wrapper_locked');
  }
}