import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import cardValidator from 'card-validator';

import { getCardBrandLogo } from '../helpers/logo';
import { useCardContext } from '../context/CardContext';
import { placeholderColor, PLACEHOLDERS } from '../helpers/placeholders';
import { usePreviousValue } from '../helpers/hooks';
import { LabeledInput } from './LabeledInput';
import type { CardSideRef } from '../types';

type Props = {
	isFocused: boolean;
};

export const CardBack = React.forwardRef<CardSideRef, Props>(({ isFocused }, ref) => {
	const { data, setData, flip, readOnly, height, labels, placeholders } = useCardContext();
	const cvvInputRef = React.useRef<TextInput>(null);
	const previousIsFocused = usePreviousValue(isFocused);

	React.useEffect(() => {
		setTimeout(() => {
			if (!previousIsFocused && isFocused) cvvInputRef.current?.focus();
		}, 200);
	}, [isFocused, previousIsFocused]);

	const { card } = cardValidator.number(data.number);
	const cardBrandImage = React.useMemo(() => getCardBrandLogo(card?.type), [card?.type]);

	React.useImperativeHandle(ref, () => ({
		blurFields: () => {
			cvvInputRef.current?.blur();
		},
	}));

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={flip}
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

			<View style={[styles.magnet, { height: height / 5, top: height / 4.75 }]} />

			<View
				style={[
					styles.cvv,
					{
						bottom: height / 15,
					},
				]}
			>
				<LabeledInput label={labels.securityCode} style={{ fontSize: height / 17 }}>
					<TextInput
						ref={cvvInputRef}
						placeholder={(card?.code.size === 4
							? placeholders.cvv(card?.code.size)
							: PLACEHOLDERS.cvv(card?.code.size ?? 3)
						).toUpperCase()}
						style={[
							styles.cvvInput,
							{
								fontSize: height / 15,
							},
						]}
						value={data.cvv.replace(/\D/g, '')}
						keyboardType="numeric"
						editable={!!card && !readOnly.cvv}
						maxLength={card?.code.size ?? 3}
						{...placeholderColor}
						autoCompleteType="cc-csc"
						onChangeText={(text) => setData({ ...data, cvv: text.replace(/\D/g, '') })}
						onSubmitEditing={() => flip()}
					/>
				</LabeledInput>
			</View>

			<View style={[styles.cardBrand, { height: height / 4.5, width: height / 3 }]}>
				<Image resizeMode="contain" style={styles.cardBrandImage} source={cardBrandImage} />
			</View>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
	},
	cardBrand: {
		position: 'absolute',
		bottom: 15,
		right: 15,
		height: 48,
		width: 80,
		overflow: 'hidden',
	},
	cardBrandImage: {
		flex: 1,
		width: undefined,
		height: undefined,
	},
	magnet: {
		width: '100%',
		height: 50,
		backgroundColor: 'black',
		position: 'absolute',
		top: 60,
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
	cvv: {
		position: 'absolute',
		bottom: 15,
		left: 20,
		flexDirection: 'column',
	},
	cvvInputLabel: {
		textTransform: 'uppercase',
		color: 'white',
		fontWeight: 'bold',
	},
	cvvInput: {
		fontSize: 16,
		color: 'white',
	},
});
