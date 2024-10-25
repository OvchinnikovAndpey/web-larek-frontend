// Тип, по которому будет определяться, какую ошибку вывести в конкретную форму
export type FormErrors = Partial<Record<keyof IUser, string>>;

// метод определения типа оплаты
export type PaymentMethod = 'cash' | 'online' | null;

//Данные получаемые при запросе списка продуктов
export interface IProductData {
	total: number;   // общее кол-во карточек
	items: IProduct[]; // массив карточек
}

// Интерфейс данных карточек продукта выведенных на стартовой странице при загрузке

export interface IProduct {
	id: string; // id карточки

	title: string; // Название карточки

	category: string; // категория товара

	description: string; // Описание товара в карточке

	image: string; // ссылка на картинку

	price: number | null; // Стоимость товара (карточки)

	button?: string; // Кнопка "Купить" (карточки)

	index?: number; // индекс карточки
}

// интерфейс, который описывает состояние приложения и описывает методы работы с карточками товаров и корзиной
// Интерфейс имеет методы для хранения карточек, состояние заказа пользователя, ошибки валидации и состояние корзины
// Подробное описание методов указано непосредственно в интерфейсе в виде комментариев

export interface IAppState {
	productStore: IProduct[]; // Массив карточек товара

	// Методы:

	addBasket(value: IProduct): void; //Метод добавления товара в корзину

	deleteBasket(): void; //Метод удаление отдельного товара из корзины

	clearBasket(): void; //Метод очистки корзины заказа (удаления всех карточек товара)

	getTotalBasket(): number; //Метод получения общего количества товара в корзине

	getTotalBasketPrice(): number; //Метод получения общей стоимости карточек в корзине

	getItems(): void; //Метод получения id товаров к корзине

	setOrderField(field: keyof IOrderForm, value: string): void; //Метод заполнения полей ввода: мыло, телефон, адресс, способ оплаты

	validateContact(): boolean; //Валидация формы контактов

	validateOrder(): boolean; // Валидация формы заказов

	clearOrder(): boolean; //Очистка заказа после оформления заказа

	hasProductInBasket(products: IProduct): boolean; // проверяет, есть ли товар с указанным идентификатором в корзине, и возвращает логическое значение (true или false).
}

// Данные о пользователе
export interface IUser {
	payment?: string; //Способ оплаты

	address?: string; //Адрес доставки

	email?: string; //Электронная почта

	phoneNumber?: string; //Номер телефона

	total?: string | number; //Общая стоимость заказа
}

export interface IOrderForm {
	email: string; // Электронная почта

	phone: string; // Номер телефона

	adress: string; // Адрес доставки
}

// Корзина с количеством заказа

export interface IOrderData {
	items: IProduct[]; // Массив карточек в корзине
	totalamount: number; // Общая стоимость заказа
}

// Данные о заказе
export interface IOrderResponse {
	id: string; // Идентификатор заказа
}

// Интерфейс для валидации форм
export interface IForm {
	valid: boolean; // Состояние валидации формы
	errors: string[]; // Сообщения об ошибках валидации
}
