import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import cardValidator from 'card-validator';

import { getCardBrandLogo } from '../helpers/logo';
import { useCardContext } from '../context/CardContext';
import { placeholderColor } from '../helpers/placeholders';
import { MaskedTextInput } from 'react-native-mask-text';
import { cardNumberFormatter } from '../helpers/formatters';
import { usePreviousValue } from '../helpers/hooks';
import type { CardSideRef } from '../types';

type Props = {
	isFocused: boolean;
};

export const CardFront = React.forwardRef<CardSideRef, Props>(({ isFocused }, ref) => {
	const { data, isValid, setData, flip, readOnly, height, placeholders } = useCardContext();

	const cardNumberInputRef = React.useRef<TextInput>(null);
	const holderInputRef = React.useRef<TextInput>(null);
	const expiryInputRef = React.useRef<TextInput>(null);

	const previousIsFocused = usePreviousValue(isFocused);

	React.useImperativeHandle(ref, () => ({
		blurFields: () => {
			cardNumberInputRef.current?.blur();
			holderInputRef.current?.blur();
			expiryInputRef.current?.blur();
		},
	}));

	React.useEffect(() => {
		setTimeout(() => {
			if (!previousIsFocused && isFocused && !isValid.isValid) {
				// card data is invalid, so keep giving focus to some field
				if (!readOnly.number) {
					cardNumberInputRef.current?.focus();
				} else if (!readOnly.holder) {
					holderInputRef.current?.focus();
				} else if (!readOnly.expiry) {
					expiryInputRef.current?.focus();
				}
			}
		}, 200);
	}, [isFocused, isValid, previousIsFocused, readOnly.expiry, readOnly.holder, readOnly.number]);

	const cardBrandImage = React.useMemo(() => {
		const { card } = cardValidator.number(data.number);
		return getCardBrandLogo(card?.type);
	}, [data.number]);

	return (
		<View style={styles.container}>
			<View style={[styles.content]}>
				<TextInput
					ref={cardNumberInputRef}
					value={data.number}
					style={[
						styles.cardNumberInput,
						{
							fontSize: height / 11,
							height: height / 6,
						},
					]}
					keyboardType="numeric"
					maxLength={19}
					placeholder={placeholders.number.toUpperCase()}
					{...placeholderColor}
					autoCompleteType="cc-number"
					textContentType="creditCardNumber"
					onChangeText={(text) => setData({ ...data, number: cardNumberFormatter(data.number, text) })}
					returnKeyType="next"
					blurOnSubmit={false}
					editable={!readOnly.number}
					onSubmitEditing={() => holderInputRef.current?.focus()}
				/>

				<View style={styles.line2}>
					<TextInput
						ref={holderInputRef}
						value={data.holder.toUpperCase()}
						style={[
							styles.cardHolderInput,
							{
								fontSize: height / 15,
								height: height / 7,
							},
						]}
						placeholder={placeholders.holder.toUpperCase()}
						autoCapitalize="characters"
						{...placeholderColor}
						textContentType="name"
						autoCompleteType="name"
						onChangeText={(text) => setData({ ...data, holder: text })}
						returnKeyType="next"
						blurOnSubmit={false}
						editable={!readOnly.holder}
						onSubmitEditing={() => expiryInputRef.current?.focus()}
					/>

					<MaskedTextInput
						ref={expiryInputRef}
						mask="99/99"
						value={data.expiry}
						style={[
							styles.cardExpiryInput,
							{
								fontSize: height / 15,
								height: height / 7,
							},
						]}
						placeholder={placeholders.expiry.toUpperCase()}
						keyboardType="numeric"
						maxLength={5}
						{...placeholderColor}
						autoCompleteType="cc-exp"
						onChangeText={(text) => setData({ ...data, expiry: text })}
						returnKeyType="next"
						blurOnSubmit={false}
						editable={!readOnly.expiry}
						textAlign="right"
						onSubmitEditing={() => flip()}
					/>
				</View>
			</View>

			<TouchableOpacity
				onPress={() => flip()}
				style={[
					styles.flipButton,
					{
						height: height / 7,
						width: height / 7,
						padding: height / 32,
						top: height / 30,
					},
				]}
			>
				<Image resizeMode="contain" source={require('../assets/rotate.png')} style={styles.flipButtonImage} />
			</TouchableOpacity>

			<Image
				resizeMode="contain"
				style={[styles.chip, { height: height / 6.5, width: height / 2.25 }]}
				source={require('../assets/chip.png')}
			/>

			<View style={[styles.cardBrand, { height: height / 3.8, width: height / 2.8 }]}>
				<Image resizeMode="contain" style={styles.cardBrandImage} source={cardBrandImage} />
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
		// height: 40,
		fontSize: 22,
		letterSpacing: 2,
		color: 'white',
		fontWeight: 'bold',
		paddingHorizontal: 6,
	},
	cardHolderInput: {
		// height: 40,
		fontSize: 16,
		color: 'white',
		paddingHorizontal: 8,
		flex: 1,
		textTransform: 'uppercase',
	},
	cardExpiryInput: {
		// height: 40,
		fontSize: 16,
		color: 'white',
		paddingLeft: 8,
		paddingRight: 4,
	},

	flipButton: {
		position: 'absolute',
		top: 10,
		left: 10,
		padding: 10,
		height: 40,
		width: 40,
	},
	flipButtonImage: {
		flex: 1,
		width: undefined,
		height: undefined,
	},

	chip: {
		position: 'absolute',
		top: '34%',
		left: 3,
		height: 45,
	},
});
