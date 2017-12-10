import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';

export default class FormLogin extends Component<{}> {
    constructor() {
        super()
        this.state = {
            email : "",
            password : "",
        }
    }
    render() {
        return(
            <View style={styles.container}>
                <TextInput
                    placeholder="Email"
                    keyboardType="email-address"
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={ (text) => this.setState({email : text})}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                    underlineColorAndroid="rgba(0,0,0,0)"
                    onChangeText={ (text) => this.setState({password : text}) }
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