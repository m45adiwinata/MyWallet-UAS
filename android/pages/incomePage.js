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
    Picker
} from 'react-native';
import * as firebase from 'firebase';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import {
    Tabs,
    Tab,
    TabHeading,
    Icon
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';

const firebaseConfig = {
    apiKey: "AIzaSyAyS-6iZ50VeDuC2uqqvNZ3E_w8OaqnFU8",
    authDomain: "mywallet-338.firebaseapp.com",
    databaseURL: "https://mywallet-338.firebaseio.com",
    projectId: "mywallet-338",
    storageBucket: "mywallet-338.appspot.com",
    messagingSenderId: "683956136552"
}


export default class incomePage extends Component<{}> {
    constructor() {
        super();
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
        let ds = new ListView.DataSource({rowHasChanged : (r1,r2) => r1 !== r2});
        this.state = {
            userID : uid,
            itemDataSource : ds,
            modalVisible : false,
            modalVisible2 : false,
            text1 : '',
            text2 : '',
            text2_old : '',
            balance : 0,
            itemKey : '',
            date : this.getTimes(),
            month : this.getMonth().toString(),
            year : this.getYear().toString()
        }
        this.itemsRef = this.getRef().child('Incomes');
        this.renderRow = this.renderRow.bind(this);
        this.pressRow = this.pressRow.bind(this);
    }
    setModalVisible(visible) {
        this.clearModal;
        this.setState({modalVisible : visible});
    }
    setModalVisible2(visible) {
        this.clearModal;
        this.setState({modalVisible2 : visible});
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userID);
    }
    getBalance() {
        this.getRef().on('value',(snap) => {
            let bal = [];
            snap.forEach((child) => {
                bal.push(child.val().value);
            });
            this.setState({balance : bal[0]});
        });
    }
    componentWillMount() {
        this.getBalance();
        this.getItems(this.itemsRef);
    }
    
    componentDidMount() {
        this.getBalance();
        this.getItems(this.itemsRef);
    }
    getItems(itemsRef) {
        itemsRef.on('value',(snap) => {
            let items = [];
            snap.forEach((child) => {
                if(child.val().Month == this.state.month && child.val().Year == this.state.year) {
                    items.push({
                        title : child.val().Name,
                        price : child.val().Amount,
                        _key : child.key
                    });
                }
            });
            this.setState({
                itemDataSource : this.state.itemDataSource.cloneWithRows(items)
            });
        });
    }
    getSum(total,num) {
        return (total+num);
    }
    renderRow(item) {
        return(
            <TouchableHighlight
                onPress = {() => {
                    this.pressRow(item);
                }}
            >
                <View style={styles.li}>
                    <View style={styles.liTextView}>
                        <Text style={styles.liText}>{item.title}</Text>
                    </View>
                    <View style={styles.liTextView}>
                        <Text style={styles.liText}>{item.price}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    pressRow(item) {
        var x;
        this.setState({itemKey : item._key});
        this.itemsRef.child(item._key).on('value', (snap) => {
            this.setState({
                text1 : snap.val().Name,
                text2 : snap.val() && snap.val().Amount.toString(),
                text2_old : snap.val() && snap.val().Amount
            });
        });
        this.setModalVisible2(true);
    }
    addItem() {
        this.setModalVisible(true);
    }
    Outcome() {
        Actions.outcome();
    }
    Profile() {
        Actions.profile();
    }
    Chart() {
        Actions.chart();
    }
    getTimes() {
        let today = new Date();
        var time = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear();
        return time;
    }
    getMonth() {
        let today = new Date();
        var time = (today.getMonth()+1);
        return time;
    }
    getYear() {
        let today = new Date();
        var time = today.getFullYear();
        return time;
    }
    render (){
        return (
            <View style={styles.container}>
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
                        marginTop : responsiveHeight(8),
                        width : responsiveWidth(80),
                        marginHorizontal : responsiveWidth(10)
                    }}
                >
                    <View
                        style={styles.modal}
                    >
                        <TextInput
                            value = {this.state.text1}
                            placeholder = "Income name..."
                            onChangeText = {(value) => this.setState({text1 : value})}
                            style={styles.modalInput}
                            underlineColorAndroid = "transparent"
                            autoCapitalize = "words"
                        />
                        <TextInput
                            value = {this.state.text2}
                            placeholder = "Amount..."
                            onChangeText = {(value) => this.setState({text2 : value})}
                            style={styles.modalInput}
                            underlineColorAndroid = "transparent"
                            keyboardType = "numeric"
                        />
                        <View
                            style = {{
                                flexDirection : 'row',
                                marginTop : responsiveHeight(3)
                            }}
                        >
                            <TouchableHighlight
                                onPress={() => {
                                    if (this.state.text1 != "" && this.state.text2 != "") {
                                        this.itemsRef.push({
                                            Name : this.state.text1, 
                                            Amount : parseInt(this.state.text2),
                                            Time : this.getTimes(),
                                            Month : this.getMonth(),
                                            Year : this.getYear()
                                        })
                                        let x = this.state.balance + parseInt(this.state.text2)
                                        var balanceKey = this.getRef().child('Balance').key;
                                        this.getRef().child('Balance').update({
                                            value : x
                                        });
                                        this.setModalVisible(!this.state.modalVisible)
                                    } else {
                                        alert("Error : Incomplete text field.\nPlease fill all the textfield before enter.")
                                    }
                                    this.setState({text1 : "", text2 : ""})
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



            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible2}
                onRequestClose={() => {}}
            >
                <View
                    style = {{
                        alignItems : 'center',
                        backgroundColor : '#fff',
                        borderWidth : 3,
                        borderRadius : 10,
                        marginTop : responsiveHeight(8),
                        width : responsiveWidth(80),
                        marginHorizontal : responsiveWidth(10)
                    }}
                >
                    <View
                        style={styles.modal}
                    >
                        <TextInput
                            value = {this.state.text1}
                            placeholder = "Income name..."
                            onChangeText = {(value) => this.setState({text1 : value})}
                            style={styles.modalInput}
                            underlineColorAndroid = "transparent"
                            autoCapitalize = "words"
                        />
                        <TextInput
                            value = {this.state.text2}
                            placeholder = "Amount..."
                            onChangeText = {(value) => this.setState({text2 : value})}
                            style={styles.modalInput}
                            underlineColorAndroid = "transparent"
                            keyboardType = "numeric"
                        />
                        <View
                            style = {{
                                flexDirection : 'row',
                                marginTop : responsiveHeight(3)
                            }}
                        >
                            <TouchableHighlight
                                onPress={() => {
                                    if (this.state.text1 != "" && this.state.text2 != "") {
                                        this.itemsRef.child(this.state.itemKey).update({
                                            Name : this.state.text1,
                                            Amount : this.state.text2
                                        })
                                        let x = parseInt(this.state.text2) - this.state.text2_old
                                        x = this.state.balance + x
                                        var balanceKey = this.getRef().child('Balance').key;
                                        this.getRef().child('Balance').update({
                                            value : x
                                        });
                                        this.setModalVisible2(!this.state.modalVisible2)
                                    } else {
                                        alert("Error : Incomplete text field.\nPlease fill all the textfield before enter.")
                                    }
                                    this.setState({text1 : "", text2 : ""})
                                }}
                                style = {styles.modalButton1}
                            >
                                <Text style={styles.modButtonText}>Edit</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onLongPress={() => {
                                    var x
                                    this.itemsRef.child(this.state.itemKey).on('value', (snap) => {
                                        x = snap.val() && snap.val().Amount
                                    })
                                    x = this.state.balance - x
                                    var balanceKey = this.getRef().child('Balance').key;
                                    this.getRef().child('Balance').update({
                                        value : x
                                    })
                                    this.itemsRef.child(item._key).remove()
                                    this.setModalVisible2(!this.state.modalVisible2)
                                    this.setState({text1 : "", text2 : ""})                                    
                                }}
                                style = {styles.modalButton3}
                            >
                                <Text style={styles.modButtonText}>Delete</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible2(!this.state.modalVisible2)
                                    this.setState({text1 : "", text2 : ""})
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
                    style = {styles.selectedHeaderTab}
                >
                    <Image source={require('../../images/income.png')} style = {styles.tabIcons} />
                </TouchableOpacity>
                <TouchableOpacity
                    style = {styles.headerTab}
                    onPress = {this.Profile}
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
            <View style = {{flexDirection : 'row', marginTop : responsiveHeight(2)}}>
                <View 
                    style = {{
                        borderWidth : 1,
                        marginHorizontal : responsiveWidth(2),
                        flexDirection : 'row',
                        height : responsiveHeight(10),
                        width : responsiveWidth(30),
                    }}
                >
                    <Text 
                        style = {{
                            color : '#000',
                            fontSize : responsiveFontSize(2.4),
                            marginVertical : responsiveHeight(2),
                            marginLeft : responsiveWidth(3)
                        }}
                    >
                        Month : 
                    </Text>
                    <TextInput
                        style = {{
                            width : responsiveWidth(10),
                            height : responsiveHeight(8),
                            fontSize : responsiveFontSize(2.4),
                        }}
                        onChangeText = {(value) => {
                            this.setState({month : value})
                        }}
                        onEndEditing = {() => {
                            if (this.state.month == "") {
                                this.setState({month : this.getMonth().toString()})
                            }
                            this.getItems(this.itemsRef)
                        }}
                        onSubmitEditing = {() => {
                            if (this.state.month == "") {
                                this.setState({month : this.getMonth().toString()})
                            }
                            this.getItems(this.itemsRef)
                        }}
                        underlineColorAndroid = "transparent"
                        value = {this.state.month}
                        keyboardType = "numeric"
                    />
                </View>
                <View 
                    style = {{
                        borderWidth : 1,
                        marginHorizontal : responsiveWidth(2),
                        flexDirection : 'row',
                        height : responsiveHeight(10),
                        width : responsiveWidth(30)
                    }}
                >
                    <Text style = {{
                        color : '#000',
                        fontSize : responsiveFontSize(2.4),
                        marginVertical : responsiveHeight(2),
                        marginLeft : responsiveWidth(3)
                    }}>
                        Year : 
                    </Text>
                    <TextInput
                        style = {{
                            width : responsiveWidth(14),
                            height : responsiveHeight(8),
                            fontSize : responsiveFontSize(2.4),
                        }}
                        onChangeText = {(value) => {
                            this.setState({year : value})
                        }}
                        onEndEditing = {() => {
                            if (this.state.year == "") {
                                this.setState({year : this.getMonth().toString()})
                            }
                            this.getItems(this.itemsRef)
                        }}
                        onSubmitEditing = {() => {
                            if (this.state.year == "") {
                                this.setState({year : this.getMonth().toString()})
                            }
                            this.getItems(this.itemsRef)
                        }}
                        underlineColorAndroid = "transparent"
                        value = {this.state.year}
                        keyboardType = "numeric"
                    />
                </View>
            </View>
            <View style={styles.tuppleTab}>
                <View style={styles.tupple}>
                    <Text style={{fontSize:responsiveFontSize(3)}}>
                        Income Name
                    </Text>
                </View>
                <View style={styles.tupple}>
                    <Text style={{fontSize:responsiveFontSize(3)}}>
                        Amount
                    </Text>
                </View>
            </View>
            <View style = {styles.liContainer}>
            <ListView
                dataSource = {this.state.itemDataSource}
                renderRow = {this.renderRow}
            />
            </View>
            <View style={{flexDirection:'row'}}>
                <Text>Your Balance : </Text>
                <Text>{this.state.balance}</Text>
            </View>
            <TouchableHighlight
                underlayColor = "#24ce84"
                onPress = {this.addItem.bind(this)}
                style={styles.action}
            >
                <Text style = {styles.actionText}>Add Income</Text>
            </TouchableHighlight>
        </View>
        );
    }
}
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
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
    tupple : {
        width : responsiveWidth(48),
        alignItems : 'center',
        
    },
    tuppleTab : {
        marginVertical : responsiveHeight(1),
        marginHorizontal : responsiveWidth(2),
        flexDirection : 'row',
        justifyContent : 'center',
        height : responsiveHeight(5),
    },
    li : {
        backgroundColor : '#fff',
        borderBottomColor : '#eee',
        borderColor : 'transparent',
        borderWidth : 2,
        paddingVertical : responsiveHeight(2),
        width : responsiveWidth(96),
        flexDirection : 'row',
        height : responsiveHeight(8),
    },
    liTextView : {
        width : responsiveWidth(48),
        alignItems : 'center',
    },
    liText : {
        color : '#333',
        fontSize : responsiveFontSize(2.4),
    },
    liContainer : {
        height : responsiveHeight(56),
    },
    action : {
        backgroundColor : 'green',
        borderColor : 'transparent',
        borderWidth : 1,
        width : responsiveWidth(100),
        height : responsiveHeight(8),
        alignItems : 'center',
        justifyContent : 'center',
    },
    actionText : {
        color : '#fff',
        fontSize : responsiveFontSize(2.5),
    },
    modal : {
        height : responsiveHeight(60),
        width : responsiveWidth(60),
        justifyContent : 'center',
        alignItems : 'center',
    },
    modalInput : {
        width : responsiveWidth(50),
        fontSize : responsiveFontSize(2),
        backgroundColor : '#f0f',
        borderRadius : 5,
        marginVertical : 3,
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
    modalButton3 : {
        width : responsiveWidth(20),
        height : responsiveHeight(10),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'red',
        marginRight : responsiveWidth(3),
    },
    modButtonText : {
        fontSize : responsiveFontSize(2),
        color : '#fff',
    },
    tabIcons : {
        width : responsiveWidth(13),
        height : responsiveHeight(8),
    },
});