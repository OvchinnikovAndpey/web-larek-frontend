import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderResponse } from '../types';

export class LarekApi extends Api {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		// console.log('baseUrl:', baseUrl);
		this.cdn = cdn;
	}

	getProducts() {
		return this.get('/product')
			.then((data: ApiListResponse<IProduct>) => {
				console.log('Данные получены:', data); // вывести данные в консоль
				return data.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				}));
			})
			.catch((err) => {
				console.error('Ошибка получения данных:', err); // вывести ошибку в консоль
			});
	}

	postOrder(order: IOrderResponse) {
		return this.post('/order', order).then((data: IOrderResponse) => data);
	}
}
