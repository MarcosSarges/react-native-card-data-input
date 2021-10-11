import type { CardData } from '../types';

type Placeholders = Omit<CardData, 'brand'> & { cvv4digits: string };
export const PLACEHOLDERS: {
	[value in keyof Placeholders]: string;
} = {
	owner: 'FULL NAME',
	number: '0000 0000 0000 0000',
	cvv: '000',
	cvv4digits: '0000',
	expiry: 'MM/YY',
};

export const placeholderColor = {
	placeholderTextColor: '#c7c7c7',
};
