import React, { Component } from 'react';
import {
    View,
    Text,
    Picker,
    TouchableHighlight,
    TouchableOpacity,
    StyleSheet,
    ListView,
    AppRegistry,
    Dimensions,
    Modal,
    TextInput,
    Image
} from 'react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

export default class chartPage extends Component<{}> {
    constructor() {
        var userId = firebase.auth().currentUser.uid;
        super();
        let ds = new ListView.DataSource({rowHasChanged : (r1,r2) => r1 !== r2});
        this.state = {
            Food : 0,
            Needs : 0,
            Hobby : 0,
            Investation : 0,
            Total : 0,
            length1 : 0,
            length2 : 0,
            length3 : 0,
            length4 : 0,
            modalVisible : false,
            itemModal : false,
            userId : userId,
            itemDataSource : ds,
            year : new Date().getFullYear().toString()
        }
        this.renderRow = this.renderRow.bind(this);
        this.itemsRef = this.getRef().child('Items');
        this.month = 0;
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userId);
    }
    getChartValue() {
        var x, type;
        var F=0, N=0, H=0, I=0, Total=0;
        if(this.month == 0) {
            this.itemsRef.on('value', (snap) => {
                snap.forEach((child) => {
                    if(child.val().Year == parseInt(this.state.year)) {
                        if(child.val().Type == "Food") {
                            F += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Needs") {
                            N += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Hobby") {
                            H += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Investation") {
                            I += child.val().Price * child.val().Count;
                        }
                        Total += child.val().Price * child.val().Count;
                    }
                });
            });
        }
        else {
            this.itemsRef.on('value', (snap) => {
                snap.forEach((child) => {
                    if(this.month == child.val().Month && parseInt(this.state.year) == child.val().Year) {
                        if(child.val().Type == "Food") {
                            F += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Needs") {
                            N += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Hobby") {
                            H += child.val().Price * child.val().Count;
                        }
                        else if(child.val().Type == "Investation") {
                            I += child.val().Price * child.val().Count;
                        }
                        Total += child.val().Price * child.val().Count;
                    }
                });
            });
        }
        this.setState({
            Food : F,
            Needs : N,
            Hobby : H,
            Investation : I,
            Total : Total
        });
        if(Total != 0) {
            F *= 80 / Total;
            N *= 80 / Total;
            H *= 80 / Total;
            I *= 80 / Total;
        }
        this.setState({
            length1 : F,
            length2 : N,
            length3 : H,
            length4 : I
        });
    }
    getItemByType(type,month,year) {
        this.itemsRef.on('value', (snap) => {
            let items = [];
            if(month == 0) {
                snap.forEach((child) => {
                    if(child.val().Type == type && child.val().Year == year) {
                        items.push({
                            name : child.val().Stuff,
                            price : child.val().Price,
                            count : child.val().Count
                        });
                    }
                });
            }
            else {
                snap.forEach((child) => {
                    if(child.val().Type == type && child.val().Month == month && child.val().Year == year) {
                        items.push({
                            name : child.val().Stuff,
                            price : child.val().Price,
                            count : child.val().Count
                        });
                    }
                });
            }
            this.setState({
                itemDataSource : this.state.itemDataSource.cloneWithRows(items)
            });
        });
    }
    renderRow(item) {
        return(
            <View style={{marginVertical : responsiveHeight(2)}}>
                <Text>{item.name}</Text>
                <Text>{item.price}</Text>
                <Text>{item.count}</Text>
            </View>
        );
    }
    setItemModalVisibility(visible) {
        this.clearModal;
        this.setState({itemModal : visible});
    }
    componentWillMount() {
        this.getChartValue();
    }
    componentDidMount() {
        this.getChartValue();
    }
    setModalVisible(visible) {
        this.clearModal;
        this.setState({modalVisible : visible});
    }
    viewDetails() {
        this.setModalVisible(true);
    }
    Outcome() {
        Actions.outcome();
    }
    Income() {
        Actions.income();
    }
    Profile() {
        Actions.profile();
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
                            marginTop : responsiveHeight(30),
                            height : responsiveHeight(40),
                            width : responsiveWidth(80),
                            marginHorizontal : responsiveWidth(10)
                        }}
                    >
                        <View
                            style={styles.modal}
                        >
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Food : {this.state.Food}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Needs : {this.state.Needs}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Hobby : {this.state.Hobby}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Investation : {this.state.Investation}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Total Outcome : {this.state.Total}</Text>
                            <TouchableHighlight
                                style = {styles.modalButton1}
                                onPress = {() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                }}
                            >
                                <Text style={{color : '#000'}}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>


                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.itemModal}
                    onRequestClose={() => {}}
                >
                    <View
                        style = {{
                            alignItems : 'center',
                            backgroundColor : '#fff',
                            borderWidth : 3,
                            borderRadius : 10,
                            marginTop : responsiveHeight(15),
                            height : responsiveHeight(70),
                            width : responsiveWidth(80),
                            marginHorizontal : responsiveWidth(10)
                        }}
                    >
                        <View
                            style={styles.itemModal}
                        >
                            <View
                                style = {{height : responsiveHeight(55),width: responsiveWidth(50)}}
                            >
                                <ListView 
                                    dataSource = {this.state.itemDataSource}
                                    renderRow = {this.renderRow}
                                />
                            </View>
                            <TouchableHighlight
                                style = {styles.modalButton1}
                                onPress = {() => {
                                    this.setItemModalVisibility(!this.state.itemModal)
                                }}
                            >
                                <Text style={{color : '#000'}}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <View
                    style = {{flexDirection : 'row'}}
                >
                    <TouchableOpacity
                        style = {styles.headerTab}
                        onPress = {Actions.pop}
                    >
                        <Image source={require('../../images/back.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                    <View style={{width : responsiveWidth(75)}}>
                        <Text style={{
                            fontSize : responsiveFontSize(3), 
                            color : '#00f',
                            marginVertical : responsiveHeight(1),
                            marginLeft : responsiveWidth(4)
                        }}>Your Outcome Stats</Text>
                    </View>
                </View>
                <View style={{flexDirection : 'row'}}>
                    <Picker
                        selectedValue={this.month.toString()}
                        onValueChange={(itemValue, itemIndex) => {
                            this.month = parseInt(itemValue)
                            this.getChartValue()
                        }}
                        style={{
                            backgroundColor : 'transparent',
                            borderWidth : 1,
                            borderColor : 'black',
                            width : responsiveWidth(36),
                            height : responsiveHeight(7),
                            alignItems : 'center',
                            marginBottom : responsiveHeight(2)
                        }}
                    >
                        <Picker.Item label="All Months" value="0" />
                        <Picker.Item label="January" value="1" />
                        <Picker.Item label="February" value="2" />
                        <Picker.Item label="March" value="3" />
                        <Picker.Item label="April" value="4" />
                        <Picker.Item label="May" value="5" />
                        <Picker.Item label="June" value="6" />
                        <Picker.Item label="July" value="7" />
                        <Picker.Item label="August" value="8" />
                        <Picker.Item label="September" value="9" />
                        <Picker.Item label="October" value="10" />
                        <Picker.Item label="November" value="11" />
                        <Picker.Item label="December" value="12" />
                    </Picker>
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
                                this.state.year = new Date().getFullYear()
                            }
                            this.getChartValue()
                        }}
                        onSubmitEditing = {() => {
                            if (this.state.year == "") {
                                this.state.year = new Date().getFullYear()
                            }
                            this.getChartValue()
                        }}
                        underlineColorAndroid = "transparent"
                        value = {this.state.year}
                        keyboardType = "numeric"
                    />
                </View>
                <View
                    style = {styles.chartBoard}
                >
                    <Text style={{fontSize : responsiveFontSize(2.5), color : 'red'}}>
                        Food : {(this.state.length1*100/80).toFixed(2)}%
                    </Text>
                    <TouchableOpacity
                        onPress = {() => {
                            this.getItemByType("Food", this.month, this.state.year)
                            this.setItemModalVisibility(true);
                        }}
                    >
                        <View
                            style = {{
                                backgroundColor : 'red',
                                width : responsiveWidth(this.state.length1),
                                height : responsiveHeight(6),
                                marginTop : responsiveHeight(2),
                                marginBottom : responsiveHeight(4)
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize : responsiveFontSize(2.5), color : '#ffd700'}}>
                        Needs : {(this.state.length2*100/80).toFixed(2)}%
                    </Text>
                    <TouchableOpacity
                        onPress = {() => {
                            this.getItemByType("Needs", this.month, this.state.year)
                            this.setItemModalVisibility(true);
                        }}
                    >
                        <View
                            style = {{
                                backgroundColor : '#ffd700',
                                width : responsiveWidth(this.state.length2),
                                height : responsiveHeight(6),
                                marginTop : responsiveHeight(2),
                                marginBottom : responsiveHeight(4)
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize : responsiveFontSize(2.5), color : 'green'}}>
                        Hobby : {(this.state.length3*100/80).toFixed(2)}%
                    </Text>
                    <TouchableOpacity
                        onPress = {() => {
                            this.getItemByType("Hobby", this.month, this.state.year)
                            this.setItemModalVisibility(true);
                        }}
                    >
                        <View
                            style = {{
                                backgroundColor : 'green',
                                width : responsiveWidth(this.state.length3),
                                height : responsiveHeight(6),
                                marginTop : responsiveHeight(2),
                                marginBottom : responsiveHeight(4)
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize : responsiveFontSize(2.5), color : 'blue'}}>
                        Investation : {(this.state.length4*100/80).toFixed(2)}%
                    </Text>
                    <TouchableOpacity
                        onPress = {() => {
                            this.getItemByType("Investation", this.month, this.state.year)
                            this.setItemModalVisibility(true);
                        }}
                    >
                        <View
                            style = {{
                                backgroundColor : 'blue',
                                width : responsiveWidth(this.state.length4),
                                height : responsiveHeight(6),
                                marginTop : responsiveHeight(2),
                                marginBottom : responsiveHeight(4)
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableHighlight
                    style = {styles.openModalBtn}
                    onPress = {() => {
                        this.setModalVisible(true)
                    }}
                >
                    <Text style={{fontSize : responsiveFontSize(2.5)}}>Details</Text>
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
        backgroundColor : '#fff',
        justifyContent : 'center',
        backgroundColor : 'transparent',
    },
    chartBoard : {
        width : responsiveWidth(84),
        height : responsiveHeight(66),
        borderWidth : 2,
        paddingHorizontal : responsiveWidth(2),
        paddingVertical : responsiveHeight(2),
    },
    modal : {
        height : responsiveHeight(40),
        width : responsiveWidth(60),
        justifyContent : 'center',
        alignItems : 'center',
    },
    itemModal : {
        height : responsiveHeight(70),
        width : responsiveWidth(70),
        justifyContent : 'center',
        alignItems : 'center',
    },
    modalButton1 : {
        width : responsiveWidth(20),
        height : responsiveHeight(7),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'grey',
        borderRadius : responsiveHeight(2),
        marginTop : responsiveHeight(5),
    },
    openModalBtn : {
        width : responsiveWidth(25),
        height : responsiveHeight(7),
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : 'grey',
        borderRadius : responsiveHeight(2),
        marginTop : responsiveHeight(3.6),
    },
    tabIcons : {
        width : responsiveWidth(13),
        height : responsiveHeight(8),
    },
});