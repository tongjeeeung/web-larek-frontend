import './scss/styles.scss';

import { ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { ApiShop } from './components/ApiShop';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Card, IViewCard } from './components/Card';
import { AppState } from './components/AppState';
import { Popup } from './components/Popup';
import { Basket } from './components/Basket';
import { Form, IForm } from './components/Form';
import { approvalOrderView } from './components/ApprovalOrderView';
import { ICard } from './types';

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderInfoTemplate = ensureElement<HTMLFormElement>('#order');
const orderFormTemplate = ensureElement<HTMLFormElement>('#contacts');
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new ApiShop(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
  console.log(eventName, data)
})

const page = new Page(document.querySelector('.gallery'), document.querySelector('#modal-container').querySelector('.modal__content'), document.querySelector('.header__basket'));
const app = new AppState();

const popup = new Popup(document.querySelector('#modal-container'));

app.on('catalog:changed', () => {
  renderCatalog()
})

popup.on('modal:open', () => {
  page.locked = true;
})

popup.on('modal:close', () => {
  page.locked = false;
})

function handleOpenPopup(card: IViewCard) {
  const newCard = new Card(cardPreviewTemplate)
  newCard.on('card:changed', handleBuyPrew);
  page.popupContainer = newCard.render(app.getCurrentCard(card.id));
  newCard.buyButtonView(app.getBasket().find(idCard => app.getCurrentCard(card.id).id === idCard))
  popup.open()
}

function handleOpenBasket() {
  let totalPrice: number = 0;
  const basket = new Basket(basketTemplate, cardBasketTemplate);
  basket.on('basket:submit', handleOpenForm);
  const basketIdList = app.getBasket();
  const basketCardList = basketIdList.map(id => {
    const liCard = new Card(cardBasketTemplate);
    liCard.on('card:changed', handleDeliteCard);
    totalPrice += app.getCurrentCard(id).price;
    return liCard.render(app.getCurrentCard(id))
  });
  const orderObj = app.getOrder();
  orderObj.items = app.getBasket();
  orderObj.total = totalPrice;
  page.popupContainer = basket.render(basketCardList, totalPrice);
  popup.open()
}

function handleOpenForm() {
  const form = new Form(orderInfoTemplate)
  form.on('form:submit', handleOpenNextForm);
  form.on('input:changed', validetionForms)
  page.popupContainer = form.render();
}

function validetionForms(form: IForm) {
  if(!hasInvalidInput(form.inputElements) && cheackCashAndCardValid(form)) {
    form.submitButton.removeAttribute('disabled');
  }
  else form.submitButton.setAttribute('disabled', '');
}

function hasInvalidInput(inputElements: HTMLInputElement[]) {
  return inputElements.some(inputElement => {
    return !inputElement.validity.valid;
  })
}

function cheackCashAndCardValid(form: IForm) {
  if(form.cardButton && form.cashButton) {
    if(form.cardButton.classList.contains('button_alt-active') || form.cashButton.classList.contains('button_alt-active')) {
      return true;
    }
    else return false;
  }
  else return true;
}

function handleOpenNextForm(formObj: IForm) {
  const orderObj = app.getOrder();
  orderObj.address = formObj.getOrderFromForm().address;
  orderObj.payment = formObj.getOrderFromForm().payment;
  app.setOrderInfo(orderObj)
  const form = new Form(orderFormTemplate);
  form.on('form:submit', handlePostOrder);
  form.on('input:changed', validetionForms)
  page.popupContainer = form.render()
}

function handlePostOrder(formObj: IForm) {
  const orderObj = app.getOrder();
  orderObj.email = formObj.getOrderFromForm().email;
  orderObj.phone = formObj.getOrderFromForm().phone;
  app.setOrderInfo(orderObj);

  api.postCard(orderObj)
    .then(data => {
      approvalOrder(data.total)
      app.clearBasket();
      page.counter = (app.getBasket().length);
    })
    .catch(err => console.error(err));
}

function approvalOrder(total: number) {
  const newApprovalOrderView = new approvalOrderView(orderSuccessTemplate);
  newApprovalOrderView.on('succes:click', closePopup);
  page.popupContainer = newApprovalOrderView.render(total);
}

function closePopup() {
  popup.close();
}

function handleBuyPrew(card: IViewCard) {
  handleAddDeliteCard(card);
  card.buyButtonView(app.getBasket().find(idCard => card.id === idCard))
}

function handleAddDeliteCard(card: IViewCard) {
  app.setBasket(card.id)
  page.counter = (app.getBasket().length);
}

function handleDeliteCard(card: IViewCard) {
  handleAddDeliteCard(card);
  handleOpenBasket()
}

function renderCatalog() {
  page.catalogContainer = app.catalog.map(item => {
    const htmlcard = new Card(cardCatalogTemplate);
    htmlcard.on('card:open', handleOpenPopup);
    return htmlcard.render(item)
  })
  page.on('basket:open', handleOpenBasket);
}

api.getCardsArr()
  .then(appData => {
    appData = appData.map((item: ICard) => ({
      ...item,
      image: CDN_URL + item.image
    }))
    app.setCatalog(appData)
  });