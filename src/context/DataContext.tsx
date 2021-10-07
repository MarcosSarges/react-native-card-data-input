import React from 'react';
import type { CardData } from '../types';

type Props = {
  data: CardData;
  setData: (data: CardData) => void;
};

export const CardDataContext = React.createContext<Props>({
  data: {
    number: '',
    owner: '',
    expiry: '',
    cvv: '',
  },
  setData: (_data) => {},
});

export const useCardData = () => React.useContext(CardDataContext);
