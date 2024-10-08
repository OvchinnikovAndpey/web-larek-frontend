
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
    
    productStore: IProduct[]; // Массив карточек товара

    basket: IProduct[]; // Массив корзины заказа пользователя 

    order: IOrder; // Инфо о заказе при добавлении в корзину

    formErrors: FormErrors; // Ошибки заполнения форм

    selectedModalProduct: IProduct; //для хранения выбранного товара. Это позволит отображать выбранный товар в модальном окне при его открытии.

    // Методы:

    addBasket: (value: IProduct): void; //Метод добавления товара в корзину

    deleteBasket (id: string): void; //Метод удаление отдельного товара из корзины

    clearBasket(): void; //Метод очистки корзины заказа (удаления всех карточек товара)

    getTotalBasket(): number; //Метод получения общего количества товара в корзине

    getTotalBasketPrice(): number; //Метод получения общей стоимости карточек в корзине

    getItems(): IProduct[]; //Метод получения id товаров к корзине

    setOrderField(field: keyof IOrderForm, value: string): void;

    validateContact(): boolean; //Валидация формы контактов

    validateOrder(): boolean; // Валидация формы заказов

    clearOrder(): boolean; //Очистка заказа после оформления заказа
    
    hasProductInBasket(products: IProduct ): boolean; // проверяет, есть ли товар с указанным идентификатором в корзине, и возвращает логическое значение (true или false).
    
    getUserData(): IOrder; //получает все данные пользователя.
    
    setSelectedModalProduct(selectedProduct: IProduct); //устанавливает выбранный для открытия в модальном окне товар. Здесь selectedProduct — это объект типа IProduct, который будет выбран для отображения в модалке.
    

}

// Интерфейс, с помощью которого описываем поля заказанных товаров
interface IOrder {

    payment: string; //Способ оплаты

    address: string; //Адрес доставки
    
    email: string; //Электронная почта

    phoneNumber: string; //Номер телефона

}