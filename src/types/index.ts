
//Данные получаемые при запросе списка продуктов
export interface IProductData {
    total: number
    items: IProduct[]
}

type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Интерфейс данных карточек продукта выведенных на стартовой странице при загрузке

interface IProduct {
    
    id: string; // id карточки

    title: string; // Название карточки

    category: string; // категория товара

    description: string; // Описание товара в карточке
    
    image: string; // ссылка на картинку

    price: number | null; // Стоимость товара (карточки)

}

// интерфейс, который описывает состояние приложения и описывает методы работы с карточками товаров и корзиной
// Интерфейс имеет методы для хранения карточек, состояние заказа пользователя, ошибки валидации и состояние корзины
// Подробное описание методов указано непосредственно в интерфейсе в виде комментариев

interface IAppState {
    
    protected productStore: IProduct[]; // Массив карточек товара

    protected basket: IProduct[]; // Массив корзины заказа пользователя 

    protected order: IOrder; // Инфо о заказе при добавлении в корзину

    protected formErrors: FormErrors; // Ошибки заполнения форм

    // Методы:

    addBasket: (value: IProduct): void; //Метод добавления товара в корзину

    deleteBasket (id: string): void; //Метод удаление отдельного товара из корзины

    clearBasket(): void; //Метод очистки корзины заказа (удаления всех карточек товара)

    getTotalBasket(): number; //Метод получения общего количества товара в корзине

    getTotalBasketPrice(): number; //Метод получения общей стоимости карточек в корзине

    getItems(): void; //Метод получения id товаров к корзине

    setOrderField(field: keyof IOrderForm, value: string): void;

    validateContact(): boolean; //Валидация формы контактов

    validateOrder(): boolean; // Валидация формы заказов

    clearOrder(): boolean; //Очистка заказа после оформления заказа

}

// Интерфейс, с помощью которого описываем поля заказанных товаров
interface IOrder {
    items: IProduct[]; //Массив id товаров в корзине

    payment: string; //Способ оплаты

    address: string; //Адрес доставки
    
    email: string; //Электронная почта

    phoneNumber: string; //Номер телефона

}

//Интерфейс формы заказа
interface IOrderForm {
    phoneNumber: string;
    email: string;
    address: string;
    payment: string;
}