
import React, { Component } from 'react';

import {
  View
} from 'react-native';


//import ScanScreen from './src/components/screen-scan';
import StartScreen from './ui/screen-start';

export default class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }} >
        <StartScreen />
      </View>
    );
  }
}
