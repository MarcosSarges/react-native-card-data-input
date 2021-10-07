import React from 'react';

export const FlipContext = React.createContext({ flip: () => {} });

export const useFlip = () => React.useContext(FlipContext);
