import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, Animated, ViewProps, ViewStyle } from 'react-native';
import cardValidator from 'card-validator';

import { CardFront } from './CardFront';
import { CardBack } from './CardBack';
import { CardContext } from '../context/CardContext';
import { ErrorsEnum } from '../helpers/enums';
import { cardNumberFormatter } from '../helpers/formatters';
import { LABELS, PLACEHOLDERS } from '../helpers/placeholders';
import type {
	CardData,
	CardRef,
	CardProps,
	CardError,
	ClearFields,
	Labels,
	Placeholders,
	ReadOnlyFields,
} from '../types';

const CARD_DEFAULT_BACKGROUND = '#5a5a5a';

export const CardFlip = React.forwardRef<CardRef, CardProps>((props, ref) => {
	const { data, background, onValidStateChanged = () => {} } = props;

	const readOnly: Required<ReadOnlyFields> = React.useMemo(() => {
		const ensureReadOnlyValue = (key: keyof CardData) =>
			typeof props.readOnly === 'boolean' ? props.readOnly : props.readOnly?.[key] ?? false;

		return {
			number: ensureReadOnlyValue('number'),
			holder: ensureReadOnlyValue('holder'),
			expiry: ensureReadOnlyValue('expiry'),
			cvv: ensureReadOnlyValue('cvv'),
		};
	}, [props.readOnly]);

	const labels: Required<Labels> = React.useMemo(
		() => ({
			securityCode: props.labels?.securityCode ?? LABELS.securityCode,
		}),
		[props.labels]
	);

	const placeholders: Required<Placeholders> = React.useMemo(
		() => ({
			number: props.placeholders?.number ?? PLACEHOLDERS.number,
			holder: props.placeholders?.holder ?? PLACEHOLDERS.holder,
			expiry: props.placeholders?.expiry ?? PLACEHOLDERS.expiry,
			cvv: props.placeholders?.cvv ?? PLACEHOLDERS.cvv,
		}),
		[props.placeholders]
	);

	const [containerWidth, setContainerWidth] = React.useState(0);

	const [animationValue, setAnimationValue] = React.useState(0);
	const isShowingFront = React.useMemo(() => animationValue <= 90, [animationValue]);

	const flipAnimatedValue = React.useRef(new Animated.Value(0)).current;
	const shakeAnimatedValue = React.useRef(new Animated.Value(0)).current;

	const [cardData, setCardData] = React.useState<CardData>({
		cvv: data?.cvv ?? '',
		expiry: data?.expiry ?? '',
		number: cardNumberFormatter('', data?.number ?? ''),
		holder: data?.holder ?? '',
	});

	React.useEffect(() => {
		setCardData({
			cvv: data?.cvv ?? '',
			expiry: data?.expiry ?? '',
			number: cardNumberFormatter('', data?.number ?? ''),
			holder: data?.holder ?? '',
		});
	}, [data]);

	const isValidCardData = React.useMemo(() => {
		const { isValid: isValidCardNumber } = cardValidator.number(cardData.number);
		const { isValid: isValidSecurityCode } = cardValidator.cvv(cardData.cvv);
		const { isValid: isValidOwnerName } = cardValidator.cardholderName(cardData.holder);
		const { isValid: isValidExpiryDate } = cardValidator.expirationDate(cardData.expiry);
		const isValid = isValidCardNumber && isValidSecurityCode && isValidOwnerName && isValidExpiryDate;

		return {
			isValid,
			isValidCardNumber,
			isValidSecurityCode,
			isValidOwnerName,
			isValidExpiryDate,
		};
	}, [cardData.cvv, cardData.expiry, cardData.number, cardData.holder]);

	React.useEffect(() => {
		onValidStateChanged(isValidCardData.isValid);
	}, [isValidCardData.isValid, onValidStateChanged]);

	React.useEffect(() => {
		flipAnimatedValue.addListener(({ value }) => {
			setAnimationValue(value);
		});

		return () => {
			flipAnimatedValue.removeAllListeners();
		};
	}, [flipAnimatedValue]);

	const shakeStyle = React.useMemo(
		() => ({
			translateX: shakeAnimatedValue.interpolate({
				inputRange: [-1, -0.5, 0, 0.5, 1],
				outputRange: [-10, -5, 0, 5, 10],
			}),
		}),
		[shakeAnimatedValue]
	);

	const displayBack: ViewStyle = { display: isShowingFront ? 'none' : 'flex' };

	const frontAnimatedStyle = React.useMemo(
		() => ({
			rotateY: flipAnimatedValue.interpolate({
				inputRange: [0, 180],
				outputRange: ['0deg', '180deg'],
			}),
		}),
		[flipAnimatedValue]
	);

	const backAnimatedStyle = React.useMemo(
		() => ({
			rotateY: flipAnimatedValue.interpolate({
				inputRange: [0, 180],
				outputRange: ['180deg', '360deg'],
			}),
		}),
		[flipAnimatedValue]
	);

	const shake = React.useCallback(() => {
		shakeAnimatedValue.setValue(0);

		Animated.sequence([
			Animated.timing(shakeAnimatedValue, { toValue: 1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: -1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: 1, duration: 50, useNativeDriver: true }),
			Animated.timing(shakeAnimatedValue, { toValue: 0, duration: 50, useNativeDriver: true }),
		]).start();
	}, [shakeAnimatedValue]);

	const flip = React.useCallback(() => {
		if (!isShowingFront) {
			Animated.spring(flipAnimatedValue, {
				toValue: 0,
				friction: 8,
				tension: 10,
				useNativeDriver: true,
			}).start();
		} else {
			Animated.spring(flipAnimatedValue, {
				toValue: 180,
				friction: 8,
				tension: 10,
				useNativeDriver: true,
			}).start();
		}
	}, [flipAnimatedValue, isShowingFront]);

	const clear: CardRef['clear'] = React.useCallback(
		(fields) => {
			const ensureFieldsToClearValue = (key: keyof CardData) =>
				!readOnly[key] && (typeof fields === 'undefined' ? true : fields?.[key] ?? false);

			const fieldsToClear: Required<ClearFields> = {
				number: ensureFieldsToClearValue('number'),
				holder: ensureFieldsToClearValue('holder'),
				expiry: ensureFieldsToClearValue('expiry'),
				cvv: ensureFieldsToClearValue('cvv'),
			};

			for (const [fieldName, shouldClear] of Object.entries(fieldsToClear)) {
				// @ts-expect-error
				if (shouldClear && !readOnly[fieldName]) setCardData((oldCardData) => ({ ...oldCardData, [fieldName]: '' }));
			}
		},
		[readOnly]
	);

	const getCardData = React.useCallback(() => {
		const errors: CardError[] = [];

		const { isValidCardNumber, isValidExpiryDate, isValidOwnerName, isValidSecurityCode, isValid } = isValidCardData;

		if (!isValidCardNumber) errors.push(ErrorsEnum.NOT_VALID_CARD_NUMBER);
		if (!isValidExpiryDate) errors.push(ErrorsEnum.NOT_VALID_EXPIRATION_DATE);
		if (!isValidOwnerName) errors.push(ErrorsEnum.NOT_VALID_OWNER_NAME);
		if (!isValidSecurityCode) errors.push(ErrorsEnum.NOT_VALID_SECURITY_CODE);

		return { data: isValid ? cardData : null, errors };
	}, [cardData, isValidCardData]);

	React.useImperativeHandle(ref, () => ({
		flip,
		getCardData,
		shake,
		clear,
	}));

	const onLayout = React.useCallback((event) => {
		const { width } = event.nativeEvent.layout;
		setContainerWidth(width);
	}, []);

	const containerHeight = React.useMemo(() => (containerWidth * 25) / 38, [containerWidth]);

	const SideBackground = React.useCallback(
		({ children: child }: PropsWithChildren<ViewProps>) => {
			if (typeof background === 'string' || typeof background === 'undefined') {
				return (
					<View style={{ backgroundColor: background || CARD_DEFAULT_BACKGROUND, ...StyleSheet.absoluteFillObject }}>
						{child}
					</View>
				);
			} else {
				return React.cloneElement(background, {
					children: child,
					style: { ...StyleSheet.absoluteFillObject },
				});
			}
		},
		[background]
	);

	return (
		<CardContext.Provider
			value={{
				data: cardData,
				isValid: isValidCardData,
				setData: setCardData,
				flip,
				shake,
				readOnly,
				height: containerHeight,
				labels,
				placeholders,
			}}
		>
			<View style={styles.container}>
				<View style={[styles.content, { height: containerHeight }]} onLayout={onLayout}>
					<Animated.View
						style={[styles.flipCard, styles.flipCardFront, { transform: [frontAnimatedStyle, shakeStyle] }]}
					>
						<SideBackground>
							<CardFront isFocused={isShowingFront} />
						</SideBackground>
					</Animated.View>

					<Animated.View
						style={[
							styles.flipCard,
							styles.flipCardBack,
							displayBack,
							{ transform: [backAnimatedStyle, shakeStyle] },
							{ marginTop: -containerHeight },
						]}
					>
						<SideBackground>
							<CardBack isFocused={!isShowingFront} />
						</SideBackground>
					</Animated.View>
				</View>
			</View>
		</CardContext.Provider>
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
		marginHorizontal: 10,
	},

	flipCard: {
		flex: 1,
		backfaceVisibility: 'hidden',
		borderRadius: 10,
		overflow: 'hidden',
	},

	flipCardFront: {},

	flipCardBack: {
		position: 'relative',
	},
});
