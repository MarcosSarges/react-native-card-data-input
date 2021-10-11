import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { CardFront } from './CardFront';
import { FlipContext } from '../context/FlipContext';
import { CardBack } from './CardBack';
import { CardDataContext } from '../context/DataContext';
import type { CardData, CardRef, CardProps, CardError } from '../types';
import cardValidator from 'card-validator';

export const CardFlip = React.forwardRef<CardRef, CardProps>((props, ref) => {
	const [animationValue, setAnimationValue] = React.useState(0);

	const isShowingFront = React.useMemo(() => animationValue <= 90, [animationValue]);

	const flipAnimatedValue = React.useRef(new Animated.Value(0)).current;
	const shakeAnimatedValue = React.useRef(new Animated.Value(0)).current;
	const cardBackWidthAnimatedValue = React.useRef(new Animated.Value(0)).current;

	const [cardData, setCardData] = React.useState<CardData>({
		cvv: props.data?.cvv ?? '',
		expiry: props.data?.expiry ?? '',
		number: props.data?.number ?? '',
		owner: props.data?.owner ?? '',
	});

	const isValidCardData = React.useMemo(() => {
		const { isValid: isValidCardNumber } = cardValidator.number(cardData.number);
		const { isValid: isValidSecurityCode } = cardValidator.cvv(cardData.cvv);
		const { isValid: isValidOwnerName } = cardValidator.cardholderName(cardData.owner);
		const { isValid: isValidExpiryDate } = cardValidator.expirationDate(cardData.expiry);
		const isValid = isValidCardNumber && isValidSecurityCode && isValidOwnerName && isValidExpiryDate;

		return {
			isValid,
			isValidCardNumber,
			isValidSecurityCode,
			isValidOwnerName,
			isValidExpiryDate,
		};
	}, [cardData.cvv, cardData.expiry, cardData.number, cardData.owner]);

	React.useEffect(() => {
		flipAnimatedValue.addListener(({ value }) => {
			setAnimationValue(value);
		});

		return () => {
			flipAnimatedValue.removeAllListeners();
		};
	}, [flipAnimatedValue]);

	const shakeStyle = {
		translateX: shakeAnimatedValue.interpolate({
			inputRange: [-1, -0.5, 0, 0.5, 1],
			outputRange: [-10, -5, 0, 5, 10],
		}),
	};

	const displayBack = { display: isShowingFront ? 'none' : 'flex' };

	const frontAnimatedStyle = {
		rotateY: flipAnimatedValue.interpolate({
			inputRange: [0, 180],
			outputRange: ['0deg', '180deg'],
		}),
	};

	const backAnimatedStyle = {
		rotateY: flipAnimatedValue.interpolate({
			inputRange: [0, 180],
			outputRange: ['180deg', '360deg'],
		}),
	};

	const shake = () => {
		shakeAnimatedValue.setValue(0);

		Animated.sequence([
			Animated.timing(shakeAnimatedValue, { toValue: 1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: -1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: 1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: 0, duration: 50, useNativeDriver: true }),
		]).start();
	};

	const flip = React.useCallback(() => {
		if (!isShowingFront) {
			Animated.parallel([
				Animated.spring(flipAnimatedValue, {
					toValue: 0,
					friction: 8,
					tension: 10,
					useNativeDriver: true,
				}),

				Animated.timing(cardBackWidthAnimatedValue, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			Animated.parallel([
				Animated.spring(flipAnimatedValue, {
					toValue: 180,
					friction: 8,
					tension: 10,
					useNativeDriver: true,
				}),

				Animated.timing(cardBackWidthAnimatedValue, {
					toValue: 100,
					duration: 300,
					useNativeDriver: true,
				}),
			]).start();
		}
	}, [flipAnimatedValue, cardBackWidthAnimatedValue, isShowingFront]);

	const getCardData = React.useCallback(() => {
		const errors: CardError[] = [];

		const { isValidCardNumber, isValidExpiryDate, isValidOwnerName, isValidSecurityCode, isValid } = isValidCardData;

		if (!isValidCardNumber) errors.push('NOT_VALID_CARD_NUMBER');
		if (!isValidExpiryDate) errors.push('NOT_VALID_EXPIRATION_DATE');
		if (!isValidOwnerName) errors.push('NOT_VALID_OWNER_NAME');
		if (!isValidSecurityCode) errors.push('NOT_VALID_SECURITY_CODE');

		const data = isValid ? cardData : null;

		return { data, errors };
	}, [cardData, isValidCardData]);

	React.useImperativeHandle(ref, () => ({
		flip,
		getCardData,
		shake,
	}));

	return (
		<FlipContext.Provider
			value={{
				flip,
				shake,
			}}
		>
			<CardDataContext.Provider
				value={{
					data: cardData,
					isValid: isValidCardData,
					setData: setCardData,
				}}
			>
				<View style={styles.container}>
					<View style={styles.content}>
						<Animated.View
							style={[styles.flipCard, styles.flipCardFront, { transform: [frontAnimatedStyle, shakeStyle] }]}
						>
							<CardFront />
						</Animated.View>

						<Animated.View
							style={[
								styles.flipCard,
								styles.flipCardBack,
								displayBack,
								{ transform: [backAnimatedStyle, shakeStyle] },
							]}
						>
							<CardBack />
						</Animated.View>
					</View>
				</View>
			</CardDataContext.Provider>
		</FlipContext.Provider>
	);
});

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	content: {
		flex: 1,
		maxWidth: 400,
		height: 250,
		marginHorizontal: 10,
	},

	flipCard: {
		flex: 1,
		backfaceVisibility: 'hidden',
		borderRadius: 10,
		backgroundColor: '#9a9a9a',
	},

	flipCardFront: {},

	flipCardBack: {
		position: 'relative',
		marginTop: -250,
	},
});
