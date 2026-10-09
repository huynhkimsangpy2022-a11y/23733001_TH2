import { AppRegistry } from 'react-native';
import * as RNScreens from 'react-native-screens';
import App from './App';

RNScreens.enableScreens(true);

AppRegistry.registerComponent('TempRN', () => App);
