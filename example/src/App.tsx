import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CardFlip, CardRef } from 'react-native-card-data-input';

export default function App() {
	const ref = React.useRef<CardRef>(null);

	return (
		<View style={styles.container}>
			<CardFlip ref={ref} />

			<TouchableOpacity onPress={() => ref.current?.flip()} style={styles.marginTop}>
				<Text>Flip</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => ref.current?.shake()} style={styles.marginTop}>
				<Text>Shake</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					console.log(ref.current?.getCardData());
				}}
				style={styles.marginTop}
			>
				<Text>Get card data</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	marginTop: {
		marginTop: 20,
	},
});
