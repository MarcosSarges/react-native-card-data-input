export type CardData = {
	number: string;
	owner: string;
	expiry: string;
	cvv: string;
};

export type CardDataResponse = {
	data: CardData | null;
	errors: CardError[];
};

export type CardRef = {
	flip: () => void;
	shake: () => void;
	clear: () => void;
	getCardData: () => CardDataResponse;
};

export type CardProps = {
	data?: CardData;
};

export type CardError =
	| 'NOT_VALID_CARD_NUMBER'
	| 'NOT_VALID_EXPIRATION_DATE'
	| 'NOT_VALID_OWNER_NAME'
	| 'NOT_VALID_SECURITY_CODE';

export type Validation = {
	isValidCardNumber: boolean;
	isValidExpiryDate: boolean;
	isValidOwnerName: boolean;
	isValidSecurityCode: boolean;
	isValid: boolean;
};
