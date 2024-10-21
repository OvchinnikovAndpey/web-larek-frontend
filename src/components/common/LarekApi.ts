import { Api, ApiListResponse } from '../base/api';
import { IProduct, IOrderResponse } from '../../types';

class LarekApi extends Api {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getItemsList() {
		return this.get('/prodact').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({ ...item }));
		});
	}

	postOrder(order: IOrderResponse) {
		return this.post('/order', order).then((data: IOrderResponse) => data);
	}
}
