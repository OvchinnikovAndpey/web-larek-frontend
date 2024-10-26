import { IProduct, CategoryType } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { categoryMap, CDN_URL } from "../utils/constants";

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
	price: number | null;
	title: string;
	index?: number;
}

// Класс Card является базовым классом для карточек, который наследуется от класса Component и имеет тип параметра IProduct.
export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _index?: HTMLElement;

	constructor(container: HTMLElement, action?: ICardAction) {
		super(container);
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = container.querySelector('.card__button');
		this._index = container.querySelector('.basket__item-index');

		if (action?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', action.onClick);
			} else {
				container.addEventListener('click', action.onClick);
			}
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
	set button(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = !value;
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
}

//Класс CardOnPage наследуется от класса Card и представляет собой карточку, которая отображается на странице
export class CardOnPage extends Card {
	_image: HTMLImageElement;
	_category: HTMLElement;

	constructor(
		container: HTMLElement, 
		action?: ICardAction
	) {
		super(container, action);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: CategoryType) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryMap[value], true);
	}
}

//Класс CardInfo наследуется от класса CardOnPage и представляет собой карточку с предпросмотром.
export class CardInfo extends CardOnPage {
	_description: HTMLElement;

	constructor(container: HTMLElement, action?: ICardAction) {
		super(container, action);

		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}