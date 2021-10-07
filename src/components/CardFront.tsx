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
import {
  cardNumberFormatter,
  expirationDateFormatter,
} from '../utils/formatters';

export const CardFront: React.FC = () => {
  const { flip } = useFlip();
  const { data, setData } = useCardData();

  const { card } = cardValidator.number(data.number);
  const cardBrandImage = getCardBrandLogo(card?.type);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          value={data.number}
          style={styles.cardNumberInput}
          keyboardType="numeric"
          placeholder={PLACEHOLDERS.number}
          {...placeholderColor}
          onChangeText={(text) =>
            setData({ ...data, number: cardNumberFormatter(data.number, text) })
          }
        />

        <View style={styles.line2}>
          <TextInput
            value={data.owner}
            style={styles.cardOwnerInput}
            placeholder={PLACEHOLDERS.owner}
            {...placeholderColor}
          />

          <TextInput
            value={data.expiry}
            style={styles.cardExpiryInput}
            placeholder={PLACEHOLDERS.expiry}
            keyboardType="numeric"
            {...placeholderColor}
            onChangeText={(text) =>
              setData({
                ...data,
                expiry: expirationDateFormatter(data.number, text),
              })
            }
          />
        </View>
      </View>

      <TouchableOpacity onPress={flip} style={styles.flipButton}>
        <Text>flip</Text>
      </TouchableOpacity>

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
    zIndex: 99,
    // backgroundColor: 'blue',
  },
  content: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 25,
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
    width: 'auto',
    height: 50,
  },
  cardNumberInput: {
    fontSize: 24,
    letterSpacing: 2,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardOwnerInput: { fontSize: 16, color: 'white' },
  cardExpiryInput: { fontSize: 16, color: 'white' },

  flipButton: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
});
