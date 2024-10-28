import './scss/styles.scss';
import { AppState } from './components/AppState';
import { LarekApi } from './components/LarekApi';
import { Page } from './components/Page';
import { Card, CardInfo, CardOnPage, ICardAction } from './components/Card';
import { Contacts, Order } from './components/Order';

import { EventEmitter } from './components/base/events';

import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { ISucces, Success } from './components/common/Success';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { CategoryType, IOrderResponse, IProduct, IUser } from './types';

// События
const events = new EventEmitter();

// API
const api = new LarekApi(API_URL, CDN_URL);

// Темплейты
// Этот порядок отражает последовательность действий пользователя на сайте:
// каталог, предпросмотр каталога, предпросмотр продукта, добавление в корзину,
// оформление заказа, ввод контактной информации и получение подтверждения успешного заказа.

const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'); //Каталог карточек
const productPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview'); //Предпросмотр продукта
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket'); //Элементы корзины
const basketModalTemplate = ensureElement<HTMLTemplateElement>('#basket'); //Модальное окно корзины
const orderModalTemplate = ensureElement<HTMLTemplateElement>('#order'); //Модальное окно заказа
const contactsModalTemplate = ensureElement<HTMLTemplateElement>('#contacts'); // Модальное окно контактов
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success'); //Модальное окно успешного заказа

// Модель приложения (данных)
const appModel = new AppState({}, events);

//Эти две переменные создаются для управления двумя основными компонентами приложения: страницей и модальным окном.
const appModelPage = new Page(document.body, events);
const appModalPage = new Modal(
	ensureElement<HTMLElement>('#modal-container'),
	events
);

// Части, которые переиспользуются в компонентах интерфейса
const basket = new Basket(
	cloneTemplate<HTMLTemplateElement>(basketModalTemplate),
	events
); //Модальное окно корзины
const contacts = new Contacts(
	cloneTemplate<HTMLFormElement>(contactsModalTemplate),
	events
); // Модальное окно контактов
const order = new Order(
	cloneTemplate<HTMLFormElement>(orderModalTemplate),
	events
); //Модальное окно заказа

const success = new Success(cloneTemplate(successModalTemplate), {
	onClick: () => {
		appModalPage.close();
	},
});

//Бизнес-логика приложения

// Получение списка карточек
api
	.getProducts()
	.then((data) => {
		if (data) {
			appModel.productStore(data);
		} else {
			console.log('Ошибка получения карточек: данные не были получены');
		}
	})
	.catch((err) => console.log('Ошибка получения карточек:', err));

// Вывод списка карточек в каталоге
events.on('items:changed', () => {
	appModelPage.catalog = appModel.getItems().map((item) => {
		const card = new CardOnPage(cloneTemplate(catalogCardTemplate), {
			onClick: () => events.emit('card:selected', item),
			price: item.price,
			title: item.title,
		});
		return card.render({
			id: item.id,
			title: item.title,
			price: item.price,
			category: item.category as CategoryType,
			image: item.image,
		});
	});
});

// Блокировка всей страницы, когда открыта модалка предпросмотра карточек и оформления заказа.
events.on('modal:open', () => {
	appModelPage.locked = true;
});

// Снятие блокировки всей страницы, когда закрыта модалка предпросмотра карточек и оформления заказа.
events.on('modal:close', () => {
	appModelPage.locked = false;
});

//Событие Открытия предпросмотра карточек
events.on('card:selected', (item: IProduct) => {
	appModel.setPreview(item);
});

// отображение предпросмотра карточки
events.on('prepreview:change', (item: IProduct) => {
	const productInBasket = appModel.hasProductInBasket(item.id); //Проверка наличия продукта в корзине
	const cardPreview = new CardInfo(cloneTemplate(productPreviewTemplate), {
		onClick: () => {
			if (productInBasket) {
				events.emit('basket:remove', item);
			} else {
				events.emit('basket:add', item);
			}
			appModalPage.close();
		},
		price: item.price,
		title: item.title,
	} as ICardAction);

	appModalPage.render({
		content: cardPreview.render({
			id: item.id,
			title: item.title,
			price: item.price,
			category: item.category as CategoryType,
			image: item.image,
			description: item.description,
			button: productInBasket ? 'Удалить из корзины' : 'В корзину',
		}),
	});
});

// Событие изменения корзины
events.on('basket:change', () => {
	appModelPage.counter = appModel.getCountBasket();
	basket.total = appModel.getTotalBasketPrice();
	basket.list = appModel.getBasket().map((item, index) => {
		const card = new Card(cloneTemplate(basketItemTemplate), {
			price: item.price,
			title: item.title,
			onClick: () => events.emit('basket:remove', item),
		});
		return card.render({
			price: item.price,
			title: item.title,
			index: index + 1,
		});
	});
});

// Добавление товара в корзину
events.on('basket:add', (item: IProduct) => {
	appModel.addBasket(item.id);
	events.emit('basket:change');
});

// Удаление товара из корзины
events.on('basket:remove', (item: IProduct) => {
	appModel.deleteBasket(item.id);
	events.emit('basket:change');
});

// Открытие корзины
events.on('basket:open', () => {
	appModalPage.render({
		content: basket.render({}),
	});
});

// console.log('корзина', appModel.getBasket());

// событие открытия оформления заказа
events.on('basket:toOrder', () => {
	// Очистка форм и данных перед началом оформления нового заказа
	order.clear();
	contacts.clear();
	appModel.clearOrderData();

	appModalPage.render({
		content: order.render({
			valid: false,
			errors: [],
			address: '',
			payment: null,
		}),
	});
});

// Изменение данных
events.on('input:error', (errors: Partial<IUser>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
	order.payment = appModel.getField();
});

// событие изменения полей
events.on(
	'orderInput:change',
	(data: { field: keyof IUser; value: string }) => {
		appModel.addOrderField(data.field, data.value);
		// console.log('appModel.userData', appModel.userData)
	}
);

// событие отправки формы
events.on('order:submit', () => {
	appModalPage.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// событие отправки формы
events.on('contacts:submit', () => {
	const orderData = appModel.getUserData();
	orderData.total = appModel.getTotalBasketPrice();

	const items = appModel.getBasketId();

	const payload: IOrderResponse = {
		payment: orderData.payment,
		address: orderData.address,
		email: orderData.email,
		phone: orderData.phone,
		total: orderData.total,
		items: items,
	};
	api
		.postOrder(payload)
		.then((result) => {
			events.emit('order:success', result);
			appModel.clearBasket();
			appModelPage.counter = appModel.getCountBasket();
		})
		.catch((error) => {
			console.error('Ошибка отправки заказа:', error);
		});
});

// событие успешного оформления заказа
events.on('order:success', (result: ISucces) => {
	appModalPage.render({
		content: success.render({
			total: result.total,
		}),
	});
	// Очистка форм и данных после оформления заказа
	order.clear();
	contacts.clear();
	appModel.clearOrderData();
	appModel.clearBasket();
});
