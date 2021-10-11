import React from 'react';

export const FlipContext = React.createContext({ flip: () => {}, shake: () => {} });

export const useFlip = () => React.useContext(FlipContext);
