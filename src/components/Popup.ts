import { EventEmitter, IEvents } from "./base/events";

export interface IPopup extends IEvents {
  content: HTMLElement;
  open(): void;
  close(): void;
}

export class Popup extends EventEmitter implements IPopup {
  protected closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(protected container: HTMLElement) {
    super()
    this.closeButton = container.querySelector('.modal__close');
    this._content = container.querySelector('.modal__content');

    this.closeButton.addEventListener('click', this.close.bind(this))
    this.container.addEventListener('click', this.close.bind(this))
    this._content.addEventListener('click', (event) => event.stopPropagation())
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
    this.emit('modal:open');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.emit('modal:close')
  }
}