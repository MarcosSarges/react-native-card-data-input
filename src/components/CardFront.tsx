import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import cardValidator from 'card-validator';

import { useFlip } from '../context/FlipContext';
import { getCardBrandLogo } from '../utils/logo';
import { useCardData } from '../context/DataContext';
import { placeholderColor, PLACEHOLDERS } from '../utils/placeholders';
import { MaskedTextInput } from 'react-native-mask-text';
import { cardNumberFormatter } from '../utils/formatters';

export const CardFront: React.FC = () => {
	const { flip, shake } = useFlip();
	const { data, isValid, setData } = useCardData();

	const cardBrandImage = React.useMemo(() => {
		const { card } = cardValidator.number(data.number);
		return getCardBrandLogo(card?.type);
	}, [data.number]);

	const ownerInputRef = React.useRef<TextInput>(null);
	const expiryInputRef = React.useRef<TextInput>(null);

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<TextInput
					value={data.number}
					style={styles.cardNumberInput}
					keyboardType="numeric"
					maxLength={19}
					placeholder={PLACEHOLDERS.number}
					{...placeholderColor}
					textContentType="creditCardNumber"
					onChangeText={(text) => setData({ ...data, number: cardNumberFormatter(data.number, text) })}
					returnKeyType="next"
					blurOnSubmit={false}
					onSubmitEditing={() => ownerInputRef.current?.focus()}
				/>

				<View style={styles.line2}>
					<TextInput
						ref={ownerInputRef}
						value={data.owner}
						style={styles.cardOwnerInput}
						placeholder={PLACEHOLDERS.owner}
						autoCapitalize="characters"
						{...placeholderColor}
						textContentType="name"
						onChangeText={(text) => setData({ ...data, owner: text })}
						returnKeyType="next"
						blurOnSubmit={false}
						onSubmitEditing={() => expiryInputRef.current?.focus()}
					/>

					<MaskedTextInput
						ref={expiryInputRef}
						mask="99/99"
						value={data.expiry}
						style={styles.cardExpiryInput}
						placeholder={PLACEHOLDERS.expiry}
						keyboardType="numeric"
						maxLength={5}
						{...placeholderColor}
						onChangeText={(text) => setData({ ...data, expiry: text })}
						returnKeyType="next"
						blurOnSubmit={false}
						onSubmitEditing={() => {
							if (!isValid.isValidCardNumber || !isValid.isValidOwnerName || !isValid.isValidExpiryDate) {
								shake();
								return;
							}

							flip();
						}}
					/>
				</View>
			</View>

			<TouchableOpacity onPress={flip} style={styles.flipButton}>
				<Image resizeMode="contain" source={require('../assets/rotate.png')} style={styles.flipButtonImage} />
			</TouchableOpacity>

			<Image resizeMode="contain" style={styles.chip} source={require('../assets/chip.png')} />

			<View style={styles.cardBrand}>
				<Image resizeMode="contain" style={styles.cardBrandImage} source={cardBrandImage} />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		zIndex: 99,
		// backgroundColor: 'blue',
	},
	content: {
		flex: 1,
		paddingVertical: 20,
		paddingHorizontal: 16,
		justifyContent: 'flex-end',
	},
	line2: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	cardBrand: {
		position: 'absolute',
		top: 15,
		right: 15,
		height: 60,
		width: 100,
		overflow: 'hidden',
	},
	cardBrandImage: {
		flex: 1,
		width: undefined,
		height: undefined,
	},
	cardNumberInput: {
		height: 40,
		fontSize: 24,
		letterSpacing: 2,
		color: 'white',
		fontWeight: 'bold',
		paddingHorizontal: 8,
	},
	cardOwnerInput: {
		height: 40,
		fontSize: 16,
		color: 'white',
		paddingLeft: 8,
		paddingRight: 16,
		maxWidth: '80%',
	},
	cardExpiryInput: {
		height: 40,
		fontSize: 16,
		color: 'white',
		paddingLeft: 8,
	},

	flipButton: {
		position: 'absolute',
		top: 5,
		left: 5,
		padding: 10,
	},
	flipButtonImage: {
		height: 20,
		width: 20,
	},

	chip: {
		position: 'absolute',
		top: '35%',
		left: '5%',
		width: 100,
		height: 45,
	},
});
