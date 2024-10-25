import './scss/styles.scss';
import { AppState } from './components/AppState';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { Card, CardOnPage, CardInfo } from './components/Card';
import { Сontacts, Order } from './components/Order';

import { EventEmitter } from './components/base/events';

import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ISucces, Success } from './components/common/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { IUser, IProduct, IOrderResponse } from './types';

const events = new EventEmitter();
const api = new LarekApi( API_URL, CDN_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})


// Темплейты
// Этот порядок отражает последовательность действий пользователя на сайте:
// каталог, предпросмотр каталога, предпросмотр продукта, добавление в корзину,
// оформление заказа, ввод контактной информации и получение подтверждения успешного заказа.

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); //Каталог карточек
const productPreviewTemplate =ensureElement<HTMLTemplateElement>('#card-preview'); //Предпросмотр продукта
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); //Элементы корзины
const basketModalTemplate = ensureElement<HTMLTemplateElement>('#basket'); //Модальное окно корзины
const orderModalTemplate = ensureElement<HTMLTemplateElement>('#order'); //Модальное окно заказа
const contactsModalTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Модальное окно контактов
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success'); //Модальное окно успешного заказа

// Модель приложения (данных)
const appModel = new AppState({}, events);

//Эти две переменные создаются для управления двумя основными компонентами приложения: страницей и модальным окном.
const appModelPage = new Page(document.body, events);
const appModalPage = new Modal(ensureElement<HTMLElement>('#modal-container'),events);

// Части, которые переиспользуются в компонентах интерфейса
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketModalTemplate),
	events
); //Модальное окно корзины
const contacts = new Сontacts(
	cloneTemplate<HTMLFormElement>(contactsModalTemplate),
	events
); // Модальное окно контактов
const order = new Order(
	cloneTemplate<HTMLFormElement>(orderModalTemplate),
	events
); //Модальное окно заказа

//Бизнес-логика приложения

// api.getProducts()
//   .then(appModel.productStore.bind(appModel))
//   .catch(err => {
//     console.log(err)
//   })

// Получение списка карточек
api.getProducts()
    .then((data) => {
        if (data) {
            appModel.productStore(data);
        } else {
            console.log('Ошибка получения карточек: данные не были получены');
        }
    })
    .catch((err) => console.log('Ошибка получения карточек:', err));


	
// api.getProducts()
//   .then((data) => {
//     console.log('Ответ от сервера:', data);
//     console.log('Тип ответа:', typeof data);
//     if (typeof data === 'object' && data !== null) {
//       console.log('Данные являются объектом');
//       console.log('Свойства объекта:', Object.keys(data));
//     } else {
//       console.log('Данные не являются объектом');
//     }
//   })
//   .catch((error) => {
//     console.error('Ошибка:', error);
//   });

	
// console.log(appModel.getItems());

events.on('items:changed', () => {
	appModelPage.catalog = appModel.getItems().map((item) => {
		const card = new CardOnPage(cloneTemplate(catalogCardTemplate), {
			onClick: () => events.emit('card:selected', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			category: item.category,
			image: item.image,
		});
	});
});



// Для проверки работоспособности модели данных приложения
// const event = new EventEmitter()

// const appState = new AppState({}, event)

// const initialItems: IProduct[] = [
//     {
//         id: '1',
//         title: 'Product 1',
//         category: 'Category 1',
//         image: 'image.png',
//         description: 'Description 1',
//         price: 1000
//     },

//     {
//         id: '2',
//         title: 'Product 2',
//         category: 'Category 2',
//         image: 'image.png',
//         description: 'Description 2',
//         price: 2000
//     },
// ]

// appState.setItems(initialItems);

// appState.addBasket('2');
// appState.addBasket('1');

// console.log('корзина', appState.getBasket());
// console.log('количество товаров в корзине', appState.getCountBasket());
// console.log('сумма корзины', appState.getTotalBasketPrice());
