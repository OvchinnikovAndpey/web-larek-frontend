import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	catalog: HTMLElement[];
}

// Класс Page является базовым классом для страниц, который наследуется от класса Component и имеет тип параметра IPage.
export class Page extends Component<IPage> {
	protected hdrBasketCounter: HTMLElement;
	protected gallery: HTMLElement;
	protected pageWrapper: HTMLElement;
	protected hdrBasket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.hdrBasketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter'
		);
		this.gallery = ensureElement<HTMLElement>('.gallery');
		this.pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this.hdrBasket = ensureElement<HTMLElement>('.header__basket');

		this.hdrBasket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}
	// Установить значение счетчика в хедере.
	set counter(value: number) {
		this.setText(this.hdrBasketCounter, String(value));
	}

	// установить содержимое каталога в элементе gallery.
	set catalog(items: HTMLElement[]) {
		this.gallery.replaceChildren(...items);
	}

	// Установить состояние блокировки страницы.
	set locked(value: boolean) {
		if (value) {
			this.pageWrapper.classList.add('page__wrapper_locked');
		} else {
			this.pageWrapper.classList.remove('page__wrapper_locked');
		}
	}
}
