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
            timeCreated : '',
            modalVisible : false
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
    Stats() {
        Actions.stats();
    }
    logout() {
        let keys = ["email","password"];
        AsyncStorage.multiRemove(keys,(err) => {});
        firebase.auth().signOut();
        Actions.login();
    }
    setModalVisible(visible) {
        this.clearModal;
        this.setState({modalVisible : visible});
    }
    render() {
        return(
            <View style = {styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}
                >
                    <View
                        style = {{
                            alignItems : 'center',
                            backgroundColor : '#fff',
                            borderWidth : 3,
                            borderRadius : 10,
                            marginTop : responsiveHeight(33),
                            width : responsiveWidth(80),
                            marginHorizontal : responsiveWidth(10)
                        }}
                    >
                        <View
                            style={styles.modal}
                        >
                            <TextInput
                                value = {this.state.fullname}
                                placeholder = "Your FullName..."
                                onChangeText = {(value) => this.setState({fullname : value})}
                                style={styles.modalInput}
                                underlineColorAndroid = "transparent"
                                autoCapitalize = "words"
                            />
                            <View
                                style = {{
                                    flexDirection : 'row',
                                    marginTop : responsiveHeight(3)
                                }}
                            >
                                <TouchableHighlight
                                    onPress={() => {
                                        if (this.state.fullname != "") {
                                            this.getRef().update({fullname : this.state.fullname})
                                            this.setModalVisible(!this.state.modalVisible)
                                        } else {
                                            alert("Error : Incomplete text field.\nPlease fill all the textfield before enter.")
                                        }
                                    }}
                                    style = {styles.modalButton1}
                                >
                                    <Text style={styles.modButtonText}>Save</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible)
                                    }}
                                    style = {styles.modalButton2}
                                >
                                    <Text style={styles.modButtonText}>Cancel</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

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
                        onPress = {this.Stats}
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
                    style = {styles.editBtn}
                    onPress = {() => {
                        this.setModalVisible(true)
                    }}
                >
                    <Text style = {{fontSize : responsiveFontSize(2.5)}}>Edit</Text>
                </TouchableHighlight>
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
        height : responsiveHeight(60),
    },
    infoText : {
        marginVertical : responsiveHeight(1.5),
        fontSize : responsiveFontSize(2),
        color : '#000',
    },
    editBtn : {
        alignItems : 'center',
        width : responsiveWidth(30),
        height : responsiveHeight(8),
        borderRadius : responsiveHeight(4),
        backgroundColor : '#ff0',
        justifyContent : 'center',
        marginVertical : responsiveHeight(3),
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
    modalButton1 : {
        width : responsiveWidth(20),
        height : responsiveHeight(10),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'green',
        marginRight : responsiveWidth(3),
    },
    modalButton2 : {
        width : responsiveWidth(20),
        height : responsiveHeight(10),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'red',
    },
    modalInput : {
        width : responsiveWidth(50),
        fontSize : responsiveFontSize(2),
        backgroundColor : '#f0f',
        borderRadius : 5,
        marginVertical : 3,
    },
    modal : {
        height : responsiveHeight(30),
        width : responsiveWidth(60),
        justifyContent : 'center',
        alignItems : 'center',
    },
});