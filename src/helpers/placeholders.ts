import type { Labels, Placeholders } from '../types';

export const PLACEHOLDERS: Required<Placeholders> = {
	holder: 'HOLDER NAME',
	number: '0000 0000 0000 0000',
	cvv: (length) => Array(length).fill('0').join(''),
	expiry: 'MM/YY',
};

export const LABELS: Required<Labels> = {
	securityCode: 'Security code',
};

export const placeholderColor = {
	placeholderTextColor: '#cccccc',
};
