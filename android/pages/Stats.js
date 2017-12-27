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
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from 'react-native-responsive-dimensions';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

export default class Stats extends Component<{}> {
    constructor() {
        var userId = firebase.auth().currentUser.uid;
        super();
        this.state = {
            Income : 0,
            Outcome : 0,
            Total : 0,
            length1 : 0,
            length2 : 0,
            month : this.getMonth(),
            modalVisible : false,
            userId : userId,
        }
        this.itemsRef = this.getRef().child('Items');
        this.incomeRef = this.getRef().child('Incomes');
        this.month = 0;
    }
    getRef() {
        return firebase.database().ref('Users/'+this.state.userId);
    }
    getIncomeValue() {
        var I=0;
        if(this.month != 0) {
            this.incomeRef.on('value', (snap) => {
                snap.forEach((child) => {
                    if(child.val().Month == this.month) {
                        I += child.val().Amount;
                    }
                });
            });
        }
        else {
            this.incomeRef.on('value', (snap) => {
                snap.forEach((child) => {
                    I += child.val().Amount;
                });
            });
        }
        return(I);
    }
    getOutcomeValue() {
        var O=0;
        if(this.month != 0) {
            this.itemsRef.on('value', (snap) => {
                snap.forEach((child) => {
                    if(child.val().Month == this.month) {
                        O += child.val().Price * child.val().Count;
                    }
                });
            });
        }
        else {
            this.itemsRef.on('value', (snap) => {
                snap.forEach((child) => {
                    O += child.val().Price * child.val().Count;
                });
            });
        }
        return(O);
    }
    getChartValue() {
        var I=this.getIncomeValue(), O=this.getOutcomeValue(), Total=0;
        Total = I+O;
        this.setState({
            Income : I,
            Outcome : O,
            Total : Total
        });
        if(Total!=0) {
            I *= 80 / Total;
            O *= 80 / Total;
        }
        this.setState({
            length1 : I,
            length2 : O
        });
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
    getMonth() {
        let time = new Date().getMonth()+1;
        return(time);
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
                        style = {styles.headerTab}
                        onPress = {this.Profile}
                    >
                        <Image source={require('../../images/profile.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style = {styles.selectedHeaderTab}
                    >
                        <Image source={require('../../images/chart.png')} style = {styles.tabIcons} />
                    </TouchableOpacity>
                </View>
                <Text style={{
                    fontSize : responsiveFontSize(3), 
                    color : '#00f',
                    marginVertical : responsiveHeight(2)
                }}>Your Stats For Month</Text>
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
                <View
                    style = {styles.chartBoard}
                >
                    <Text style={{fontSize : responsiveFontSize(2.5), color : 'red'}}>
                        Income : {(this.state.length1*100/80).toFixed(2)}%
                    </Text>
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
                    <Text style={{fontSize : responsiveFontSize(2.5), color : '#ffd700'}}>
                        Outcome : {(this.state.length2*100/80).toFixed(2)}%
                    </Text>
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
                </View>
                <View
                    style = {{marginVertical:responsiveHeight(3)}}
                >
                    <Text>Outcome : {this.state.Outcome}</Text>
                    <Text>Income : {this.state.Income}</Text>
                    <Text>Balance : {(this.state.Income-this.state.Outcome)}</Text>
                </View>
                <Text style={{fontSize:responsiveFontSize(2.2),color:'black'}}>Choose your stats here : </Text>
                <View
                    style = {{flexDirection:'row'}}
                >
                    <TouchableHighlight
                        style = {{
                            width:responsiveWidth(49.7), height:responsiveHeight(8), borderRightWidth:1,
                            alignItems:'center', backgroundColor : 'yellow', justifyContent : 'center'
                        }}
                        onPress = {() => {
                            Actions.chart();
                        }}
                    >
                        <Text>Outcome</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style = {{
                            width:responsiveWidth(49.7), height:responsiveHeight(8), alignItems:'center',
                            backgroundColor : 'yellow', justifyContent : 'center'
                        }}
                        onPress = {() => {
                            Actions.chart2();
                        }}
                    >
                        <Text>Income</Text>
                    </TouchableHighlight>
                </View>
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
    chartBoard : {
        width : responsiveWidth(84),
        height : responsiveHeight(41),
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