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
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';

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
            modalVisible2 : false,
            type : 'Food',
            text1 : '',
            text2 : '',
            text3 : '',
            text2_old : '',
            text3_old : '',
            balance : 0,
            date : this.getTimes(),
            itemKey : ''
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
    setModalVisible2(visible) {
        this.clearModal;
        this.setState({modalVisible2 : visible});
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userID);
    }

    componentWillMount() {
        this.getBalance();
        this.getItems(this.itemsRef);
        this.getRef().child('Incomes').on('value',(snap) => {});
    }
    
    componentDidMount() {
        this.getBalance();
        this.getItems(this.itemsRef);
        this.getRef().child('Incomes').on('value',(snap) => {});
    }
    getItems(itemsRef) {
        itemsRef.on('value',(snap) => {
            let items = [];
            snap.forEach((child) => {
                if(child.val().Time == this.state.date) {
                    items.push({
                        title : child.val().Stuff,
                        price : child.val().Price,
                        count : child.val().Count,
                        _key : child.key
                    });
                }
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
        this.setState({itemKey : item._key});
        this.itemsRef.child(item._key).on('value', (snap) => {
            this.setState({
                text1 : snap.val() && snap.val().Stuff,
                text2 : snap.val() && snap.val().Price.toString(),
                text3 : snap.val() && snap.val().Count.toString(),
                text2_old : snap.val() && snap.val().Price,
                text3_old : snap.val() && snap.val().Count,
                type : snap.val() && snap.val().Type
            });
        });
        this.setModalVisible2(true);
    }

    addItem() {
        this.setModalVisible(true);
    }
    Income() {
        Actions.income();
    }
    Profile() {
        Actions.profile();
    }
    Stats() {
        Actions.stats();
    }
    getTimes() {
        let today = new Date();
        var time = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear();
        return time;
    }
    getMonth() {
        var time = new Date().getMonth()+1;
        return time;
    }
    getYear() {
        var time = new Date().getFullYear();
        return time;
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
                                selectedValue={this.state.type}
                                onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
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
                                                Type : this.state.type,
                                                Time : this.getTimes(),
                                                Month : this.getMonth(),
                                                Year : this.getYear()
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
                                        this.setState({
                                            text1 : "", 
                                            text2 : "", 
                                            text3 : "",
                                            type : "Food"
                                        })
                                    }}
                                    style = {styles.modalButton1}
                                >
                                    <Text style={styles.modButtonText}>Save Item</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible(!this.state.modalVisible)
                                        this.setState({
                                            text1 : "", 
                                            text2 : "", 
                                            text3 : "",
                                            type : "Food"
                                        })
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
                            <Text
                                style={{fontSize : responsiveFontSize(2), alignSelf : 'center'}}
                            >
                                Edit or Delete
                            </Text>
                            <Picker
                                selectedValue={this.state.type}
                                onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
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
                                            let x = parseInt(this.state.text2)*parseInt(this.state.text3)
                                            let y = parseInt(this.state.text2_old)*parseInt(this.state.text3_old)
                                            let z = x-y
                                            z = this.state.balance - z
                                            this.itemsRef.child(this.state.itemKey).update({
                                                Stuff : this.state.text1,
                                                Price : parseInt(this.state.text2),
                                                Count : parseInt(this.state.text3),
                                                Type : this.state.type
                                            })
                                            var balanceKey = this.getRef().child('Balance').key
                                            this.getRef().child('Balance').update({
                                                value : z
                                            })
                                            this.setModalVisible2(!this.state.modalVisible2)
                                        } else {
                                            alert("Error : Incomplete text field.\nPlease fill all the textfield before enter.")
                                        }
                                        this.setState({
                                            text1 : "", 
                                            text2 : "", 
                                            text3 : "",
                                            type : "Food"
                                        })
                                    }}
                                    style = {styles.modalButton1}
                                >
                                    <Text style={styles.modButtonText}>Edit</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onLongPress = {() => {
                                        let x = this.state.text2_old * this.state.text3_old;
                                        x = this.state.balance + x
                                        this.getRef().child('Balance').update({
                                            value : x
                                        })
                                        this.itemsRef.child(this.state.itemKey).remove()
                                        this.setModalVisible2(!this.state.modalVisible2)
                                    }}
                                    style = {styles.modalButton2}
                                >
                                    <Text style={styles.modButtonText}>Delete</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => {
                                        this.setModalVisible2(!this.state.modalVisible2)
                                        this.setState({
                                            text1 : "", 
                                            text2 : "", 
                                            text3 : "",
                                            type : "Food"
                                        })
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
                        style = {styles.selectedHeaderTab}
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
                        style = {styles.headerTab}
                        onPress = {this.Profile}
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
                <DatePicker
                    style={{width: 200}}
                    date={this.state.date}
                    mode="date"
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    minDate="01/05/1997"
                    maxDate={this.getTimes()}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                    // ... You can check the source to find the other keys. 
                    }}
                    onDateChange={(date) => {
                        this.setState({date: date})
                        this.getItems(this.itemsRef)
                    }}
                />
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
        fontSize : responsiveFontSize(2),
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
        height : responsiveHeight(62),
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
        marginHorizontal : responsiveWidth(1.5),
    },
    modalButton2 : {
        width : responsiveWidth(20),
        height : responsiveHeight(10),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'red',
        marginHorizontal : responsiveWidth(1.5),
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
AppRegistry.registerComponent('outcomePage', () => outcomePage);