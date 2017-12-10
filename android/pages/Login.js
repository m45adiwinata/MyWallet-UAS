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
import {
    width,
    height
} from 'react-native-dimensions';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

export default class Login extends Component<{}> {
    constructor() {
        super()
        this.state = {
            email : "",
            password : "",
        }
    }
    async login(e,p) {
        try {
            await firebase.auth().signInWithEmailAndPassword(e,p);
            var userId = firebase.auth().currentUser.uid;
            var database = firebase.database().ref("Users").child(userId);
            database.once('value',(snapshot) => {
                AsyncStorage.multiSet([
                    ["email", this.state.email],
                    ["password", this.state.password],
                    ["userId", userId]
                ]);
            });
            Actions.income();
        } catch (error) {
            alert("Invalid username and password.");
        }
    }
    SignUp() {
        Actions.signup()
    }
    getBackgroundImage() {
        return firebase.storage().ref().child('overcome.jpg').getDownloadURL();
    }
    render() {
        return(
            <Image source={require('../../images/bg1.jpg')} style={styles.container}>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={ (email) => this.setState({email})}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={ (password) => this.setState({password}) }
                    onSubmitEditing={() => this.login(this.state.email,this.state.password)}
                />
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => this.login(this.state.email,this.state.password)}
                >
                    <Text>Login</Text>
                </TouchableOpacity>
                <Text>Dont have an account?</Text>
                <TouchableOpacity onPress={this.SignUp}>
                    <Text style={{color:'blue'}}>SignUp</Text>
                </TouchableOpacity>
                
            </Image>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        alignItems : 'center',
        justifyContent : 'center',
        height : height,
        width : width,
        flex : 1,
    },
    button : {
        padding : 10,
        borderRadius : 25,
        marginVertical : 5,
        backgroundColor : 'rgba(255,0,255,0.5)',
        width : 100,
        alignItems : 'center',
    },
    input : {
        backgroundColor : '#455a64',
        marginVertical : 5,
        width : 300,
        borderRadius : 10,
        paddingHorizontal : 18,
    },
})