import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import Radio from './Radio';

export default class FormSignup extends Component<{}> {
    constructor() {
        super()
        this.state = {
            fullname : "",
            email : "",
            password : "",
            repassword : ""
        }
    }

    passwordCheck(pass,repass) {
        if(pass != repass){
            alert("invalid password!");
        }
    }
    render() {
        return(
            <View style={styles.container}>
                <Radio />
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
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
            </View>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        alignItems : 'center',
        justifyContent : 'center',
        marginVertical : 10,
    },
    input : {
        backgroundColor : '#455a64',
        marginVertical : 5,
        width : 300,
        borderRadius : 10,
        paddingHorizontal : 18,
    },
});