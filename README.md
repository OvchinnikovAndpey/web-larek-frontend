# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Документация

## Данные и их типы, которые используются в приложении:

### Интерфейс данных карточек продукта выведенных на стартовой странице при загрузке

```
interface IProduct {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
}
```
### Модель храниения списка карточек

```
export interface IProductData {
    total: number
    items: IProduct[]
  }
```
### Состояние приложения и описание методов работы с карточками товаров и корзиной, а также с валидацией форм

```
interface IAppState {
    
    productStore: IProduct[];
    basket: IProduct[];  
    order: IOrder; 
    formErrors: FormErrors;
    selectedModalProduct: IProduct; 

    // Методы:

    addBasket: (value: IProduct): void; 
    deleteBasket (id: string): void;
    clearBasket(): void; 
    getTotalBasket(): number; 
    getTotalBasketPrice(): number; 
    getItems(); 
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateContact(): boolean;
    validateOrder(): boolean; 
    clearOrder(): boolean;
    hasProductInBasket(products: IProduct ): boolean; 
    getUserData(): IOrder; 
    setSelectedModalProduct(selectedProduct: IProduct);

}
```
### Описание поля заказанных товаров
```
interface IOrder {

    payment: string;
    address: string; 
    email: string; 
    phoneNumber: string;

}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP: 
- слой представления, отвечает за отображение данных на странице, 
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие   

### Слой данных

#### Класс ```AppState```
Явлетя моделью данных всего приложения в целом. Данный класс содержит в себе все основные группы данных страницы и методы работы с ними.

Тут находятся данные различных частей приложения, таких как:

- список товаров
- корзина, в которую пользователь добавляет товар
- превью карточек товара
- форма оформления заказа

Расширяется базовым абстрактным классом ```Model<T>``` по интерфейсу ```IAppState```.

```
interface IAppState {
    productStore: IProduct[];
    basket: IProduct[];  
    order: IOrder; 
    formErrors: FormErrors;
    selectedModalProduct: IProduct; 
    addBasket: (value: IProduct): void; 
    deleteBasket (id: string): void;
    clearBasket(): void; 
    getTotalBasket(): number; 
    getTotalBasketPrice(): number; 
    getItems(); 
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateContact(): boolean;
    validateOrder(): boolean; 
    clearOrder(): boolean;
    hasProductInBasket(products: IProduct ): boolean; 
    getUserData(): IOrder; 
    setSelectedModalProduct(selectedProduct: IProduct);
}
```

#### Поля

- productStore: массив объектов типа IProduct.
- basket: массив объектов типа IProduct, представляющий содержимое корзины.
- order: объект типа IOrder, содержащий информацию о заказе.
- formErrors: объект типа FormErrors, содержащий ошибки формы.
- selectedModalProduct: выбранный для отображения в модальном окне товар.

#### Методы

- addBasket: добавляет продукт в корзину.
- deleteBasket: удаляет продукт из корзины по идентификатору.
- clearBasket: очищает корзину.
- getTotalBasket: возвращает общее количество товаров в корзине.
- getTotalBacketPrice: возвращает общую стоимость товаров в корзине.
- getItems: получает список товаров.
- setOrderField: устанавливает значение поля заказа.
- validateContact: проверяет корректность контактных данных.
- validateOrder: проверяет правильность оформления заказа.
- clearOrder: очищает данные заказа.
- hasProductInBasket: проверяет наличие товара в корзине.
- getUserData: получает все данные пользователя.
- setSelectedModalProduct: устанавливает выбранный для открытия в модальном окне товар.

#### Класс ```Product```

Является моделью храния данных товара: 

- id карточки
- Название карточки
- категория товара
- описание товара в карточке
- ссылка на картинку
- Стоимость товара (карточки)

Расширяется базовым абстрактным классом ```Model<T>``` по интерфейсу ```IProductItem```

```
interface IProduct {
    id: string; 
    title: string; 
    category: string; 
    description: string; 
    image: string; 
    price: number | null; 
}
```

### Компоненты представления (View)

