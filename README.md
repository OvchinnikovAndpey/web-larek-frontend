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
    
    productStore: Product[];
    basket: Product[];
    order: IOrder;
    formErrors: FormErrors;
    
    // Методы:

    addBasket: (value: Product): void; 
    deleteBasket (id: string): void;
    clearBasket(): void; 
    getTotalBasket(): number; 
    getTotalBasketPrice(): number; 
    getItems(): void; 
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateContact(): boolean; 
    validateOrder(): boolean; 
    clearOrder(); boolean;

}
```
### Описание поля заказанных товаров
```
interface IOrder {
    items: string[]; //Массив id товаров в корзине
    orderAmount: number;
    payment: string;
    address: string;
    email: string;
    phoneNumber: string;

}
```
### Описание для валидции форм ввода данных для заказа 

```
interface IOrderForm {
    phoneNumber: string;
    email: string;
    address: string;
    payment: string;
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
