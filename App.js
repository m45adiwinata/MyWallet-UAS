import { View, Text, TouchableHighlight, TouchableOpacity, AppRegistry } from 'react-native';
import React, { Component } from 'react';
import {
    Router,
    Stack,
    Actions
} from 'react-native-router-flux';
import Routes from './Routes';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAyS-6iZ50VeDuC2uqqvNZ3E_w8OaqnFU8",
    authDomain: "mywallet-338.firebaseapp.com",
    databaseURL: "https://mywallet-338.firebaseio.com",
    projectId: "mywallet-338",
    storageBucket: "mywallet-338.appspot.com",
    messagingSenderId: "683956136552"
}


export default class App extends Component<{}> {
   render() {
        return(
             <Routes />
        );
    }
}
AppRegistry.registerComponent('App', () => outcomePage);