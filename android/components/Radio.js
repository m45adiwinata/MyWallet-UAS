import React, { Component,  } from 'react';
import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';

var radio_props = [
    {label : 'Personal', value : 1},
    {label : 'Company', value : 0}
];

export default class Radio extends Component<{}>{
    constructor() {
        super();
        this.state = {
            userID : ""
        }
    }
    getID() {
        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;
        
        if (user != null) {
          name = user.displayName;
          email = user.email;
          photoUrl = user.photoURL;
          emailVerified = user.emailVerified;
          uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                           // this value to authenticate with your backend server, if
                           // you have one. Use User.getToken() instead.
        }
        alert("userID = "+uid);
    }
    render() {
        return(
            <View>
                <TouchableOpacity
                    style = {{width:300,alignItems:'center',backgroundColor:'green',height:30}}
                    onPress = {this.getID}
                >
                    <Text>click test</Text>
                </TouchableOpacity>
            </View>
        );
    }
}