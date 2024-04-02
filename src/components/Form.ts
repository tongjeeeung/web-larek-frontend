import { EventEmitter, IEvents } from "./base/events";

export interface IForm extends IEvents {
  render(): void;
  getOrderFromForm(): {[key: string]: string};
  setOrderFromForm(name: string, value: string): void;
  clearValue(): void;
  inputElements: HTMLInputElement[];
  submitButton: HTMLButtonElement;
  cashButton: HTMLButtonElement;
  cardButton: HTMLButtonElement;
}

export class Form extends EventEmitter implements IForm {
  protected formElemet: HTMLFormElement;
  inputElements: HTMLInputElement[];
  cashButton: HTMLButtonElement;
  cardButton: HTMLButtonElement;
  submitButton: HTMLButtonElement;
  protected order: {[key: string]: string} = {};

  constructor(formElement: HTMLFormElement) {
    super();
    this.formElemet = formElement.content.cloneNode(true) as HTMLFormElement;
    this.inputElements = Array.from(this.formElemet.querySelectorAll('.form__input'));
    this.submitButton = this.formElemet.querySelector('[type="submit"]');

    this.cashButton = this.formElemet.querySelector('[name="cash"]');
    this.cardButton = this.formElemet.querySelector('[name=card]');

    if(this.cardButton && this.cashButton) {
      this.cardButton.addEventListener('click', () => {
        this.setForce(this.cardButton);
      })
      this.cashButton.addEventListener('click', () => {
        this.setForce(this.cashButton);
      })
    }

    this.inputElements.forEach(input => {
      input.addEventListener('input', () => {
        this.emit('input:changed', (this));
      })
    })

    this.submitButton.addEventListener('click', event => {
      event.preventDefault();
      if(this.cardButton) {
        if(this.cardButton.classList.contains('button_alt-active')) {
          this.setOrderFromForm('payment', 'card')
        }
        else {
          this.setOrderFromForm('payment', 'cash')
        }
        this.setOrderFromForm('address', this.inputElements[0].value)
      }
      else {
        this.setOrderFromForm('email', this.inputElements[0].value);
        this.setOrderFromForm('phone', this.inputElements[1].value);
      }
      this.emit('form:submit', this);
    })
  }

  protected setForce(button: HTMLButtonElement) {
    button.classList.toggle("button_alt-active");
    if(button === this.cardButton) {
      this.cashButton.classList.remove("button_alt-active")
    }
    else this.cardButton.classList.remove("button_alt-active")
    this.emit('input:changed', (this));
  }

  render(){
    return this.formElemet
  }

  setOrderFromForm(name: string, value: string) {
    this.order[name] = value;
  }

  getOrderFromForm() {
    return this.order
  }

  clearValue() {
    this.formElemet.reset()
  }
}