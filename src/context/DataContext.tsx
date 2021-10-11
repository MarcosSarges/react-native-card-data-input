import React from 'react';
import type { Validation } from '..';
import type { CardData } from '../types';

type Props = {
	data: CardData;
	isValid: Validation;
	setData: (data: CardData) => void;
};

export const CardDataContext = React.createContext<Props>({
	data: {
		number: '',
		owner: '',
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
});

export const useCardData = () => React.useContext(CardDataContext);
