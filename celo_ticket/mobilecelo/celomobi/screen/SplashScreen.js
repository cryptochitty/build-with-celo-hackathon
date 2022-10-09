import React, {useEffect, useState} from 'react';
import {View, Image, Text, StyleSheet, Alert} from 'react-native';
import {IMAGES} from '../assests';

import {Constants} from '../constants/constants';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={IMAGES.Celo} style={styles.image} />
      </View>
      <View style={styles.textPlace}>
        <Text style={styles.version}>Version </Text>
        <Text style={styles.versionValue}>0.1</Text>
      </View>
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.BRIGHT_COLOR,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
  },
  imgContainer: {
    width: '50%',
  },
  textPlace: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {fontSize: 20, fontWeight: 'bold'},
  versionValue: {textAlign: 'auto', fontWeight: 'bold'},
});
