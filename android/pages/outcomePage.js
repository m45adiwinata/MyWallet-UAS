import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    ListView,
    AppRegistry,
    Dimensions,
    Modal,
    TextInput,
    Image,
    Picker
} from 'react-native';
import {
    width,
    height
} from 'react-native-dimensions';
import * as firebase from 'firebase';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import {
    Drawer
} from 'react-native-drawer';
import drawerContent from '../components/drawerContent';
import { Actions } from 'react-native-router-flux';



export default class outcomePage extends Component <{}> {
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
            language : '',
            text1 : '',
            text2 : '',
            text3 : '',
            balance : 0
        }
        this.itemsRef = this.getRef().child('Items');
        this.renderRow = this.renderRow.bind(this);
        this.pressRow = this.pressRow.bind(this);
    }
    getBalance() {
        var b;
        this.getRef().child('Balance').on('value',(snap) => {
            b = snap.val().value;
            this.setState({balance : b});
        });
    }
    getSum(total,num) {
        return (total+num);
    }
    setModalVisible(visible) {
        this.clearModal;
        this.setState({modalVisible : visible});
    }

    getRef() {
        return firebase.database().ref('Users/'+this.state.userID);
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
                items.push({
                    title : child.val().Stuff,
                    price : child.val().Price,
                    count : child.val().Count,
                    _key : child.key
                });
            });
            this.setState({
                itemDataSource : this.state.itemDataSource.cloneWithRows(items)
            });
        });
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
                    <View style={styles.liTextView}>
                        <Text style={styles.liText}>{item.count}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
    pressRow(item) {
        var x,y,z;
        this.itemsRef.child(item._key).on('value', (snap) => {
            x = snap.val() && snap.val().Price;
            y = snap.val() && snap.val().Count;
            z = x * y;
        });
        z = this.state.balance + z;
        var balanceKey = this.getRef().child('Balance').key;
        this.getRef().child('Balance').update({
            value : z
        });
        this.itemsRef.child(item._key).remove();
    }

    addItem() {
        this.setModalVisible(true);
    }

    closeControlPanel (){
        this._drawer.close()
    }
    openControlPanel (){
        this._drawer.open()
    }
    Income() {
        Actions.income();
    }
    render() {
        return(
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
                            <Picker
                                selectedValue={this.state.language}
                                onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}
                                style={{
                                    backgroundColor : 'transparent',
                                    borderWidth : responsiveWidth(3),
                                    borderColor : 'black',
                                    width : responsiveWidth(50),
                                    height : responsiveHeight(7),
                                    alignItems : 'center',
                                    marginBottom : responsiveHeight(2)
                                }}
                            >
                                <Picker.Item label="Food" value="Food" />
                                <Picker.Item label="Needs" value="Needs" />
                                <Picker.Item label="Hobby" value="Hobby" />
                                <Picker.Item label="Investation" value="Investation" />
                            </Picker>
                            <TextInput
                                value = {this.state.text1}
                                placeholder = "Stuff..."
                                onChangeText = {(value) => this.setState({text1 : value})}
                                style={styles.modalInput}
                                underlineColorAndroid = "transparent"
                                autoCapitalize = "words"
                            />
                            <TextInput
                                value = {this.state.text2}
                                placeholder = "Price..."
                                onChangeText = {(value) => this.setState({text2 : value})}
                                style={styles.modalInput}
                                underlineColorAndroid = "transparent"
                                keyboardType = "numeric"
                            />
                            <TextInput
                                value = {this.state.text3}
                                placeholder = "Count..."
                                onChangeText = {(value) => this.setState({text3 : value})}
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
                                        if ((this.state.text1 != "" && this.state.text2 != "") && this.state.text3 != "") {
                                            this.itemsRef.push({
                                                Stuff : this.state.text1, 
                                                Price : parseInt(this.state.text2), 
                                                Count : parseInt(this.state.text3),
                                                Type : this.state.language
                                            })
                                            let x = this.state.balance - (parseInt(this.state.text2)*parseInt(this.state.text3))
                                            var balanceKey = this.getRef().child('Balance').key
                                            this.getRef().child('Balance').update({
                                                value : x
                                            })
                                            this.setModalVisible(!this.state.modalVisible)
                                        } else {
                                            alert("Error : Incomplete text field.\nPlease fill all the textfield before enter.")
                                        }
                                        this.setState({text1 : "", text2 : "", text3 : ""})
                                    }}
                                    style = {styles.modalButton1}
                                >
                                    <Text style={styles.modButtonText}>Save Item</Text>
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
                <TouchableHighlight
                    style = {styles.headerTab}
                    onPress = {this.Income}
                >
                    <Text style={styles.header}>This is Outcome Page</Text>
                    {/* <TouchableHighlight
                        style = {{
                            height : responsiveHeight(2),
                            width : responsiveWidth(10)
                        }}
                        onPress = {() => this.openControlPanel()}
                    >
                        <Text>open</Text>
                    </TouchableHighlight> */}
                </TouchableHighlight>
                <View style={{
                    flexDirection : 'row',
                    height : responsiveHeight(4),
                    marginBottom : responsiveHeight(1)
                    }}>
                    <View style = {styles.tupple}>
                        <Text style={{fontSize : responsiveFontSize(2.5)}}>Stuff</Text>
                    </View>
                    <View style = {styles.tupple}>
                        <Text style={{fontSize : responsiveFontSize(2.5)}}>Price</Text>
                    </View>
                    <View style = {styles.tupple}>
                        <Text style={{fontSize : responsiveFontSize(2.5)}}>Count</Text>
                    </View>
                </View>
                <ListView
                    dataSource = {this.state.itemDataSource}
                    renderRow = {this.renderRow}
                    style = {styles.liContainer}
                />
                <View style={{
                        height : responsiveHeight(3),
                        marginVertical : responsiveHeight(0.5),
                        alignItems : 'baseline'
                    }}
                >
                    <Text>
                        Your Balance : {this.state.balance}
                    </Text>
                </View>
                <TouchableHighlight
                    underlayColor = "#24ce84"
                    onPress = {this.addItem.bind(this)}
                    style={styles.action}
                >
                    <Text style = {styles.actionText}>Add Item</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        alignItems : 'center',
        justifyContent : 'center',
        width : width,
    },
    header : {
        marginVertical : responsiveHeight(2),
        fontSize : responsiveFontSize(3),
    },
    headerTab : {
        height : responsiveHeight(10),
        width : responsiveWidth(100),
        alignItems : 'center',
        backgroundColor : '#00f',
    },
    tupple : {
        width : responsiveWidth(31.6),
        alignItems : 'center',
        justifyContent : 'center',
    },
    
    li : {
        backgroundColor : '#fff',
        borderBottomColor : '#eee',
        borderColor : 'transparent',
        borderWidth : 2,
        width : width,
        paddingVertical : 14,
        width : responsiveWidth(95),
        flexDirection : 'row',
    },
    liTextView : {
        width : responsiveWidth(31),
        alignItems : 'center',
    },
    liText : {
        color : '#333',
        fontSize : responsiveFontSize(2.4),
    },
    liContainer : {
        height : responsiveHeight(70),
    },
    action : {
        backgroundColor : 'green',
        borderColor : 'transparent',
        borderWidth : 1,
        paddingVertical : 16,
        width : responsiveWidth(100),
        height : responsiveHeight(10),
        alignItems : 'center',
    },
    actionText : {
        color : '#fff',
        fontSize : 16,
        textAlign : 'center',
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
        marginHorizontal : responsiveWidth(3),
    },
    modalButton2 : {
        width : responsiveWidth(20),
        height : responsiveHeight(10),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'red',
    },
    modButtonText : {
        fontSize : responsiveFontSize(2),
        color : '#fff',
    },
});
const drawerStyles = {
    drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
    main: {paddingLeft: 3},
}
AppRegistry.registerComponent('outcomePage', () => outcomePage);