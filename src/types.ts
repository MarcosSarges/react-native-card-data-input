export type CardData = {
	number: string;
	holder: string;
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
	clear: (fields?: ClearFields) => void;
	getCardData: () => CardDataResponse;
};

export type ClearFields = ReadOnlyFields;

export type ReadOnlyFields = {
	[name in keyof CardData]?: boolean;
};

export type Placeholders = {
	[name in keyof CardData]?: name extends 'cvv' ? (length: number) => string : string;
};

export type Labels = {
	securityCode?: string;
};

export type CardProps = {
	data?: CardData;
	readOnly?: boolean | ReadOnlyFields;
	background?: string | JSX.Element;
	labels?: Labels;
	placeholders?: Placeholders;
	onValidStateChanged?: (isValid: boolean) => void;
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

export type CardContextProps = {
	data: CardData;
	isValid: Validation;
	setData: (data: CardData) => void;
	flip: () => void;
	shake: () => void;
	readOnly: boolean | Required<ReadOnlyFields>;
	height: number;
	labels: Required<Labels>;
	placeholders: Required<Placeholders>;
};
