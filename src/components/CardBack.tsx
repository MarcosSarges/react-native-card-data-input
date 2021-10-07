import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const cardBrandImage = getCardBrandLogo(card?.type);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={flip} style={styles.flipButton}>
        <Text>flip</Text>
      </TouchableOpacity>

      <View style={styles.magnet} />

      <View style={styles.cvv}>
        <Image style={styles.preCvv} source={require('../assets/tape.png')} />

        <TextInput
          placeholder={PLACEHOLDERS.cvv}
          style={styles.cvvInput}
          defaultValue={data.cvv}
          keyboardType="numeric"
          maxLength={3}
          {...placeholderColor}
          onChangeText={(text) =>
            setData({ ...data, cvv: text.replace(/\D/g, '') })
          }
        />
      </View>

      <Image
        height={75}
        resizeMode="center"
        source={{
          uri: cardBrandImage,
        }}
        style={styles.cardBrand}
      />
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
    width: 'auto',
    height: 50,
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
    top: 15,
    left: 15,
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
