import type { ImageRequireSource } from 'react-native';

const CARDS: Record<string, ImageRequireSource> = {
	'visa': require('../assets/brands/visa.png'),
	'mastercard': require('../assets/brands/master.png'),
	'american-express': require('../assets/brands/americanexpress.png'),
	'discover': require('../assets/brands/discover.png'),
	'diners-club': require('../assets/brands/diners.png'),
	'jcb': require('../assets/brands/jcb.png'),
	'unionpay': require('../assets/brands/unp.png'),
	'maestro': require('../assets/brands/maestro.png'),
	'elo': require('../assets/brands/elo.png'),
	'hiper': require('../assets/brands/hiper.png'),
	'hipercard': require('../assets/brands/hipercard.png'),
	'unknown': require('../assets/brands/unknown.png'),
};

export const getCardBrandLogo = (cardType: string | undefined) => CARDS[cardType ?? 'unknown'];
