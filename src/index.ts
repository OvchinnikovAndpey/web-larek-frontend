import { AppState } from './components/AppState';
import './scss/styles.scss';
import { IProduct } from './types';
import { EventEmitter } from './components/base/events'

const event = new EventEmitter()

const appState = new AppState({}, event)

const initialItems: IProduct[] = [
    { 
        id: '1', 
        title: 'Product 1', 
        category: 'Category 1', 
        image: 'image.png',
        description: 'Description 1', 
        price: 1000 
    },

    { 
        id: '2', 
        title: 'Product 2', 
        category: 'Category 2', 
        image: 'image.png',
        description: 'Description 2', 
        price: 2000 
    },
]

appState.setItems(initialItems);

appState.addBasket('2');
appState.addBasket('1');

console.log('корзина', appState.getBasket());
console.log('количество товаров в корзине', appState.getCountBasket());
console.log('сумма корзины', appState.getTotalBasketPrice());