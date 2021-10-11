import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import cardValidator from 'card-validator';

import { useFlip } from '../context/FlipContext';
import { getCardBrandLogo } from '../utils/logo';
import { useCardData } from '../context/DataContext';
import { placeholderColor, PLACEHOLDERS } from '../utils/placeholders';

export const CardBack: React.FC = () => {
	const { flip } = useFlip();
	const { data, setData } = useCardData();
	// const { isValid } = cardValidator.cvv(data.cvv);

	const { card } = cardValidator.number(data.number);

	const cardBrandImage = React.useMemo(() => getCardBrandLogo(card?.type), [card?.type]);

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={flip} style={styles.flipButton}>
				<Image resizeMode="contain" source={require('../assets/rotate.png')} style={styles.flipButtonImage} />
			</TouchableOpacity>

			<View style={styles.magnet} />

			<View style={styles.cvv}>
				<Image style={styles.preCvv} source={require('../assets/tape.png')} />

				<TextInput
					placeholder={PLACEHOLDERS.cvv}
					style={styles.cvvInput}
					value={data.cvv}
					keyboardType="numeric"
					editable={!!card}
					maxLength={card?.code.size}
					{...placeholderColor}
					onChangeText={(text) => setData({ ...data, cvv: text.replace(/\D/g, '') })}
				/>
			</View>

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
		top: 50,
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
	preCvv: {
		width: '70%',
		height: 35,
	},
	cvv: {
		position: 'absolute',
		top: '45%',
		left: '5%',
		right: 0,
		flexDirection: 'row',
	},
	cvvInput: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		fontSize: 16,
		color: 'white',
		marginLeft: 10,
	},
});
