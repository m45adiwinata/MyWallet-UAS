import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    ListView,
    AppRegistry,
    Dimensions,
    Modal,
    TextInput,
    Image,
    AsyncStorage
} from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

export default class profile extends Component<{}> {
    constructor() {
        var userId = firebase.auth().currentUser.uid;
        super();
        this.state = {
            fullname : '',
            email : '',
            userId : userId,
            timeCreated : ''
        }
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userId);
    }
    componentWillMount() {
        this.getRef().on('value', (snap) => {
            this.setState({
                fullname : snap.val().fullname,
                email : snap.val().email,
                timeCreated : snap.val().createdAt,
                userId : snap.val().userId
            });
        });
    }
    componentDidMount() {
        this.getRef().on('value', (snap) => {
            this.setState({
                fullname : snap.val().fullname,
                email : snap.val().email,
                timeCreated : snap.val().createdAt,
                userId : snap.val().userId
            });
        });
    }
    Outcome() {
        Actions.outcome();
    }
    Income() {
        Actions.income();
    }
    Chart() {
        Actions.chart();
    }
    logout() {
        let keys = ["email","password"];
        AsyncStorage.multiRemove(keys,(err) => {});
        firebase.auth().signOut();
        Actions.login();
    }
    render() {
        return(
            <View style = {styles.container}>
                <View
                    style = {{flexDirection : 'row'}}
                >
                    <TouchableOpacity
                        style = {styles.headerTab}
                        onPress = {this.Outcome}
                    >
                        <Image source={require('../../images/outcome.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.headerTab}
                        onPress = {this.Income}
                    >
                        <Image source={require('../../images/income.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.selectedHeaderTab}
                    >
                        <Image source={require('../../images/profile.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.headerTab}
                        onPress = {Actions.stats()}
                    >
                        <Image source={require('../../images/chart.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                </View>
                <View style = {styles.info}>
                    <Text style = {styles.infoText}>
                        Fullname : {this.state.fullname}
                    </Text>
                    <Text style = {styles.infoText}>
                        Email : {this.state.email}
                    </Text>
                    <Text style = {styles.infoText}>
                        Time Created : {this.state.timeCreated}
                    </Text>
                    <Text style = {styles.infoText}>
                        UserID : {this.state.userId}
                    </Text>
                </View>
                <TouchableHighlight
                    style = {styles.logoutBtn}
                    onPress = {() => {
                        this.logout()
                    }}
                >
                    <Text style = {{fontSize : responsiveFontSize(2.5)}}>Logout</Text>
                </TouchableHighlight>
            </View>
        );
    }
}
const styles = StyleSheet.create ({
    container : {
        alignItems : 'center',
        width : responsiveWidth(100),
        height : responsiveHeight(100),
    },
    header : {
        fontSize : responsiveFontSize(2),
        marginVertical : responsiveHeight(3),
    },
    selectedHeaderTab : {
        height : responsiveHeight(10),
        width : responsiveWidth(25),
        alignItems : 'center',
        backgroundColor : '#2a6aff',
        justifyContent : 'center',
    },
    headerTab : {
        height : responsiveHeight(10),
        width : responsiveWidth(25),
        alignItems : 'center',
        backgroundColor : '#fff',
        justifyContent : 'center',
    },
    info : {
        marginTop : responsiveHeight(2),
        width : responsiveWidth(80),
        height : responsiveHeight(65),
    },
    infoText : {
        marginVertical : responsiveHeight(1.5),
        fontSize : responsiveFontSize(2),
        color : '#000',
    },
    logoutBtn : {
        alignItems : 'center',
        width : responsiveWidth(30),
        height : responsiveHeight(8),
        borderRadius : responsiveHeight(4),
        backgroundColor : '#0f0',
        justifyContent : 'center',
    },
    tabIcons : {
        width : responsiveWidth(13),
        height : responsiveHeight(8),
    },
});