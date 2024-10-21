import { IOrderData } from '../../types';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Basket extends Component<IOrderData> {
	items: HTMLElement;
	totalamount: HTMLElement;
	button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.items = ensureElement<HTMLElement>('.basket__list', this.container);
		this.totalamount = container.querySelector('.basket__price');
		this.button = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		if (this.button) {
			this.button.addEventListener('click', () => {
				events.emit('basket:toOrder');
			});
		}
		this.list = [];
	}
	set list(items: HTMLElement[]) {
		if (items.length) {
			this.items.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.items.replaceChildren(
				createElement<HTMLElement>('p', { textContent: 'Корзина пуста' })
			);
			this.button.setAttribute('disabled', 'disabled');
		}
	}

	set total(value: number) {
		this.setText(this.totalamount, `${value} синапсов`);
	}
}
