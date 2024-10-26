export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
import { CategoryMap } from "../types";

export const settings = {

};
// console.log('API_URL:', API_URL);
// console.log('CDN_URL:', CDN_URL);

export const categoryMap: CategoryMap = {
    'другое': 'card__category_other',
    'софт-скил': 'card__category_soft',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard',
};