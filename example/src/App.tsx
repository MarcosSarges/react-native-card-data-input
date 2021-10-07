import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CardFlip } from 'react-native-card-data-input';

export default function App() {
  return (
    <View style={styles.container}>
      <CardFlip />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
