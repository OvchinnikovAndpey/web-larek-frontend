import { IProduct, IUser, FormErrors } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';

export class AppState extends Model<IProduct> {
	protected items: IProduct[] = [];
	protected basket: IProduct[] = [];
	protected userData: IUser;
	protected formErrors: FormErrors = {};
	protected preview: string;
	// protected events = new EventTarget();

	constructor(data: Partial<IProduct>, events: IEvents) {
		super(data, events);
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phoneNumber: '',
		};
	}

	productStore(cards: IProduct[]) {
		this.items = cards;
		this.events.emit('items:changed', { items: this.items });
	}

	setPreview(card: IProduct) {
		this.preview = card.id;
		this.events.emit('prepreview:change', card);
	}

	addBasket(id: string): void {
		this.basket.push(this.getItemById(id));
	}

	getItemById(id: string): IProduct {
		return this.items.find((item) => item.id === id);
	}

	deleteBasket(id: string): void {
		this.basket = this.basket.filter((item) => item.id !== id);
	}

	setItems(items: IProduct[]): void {
		this.items = items;
	}

	getBasket(): IProduct[] {
		return this.basket;
	}

	getItems(): IProduct[] {
		return this.items;
	}

	clearBasket() {
		this.basket = [];
	}

	getTotalBasketPrice() {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	getCountBasket() {
		return this.basket.length;
	}

	setOrderField(field: keyof IUser, value: string): void {
		this.userData[field] = value;
	}

	validateContact(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this.userData.email) {
			errors.email = 'Необходимо указать email';
		}

		if (!this.userData.phoneNumber) {
			errors.phoneNumber = 'Необходимо указать номер телефонf';
		}
		this.formErrors = errors;
		this.events.emit('input:error', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateOrder(): boolean {
		const errors: typeof this.formErrors = {};
		if (!this.userData.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.userData.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('input:error', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder() {
		this.userData = {
			payment: '',
			address: '',
			email: '',
			phoneNumber: '',
		};
		this.events.emit('input:error', this.formErrors);
	}

	getFormErrors() {
		return this.formErrors;
	}

	getField() {
		return this.userData.payment
	  }

	hasProductInBasket(id: string): boolean {
		return this.basket.some((item) => item.id === id);
	}
}
