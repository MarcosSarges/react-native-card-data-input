const CARDS: Record<string, string> = {
  'visa': './icons/visa.png',
  'mastercard': './icons/mastercard.png',
  'american-express': './icons/amex.png',
  'discover': './icons/discover.png',
};

export const getCardBrandLogo = (cardType: string | undefined) =>
  CARDS[cardType ?? -1];
