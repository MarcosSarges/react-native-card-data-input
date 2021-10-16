import React from 'react';
import type { CardContextProps } from '..';

export const CardContext = React.createContext<CardContextProps>({
	data: {
		number: '',
		holder: '',
		expiry: '',
		cvv: '',
	},
	isValid: {
		isValid: false,
		isValidCardNumber: false,
		isValidExpiryDate: false,
		isValidOwnerName: false,
		isValidSecurityCode: false,
	},
	setData: (_data) => {},
	flip: () => {},
	shake: () => {},
	readOnly: false,
	height: 0,
	labels: {
		securityCode: 'Security code',
	},
	placeholders: {
		number: '0000 0000 0000 0000',
		holder: 'Holder name',
		expiry: 'MM/YY',
		cvv: () => '000',
	},
});

export const useCardContext = () => React.useContext(CardContext);
