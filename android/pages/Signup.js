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
import {
    height,
    width
} from 'react-native-dimensions';
import * as firebase from 'firebase';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';



export default class Signup extends Component<{}> {
    constructor() {
        super()
        this.state = {
            fullname : "",
            email : "",
            password : "",
            repassword : ""
        }
    }
    async signup(email,password) {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email,password);
            var userId = firebase.auth().currentUser.uid;
            this.writeToDatabase(userId);
            alert("Signup Success!");
            Actions.pop();
        } catch (error) {
            alert(error.toString());
        }
    }
    Months(number) {
        var months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return months[number];
    }
    writeToDatabase = (userId) => {
        let today = new Date();
        let Dates = today.getDate() + " " + this.Months(today.getMonth()) + " " + today.getFullYear();
        let Time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let sortTime = -1*today.getTime();
        var database = firebase.database().ref("Users").child(userId);
        database.set({
            sortTime : sortTime,
            DateCreated : Dates,
            TimeCreated : Time,
            userId : userId,
            email : this.state.email,
            fullname : this.state.fullname,
            
        });
        var setBalance = firebase.database().ref('Users/'+userId).child('Balance');
        setBalance.set({
            value : 0
        });
    }
    goBack() {
        Actions.pop();
    }
    passwordCheck(pass,repass) {
        if(pass != repass){
            alert("invalid password!");
        }
    }
    render() {
        return(
            <Image source={require('../../images/bg1.jpg')} style={styles.container}>
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    autoCapitalize = "words"
                    onChangeText={(value) => this.setState({fullname : value})}
                />
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={(value) => this.setState({email : value})}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={(value) => this.setState({password : value})}
                />
                <TextInput
                    placeholder="Re-type Password"
                    secureTextEntry={true}
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={(value) => this.setState({repassword : value})}
                    onEndEditing={() => this.passwordCheck(this.state.password,this.state.repassword)}
                />
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.signup(this.state.email,this.state.password)}
                >
                    <Text>Sign Up</Text>
                </TouchableOpacity>
                <Text>
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={this.goBack}>
                    <Text style = {{color : '#00f'}}>Login</Text>
                </TouchableOpacity>
            </Image>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        alignItems : 'center',
        justifyContent : 'center',
        flex : 1,
        height : height,
        width : width,
    },
    button : {
        padding : 10,
        marginVertical : 5,
        borderRadius : 25,
        width : 100,
        backgroundColor : 'rgba(255,255,0,0.5)',
        alignItems : 'center',
    },
    input : {
        width : responsiveWidth(80),
        backgroundColor : '#455a64',
        borderRadius : 10,
        marginVertical : responsiveHeight(1),
        paddingLeft : responsiveWidth(3),
    },
});