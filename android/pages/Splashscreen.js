import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import {
    BallIndicator, 
    DotIndicator, 
    MaterialIndicator,
    PulseIndicator,
    SkypeIndicator,
    UIActivityIndicator,
    WaveIndicator,
    PacmanIndicator
} from 'react-native-indicators';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const firebaseConfig = {
    apiKey: "AIzaSyAyS-6iZ50VeDuC2uqqvNZ3E_w8OaqnFU8",
    authDomain: "mywallet-338.firebaseapp.com",
    databaseURL: "https://mywallet-338.firebaseio.com",
    projectId: "mywallet-338",
    storageBucket: "mywallet-338.appspot.com",
    messagingSenderId: "683956136552"
}
firebase.initializeApp(firebaseConfig);

export default class Splashscreen extends Component<{}> {
    constructor() {
        super();
        this.state = ({
            email : "",
            password : ""
        });
        AsyncStorage.multiGet(["email","password","userId"]).then((data) => {
            let email = data[0][1];
            let password = data[1][1];
            let userId = data[2][1];
            if(email!=null){
                firebase.auth().signInWithEmailAndPassword(email,password).then(() => {
                    Actions.outcome();
                }).catch((Error) => {
                    alert(Error.toString());
                });
            }
            else {
                Actions.login();
            }
        });
    }
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.viewLogo}>
                    <Image style={styles.logo} source={require('../../images/mywalet.png')} />
                </View>
                <View style={styles.indicator}>
                    <PacmanIndicator color='white' size={responsiveHeight(13)} />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container : {
        alignItems : 'center',
        backgroundColor : 'grey',
        height : responsiveHeight(100),
        width : responsiveWidth(100),
    },
    viewLogo : {
        position : 'absolute',
        bottom : responsiveHeight(50),
        width : responsiveWidth(100),
        alignItems : 'center',
    },
    logo : {
        height : responsiveHeight(15),
        width : responsiveWidth(60),
        marginTop : responsiveHeight(10)
    },
    indicator : {
        marginTop : responsiveHeight(40),
    },
});