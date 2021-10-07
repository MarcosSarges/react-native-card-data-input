import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from 'react-native';
import { CardFront } from './CardFront';
import { FlipContext } from '../context/FlipContext';
import { CardBack } from './CardBack';
import { CardDataContext } from '../context/DataContext';
import type { CardData } from '../types';

export const CardFlip: React.FC = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [animationValue, setAnimationValue] = React.useState(0);

  const [cardData, setCardData] = React.useState<CardData>({
    cvv: '',
    expiry: '',
    number: '',
    owner: '',
  });

  // const isShowingFront = React.useMemo(
  //   () => animationValue <= 180,
  //   [animationValue]
  // );

  useEffect(() => {
    animatedValue.addListener(({ value }) => {
      setAnimationValue(value);
    });

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [animatedValue]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const flip = () => {
    if (animationValue >= 90) {
      Animated.spring(animatedValue, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <FlipContext.Provider
      value={{
        flip,
      }}
    >
      <CardDataContext.Provider
        value={{
          data: cardData,
          setData: setCardData,
        }}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
              <CardFront />
            </Animated.View>

            <Animated.View
              style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle]}
            >
              <CardBack />
            </Animated.View>
          </View>
        </View>

        <TouchableOpacity
          onPress={flip}
          // style={{
          //   marginTop: 30,
          //   padding: 10,
          // }}
        >
          <Text
          // style={{ fontSize: 16 }}
          >
            Flip!
          </Text>
        </TouchableOpacity>
      </CardDataContext.Provider>
    </FlipContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  content: {
    height: 250,
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    position: 'relative',
  },

  flipCard: {
    flex: 1,
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'gray',

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  flipCardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
