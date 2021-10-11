import type { CardData } from '../types';

export const PLACEHOLDERS: {
	[value in keyof Omit<CardData, 'brand'>]: string;
} = {
	owner: 'TITULAR DO CARTÃO',
	number: '0000 0000 0000 0000',
	cvv: '000',
	expiry: 'MM/YY',
};

export const placeholderColor = {
	placeholderTextColor: '#c7c7c7',
};
