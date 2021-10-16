import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardFlip, CardRef } from 'react-native-card-data-input';

export default function App() {
	const ref = React.useRef<CardRef>(null);

	return (
		<View style={styles.container}>
			<CardFlip
				ref={ref}
				background={<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} />}
				labels={{
					securityCode: 'Código de segurança',
				}}
				placeholders={{
					holder: 'Nome no cartão',
				}}
				onValidStateChanged={(value) => Alert.alert(JSON.stringify(value))}
				data={{
					number: '5555555555555555',
					holder: 'erick',
					expiry: '02/29',
					cvv: '123',
				}}
			/>

			<TouchableOpacity onPress={() => ref.current?.flip()} style={styles.marginTop}>
				<Text>Flip</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => ref.current?.shake()} style={styles.marginTop}>
				<Text>Shake</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => Alert.alert('Card data', JSON.stringify(ref.current?.getCardData()))}
				style={styles.marginTop}
			>
				<Text>Get card data</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => ref.current?.clear()} style={styles.marginTop}>
				<Text>Clear</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// marginHorizontal: 50,
	},
	marginTop: {
		marginTop: 20,
	},
});
