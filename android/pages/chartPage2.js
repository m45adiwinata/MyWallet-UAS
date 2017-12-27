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
        let ds2 = new ListView.DataSource({rowHasChanged : (r1,r2) => r1 !== r2});
        this.state = {
            Total : 0,
            itemDataSource : ds,
            itemDataSource2 : ds2,
            modalVisible : false,
            modalVisible2 : false,
            userId : userId,
            Year : new Date().getFullYear()
        }
        this.incomes;
        this.Inc = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.itemsRef = this.getRef().child('Incomes');
        this.month = 0;
        this.renderRow = this.renderRow.bind(this);
        this.pressRow = this.pressRow.bind(this);
        this.renderRow2 = this.renderRow2.bind(this);
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userId);
    }
    getChartValue() {
        var M = [0,0,0,0,0,0,0,0,0,0,0,0], Total=0;
        this.Inc = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.itemsRef.on('value', (snap) => {
            snap.forEach((child) => {
                if(child.val().Year == this.state.Year) {
                    M[child.val().Month-1] += child.val().Amount;
                    Total += child.val().Amount;
                }
            });
        });
        for(var i=0;i<M.length;i++) {
            this.Inc[i] += M[i];
        }
        this.incomes = Total;
        if(Total != 0) {
            for(var i=0;i<M.length;i++) {
                M[i] *= 80 / Total;
            }
        }
        let Length = [];
        for(var i=0;i<M.length;i++) {
            Length.push({
                index : i+1,
                amt : M[i]
            });
        }
        this.setState({
            itemDataSource : this.state.itemDataSource.cloneWithRows(Length)
        });
    }
    getItemChart(itemKey) {
        let Incomes = [];
        this.itemsRef.on('value', (snap) => {
            snap.forEach((child) => {
                if(child.val().Year == this.state.Year) {
                    if(child.val().Month == itemKey) {
                        Incomes.push({
                            Name : child.val().Name,
                            Value : child.val().Amount
                        });
                    }
                }
            });
            this.setState({
                itemDataSource2 : this.state.itemDataSource2.cloneWithRows(Incomes)
            });
        });
    }
    renderRow(item) {
        return(
            <View>
                <Text>{this.getMonth(item.index-1)} : {(item.amt*100/80).toFixed(2)}%</Text>
                <TouchableHighlight
                    onPress = {() => {
                        this.pressRow(item);
                    }}
                >
                    <View
                        style = {{
                            backgroundColor : '#ffd700',
                            width : responsiveWidth(item.amt),
                            height : responsiveHeight(6),
                            marginTop : responsiveHeight(2),
                            marginBottom : responsiveHeight(4)
                        }}
                    >
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
    renderRow2(item) {
        return(
            <View style={{marginVertical : responsiveHeight(2)}}>
                <Text>Income Name : {item.Name}</Text>
                <Text>Income Value : {item.Value}</Text>
            </View>
        );
    }
    pressRow(item) {
        this.month = item.index;
        this.getItemChart(item.index);
        this.viewItem();
    }
    componentWillMount() {
        this.getChartValue();
    }
    getMonth(number) {
        let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return(months[number]);
    }
    setModalVisible(visible) {
        this.clearModal;
        this.setState({modalVisible : visible});
    }
    viewDetails() {
        this.setModalVisible(true);
    }
    setModalVisible2(visible) {
        this.clearModal;
        this.setState({modalVisible2 : visible});
    }
    viewItem() {
        this.setModalVisible2(true);
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
                            marginTop : responsiveHeight(10),
                            height : responsiveHeight(70),
                            width : responsiveWidth(80),
                            marginHorizontal : responsiveWidth(10)
                        }}
                    >
                        <View
                            style={styles.modal}
                        >
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>January : {this.Inc[0]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>February : {this.Inc[1]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>March : {this.Inc[2]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>April : {this.Inc[3]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>May : {this.Inc[4]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>June : {this.Inc[5]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>July : {this.Inc[6]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>August : {this.Inc[7]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>September : {this.Inc[8]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>October : {this.Inc[9]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>November : {this.Inc[10]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>December : {this.Inc[11]}</Text>
                            <Text style={{fontSize : responsiveFontSize(2.3)}}>Total Income : {this.incomes}</Text>
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
                    visible={this.state.modalVisible2}
                    onRequestClose={() => {}}
                >
                    <View
                        style = {{
                            alignItems : 'center',
                            backgroundColor : '#fff',
                            borderWidth : 3,
                            borderRadius : 10,
                            marginTop : responsiveHeight(10),
                            height : responsiveHeight(70),
                            width : responsiveWidth(80),
                            marginHorizontal : responsiveWidth(10)
                        }}
                    >
                        <View
                            style={styles.modal}
                        >
                            <Text
                                style = {{
                                    color : 'blue', fontSize : responsiveFontSize(2.3),
                                    marginBottom : responsiveHeight(2)
                                }}
                            >
                                Your Income in {this.getMonth(this.month-1)}
                            </Text>
                            <View
                                style={{height : responsiveHeight(40)}}
                            >
                                <ListView
                                    dataSource = {this.state.itemDataSource2}
                                    renderRow = {this.renderRow2}
                                />
                            </View>
                            <TouchableHighlight
                                style = {styles.modalButton1}
                                onPress = {() => {
                                    this.setModalVisible2(!this.state.modalVisible2)
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
                        }}>Your Income Stats</Text>
                    </View>
                </View>
                <TextInput
                    style = {{
                        width : responsiveWidth(14),
                        height : responsiveHeight(8),
                        fontSize : responsiveFontSize(2.4),
                    }}
                    onChangeText = {(value) => {
                        this.setState({Year : parseInt(value)})
                    }}
                    onEndEditing = {() => {
                        if (this.state.Year == "") {
                            this.setState({Year : new Date().getFullYear()})
                        }
                        this.getChartValue(this.itemsRef)
                    }}
                    onSubmitEditing = {() => {
                        if (this.state.Year == "") {
                            this.setState({Year : new Date().getFullYear()})
                        }
                        this.getChartValue(this.itemsRef)
                    }}
                    underlineColorAndroid = "transparent"
                    value = {this.state.Year.toString()}
                    keyboardType = "numeric"
                />
                <View
                    style = {styles.chartBoard}
                >
                    <ListView
                        dataSource = {this.state.itemDataSource}
                        renderRow = {this.renderRow}
                    />
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