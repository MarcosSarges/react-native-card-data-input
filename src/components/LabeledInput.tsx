import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

type Props = {
	label?: string;
	style?: StyleProp<TextStyle>;
};

export const LabeledInput: React.FC<Props> = ({ label, children, style }) => {
	return (
		<View style={styles.container}>
			{label && <Text style={[styles.label, style]}>{label ?? ''}</Text>}
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
	},
	label: {
		textTransform: 'uppercase',
		color: 'white',
		fontWeight: 'bold',
	},
});
