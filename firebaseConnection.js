import React, { Component } from 'react';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAyS-6iZ50VeDuC2uqqvNZ3E_w8OaqnFU8",
    authDomain: "mywallet-338.firebaseapp.com",
    databaseURL: "https://mywallet-338.firebaseio.com",
    projectId: "mywallet-338",
    storageBucket: "mywallet-338.appspot.com",
    messagingSenderId: "683956136552"
}
const firebaseApp = firebase.initializeApp(firebaseConfig);