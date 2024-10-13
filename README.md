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

### Описание данных пользователя
```
interface IOrder {

    payment: string;

    address: string;
    
    email: string;

    phoneNumber: string;

}

interface IOrderForm {
    email: string;

    phone: string;

    adress: string;
}
```

### Корзина с количеством заказа 

```
interface IOrderData {
    items: IProduct[];
    totalamount: number;
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

#### Основные события, которые генерируются в приложении 

- ```basket:toOrder``` — событие, которое происходит при нажатии на кнопку «Оформить» в корзине. Как итог,  открывается модальное окно с выбором способа оплаты и адреса, куда доставить товар.

- ```order:cash``` — событие, возникающее при выборе онлайн-оплаты.

- ```input:change``` — событие, возникающее при вводе данных в форму заказа Order и контактов Contacts. С помощью данного события активируется валидация.

- ```basket:toContacts``` — событие, происходящее при клике на кнопку «Оформить». После этого открывается модальное окно, в котором необходимо заполнять поля контактов.

- ```order:offline``` — событие, запускаемое при выборе оплаты при получении.

- ```order:success``` — событие, вызываемое успешным ответом сервера при оплате товара. Оно открывает модальное окно, информирующее об успешной оплате.

- ```input:error``` — событие, выполняющее проверку формы и возвращающее ошибки формы.

- ```items:changed``` — событие, которое происходит при изменении списка товаров и вызывает перерисовку списка товаров на странице.

- ```modal:close``` — событие, происходящее при клике на кнопку закрытия, клике вне модального окна или по клавише Esc. Оно приводит к закрытию модального окна.

- ```card:select``` — событие, инициируемое при клике на карточку товара. Получает данные о ней — объект конкретного товара.

- ```preview:change``` — событие, возникающее при передаче моделью новых данных. Оповещает View и приводит к отрисовке содержимого модального окна.

- ```card:toBasket``` — событие, инициированное при клике на кнопку «В корзину». Приводит к добавлению товара в корзину и перерисовке счётчика корзины на главной.

- ```basket:open``` — событие, запускаемое при клике на значок корзины. Приводит к открытию модального окна с выбранными товарами и итоговой ценой.

- ```basket:delete``` — событие, вызванное кликом на значок корзины внутри самой корзины. Вызывает перерисовку списка товаров и счётчика на главной странице.


### Слой данных

#### Класс ```AppState```
Явлетя моделью данных всего приложения в целом. Данный класс содержит в себе все основные группы данных страницы и методы работы с ними.

Тут находятся данные различных частей приложения, таких как:

- список товаров
- корзина, в которую пользователь добавляет товар
- превью карточек товара
- форма оформления заказа

В полях класса хранятся данные:

- ```items: IProduct[]``` - Массив объектов товаров приложения
- ```basket: IProduct[]``` - Массив объектов товаров, которые добавлены в корзину
- ```order: IOrder``` - Информация о заказе при покупке товара

Методы класса:

- ```addBasket```: добавляет продукт в корзину.
- ```deleteBasket```: удаляет продукт из корзины по идентификатору.
- ```clearBasket```: очищает корзину.
- ```getTotalBasket```: возвращает общее количество товаров в корзине.
- ```getTotalBacketPrice```: возвращает общую стоимость товаров в корзине.
- ```getItems```: получает список товаров.
- ```setOrderField```: устанавливает значение поля заказа.
- ```validateContact```: проверяет корректность контактных данных.
- ```validateOrder```: проверяет правильность оформления заказа.
- ```clearOrder```: очищает данные заказа.
- ```hasProductInBasket```: проверяет наличие товара в корзине.

### Классы представления

#### Класс ```Page```

Данный класс отвечает за отображение данных контента, который пользователь видит, как только
зашёл на страницу: список карточек, корзину, количество товаров в корзине (число).\
Рассширяет базовый абстрактный класс Component по интерфейсу IProductData.

Конструктор класса принимает container типа ```HTMLElement```, передавая его в родительский конструктор, а также объект event типа ```IEvents```.

Поля класса:

- ```basketCounter``` — хранит разметку счётчика товаров в корзине;
- ```wrapper``` — хранит общую разметку страницы;
- ```productOnPage``` — хранит карточки товаров на странице;
- ```basket``` — хранит кнопку корзины.

Методы класса:

- ```set catalog``` — отображает карточки товаров;
- ```set cocked``` — устанавливает класс, блокирующий прокрутку страницы;
- ```set counter``` — отображает счётчик товаров в корзине.

#### Класс ```Cards```
Класс ```Cards``` отвечает за отображение данных карточки товара в различных частях интерфейса: в каталоге, в модальном окне отдельной карточки и в каталоге корзины.

Поля класса связаны с разметкой, а методы отвечают за наполнение этой разметки данными. Класс расширяет базовый абстрактный класс Component по интерфейсу ```IProduct```.

У класса есть конструктор, который принимает container типа ```HTMLElement``` и передаёт его в родительский конструктор, а также объект event типа ```IEvents```.

Среди полей класса можно выделить следующие:

- ```id``` — хранит идентификатор карточки;
- ```category``` — хранит разметку категории карточки;
- ```image``` — хранит разметку изображения карточки;
- ```title``` — хранит разметку заголовка карточки;
- ```description``` — хранит описание карточки;
- ```price``` — хранит разметку цены карточки.

Метод ```setData(cardData: IProduct)``` заполняет атрибуты элементов карточки.

#### Класс ```Modal```

Класс ```Modal``` отвечает за отображение модального окна. Он расширяет базовый абстрактный класс Component и обеспечивает функциональность для управления модальным окном. Также класс обеспечивает закрытие модалки с помощью нажатия на кнопку закрытия (крестик), оверлей, кнопка "ESC" на клавиатуре пользоваьеля.

Конструктор класса принимает container типа ```HTMLElement```, передавая его в родительский конструктор, и объект event типа ```IEvents```.

У класса есть два поля:

- ```closeButton``` — разметка кнопки закрытия модального окна;
- ```content``` — разметка контейнера для контента модального окна.

Также у класса есть три метода:

- ```open``` — открывает модальное окно;
- ```close``` — закрывает модальное окно;
- ```render``` — отображает данные контента.

#### Класс ```Basket``` 

Класс ```Basket``` описывает корзину товаров и расширяет базовый абстрактный класс Component.
Данный класс отвечает за отображение корзины, количества товаров в ней и стоимости товара.

У класса есть конструктор, который принимает container типа ```HTMLElement``` и передаёт его в родительский конструктор, а также объект event типа ```IEvents```.

Среди полей класса можно выделить следующие:

- ```productListElement``` — блок для отображения списка карточек товаров;
- ```totalElement``` — отображение суммы товаров в корзине;
- ```button``` — элемент для отображения стоимости корзины.

Методы ```set List``` и ```set Price``` устанавливают товары в разметку и значение суммы товаров соответственно.

- ```set ListWrapper``` отвечает за установку товаров в разметку. Он может использоваться для добавления, удаления или обновления товаров в корзине.

- ```set ProductsPrise``` устанавливает значение суммы товаров. Это значение может быть рассчитано на основе количества и цены каждого товара в корзине.

#### Класс ```Form```

Класс ```Form```  отвечает за работы форм в приложении, а также за валидацию введённых данных и вывод на конкретную форму различных ошибок ввода данных. Данный класс раширяет базовый абстрактный класс Component.

Класс ```Form``` является базовым классом для всех форм в приложении. Он предоставляет основные методы и свойства, необходимые для работы с формами.

У класса есть конструктор, который принимает container типа ```HTMLElement``` и передаёт его в родительский конструктор, а также объект event типа ```IEvents```.

- ```submitButton``` — хранит разметку кнопки отправки формы;
- ```errors```— хранит разметку вывода ошибок валидации.

Методы класса:

- ```onInput``` регистрирует событие с именем конкретного поля. Этот метод может использоваться для отслеживания изменений в полях формы и выполнения определённых действий на основе этих изменений. Например, при изменении поля «Имя» может отображаться сообщение о том, что это поле обязательно для заполнения.
- ```isValid``` устанавливает валидность формы. Этот метод проверяет правильность заполнения всех обязательных полей и возвращает значение true, если все поля заполнены правильно, и false в противном случае.

- ```render``` выполняет отрисовку формы и её элементов. Этот метод создаёт элементы формы и размещает их на странице.

#### Класс ```Order```

Класс ```Order``` отвечает за отображение выбора способа оплаты и адреса покупателя в модальном окне. Он расширяет класс Form по интерфейсу ```IOrder```.

Конструктор класса ```Order(container: HTMLElement, protected events: IEvents)```

Конструктор принимает два параметра:

container типа ```HTMLElement``` — элемент, который будет использоваться как контейнер для модального окна. Контейнер передаётся в родительский конструктор.
events типа ```IEvents``` — объект, содержащий события, которые будут обрабатываться классом ```Order```.

Поля класса:

- ```buttonPay``` хранит разметку кнопок формы оплаты. 

Методы класса:

- ```set Pay``` устанавливает класс активности на кнопку. 

- ```set Address``` устанавливает значение поля адрес. 

#### Класс ```Contacts```

Класс Contacts отвечает за отображение контактов покупателя в модальном окне. Он расширяет класс Form по интерфейсу IOrder.

Конструктор класса принимает container типа ```HTMLElement```, передавая его в родительский конструктор, и объект event типа ```IEvents```.

Методы класса:

- ```set Phone``` — устанавливает значение поля телефона;
- ```set Email``` — устанавливает значение поля почты.

### Класс ```Success```

Класс ```Success``` отвечает за отображение успешной покупки. Он расширяет базовый абстрактный класс Component.

Конструктор класса ```Success (container: HTMLElement, protected events: IEvents)```

Конструктор принимает два параметра:

- container типа ```HTMLElement``` — элемент, который будет использоваться как контейнер для отображения успешной покупки. Контейнер передаётся в родительский конструктор.

- events типа ```IEvents``` — объект, содержащий события, которые будут обрабатываться классом Success.
Поля класса totalAmount

Поля:

- ```totalAmount``` хранит разметку общей суммы товаров в заказе.

Методы: 

- ```set TotalCost``` устанавливает значение общей суммы заказа. 