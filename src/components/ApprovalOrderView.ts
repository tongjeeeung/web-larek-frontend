import { EventEmitter, IEvents } from "./base/events";

export interface IApprovalOrderView extends IEvents {
  render(total: number): HTMLElement;
}

export interface IApprovalOrderViewContainer {
  new (template: HTMLTemplateElement): IApprovalOrderView
}

export class approvalOrderView extends EventEmitter implements IApprovalOrderView {
  protected totalPrice: HTMLElement;
  protected orderDiv: HTMLElement;
  protected button: HTMLButtonElement;
  protected handleFunction: Function;

  constructor(template: HTMLTemplateElement) {
    super()
    this.orderDiv = template.content.cloneNode(true) as HTMLElement;
    this.totalPrice = this.orderDiv.querySelector('.order-success__description');
    this.button = this.orderDiv.querySelector('.order-success__close');

    this.button.addEventListener('click', () => {
      this.emit('succes:click', this);
    })
  }

  render(total: number) {
    this.totalPrice.textContent = 'Списано ' + String(total) + ' синапсов';
    return this.orderDiv
  }
}