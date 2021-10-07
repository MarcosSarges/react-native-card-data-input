import type { CardData } from '../types';

export const PLACEHOLDERS: {
  [value in keyof Omit<CardData, 'brand'>]: string;
} = {
  owner: 'OWNER NAME',
  number: '0000 0000 0000 0000',
  cvv: '000',
  expiry: '12/99',
};

export const placeholderColor = {
  placeholderTextColor: '#c7c7c7',
};
