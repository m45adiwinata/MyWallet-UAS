import { View, Text, TouchableHighlight, TouchableOpacity, AppRegistry } from 'react-native';
import React, { Component } from 'react';

export default class App extends Component<{}> {
   render() {
        return(
            <View>
             <TouchableHighlight>
                 <Text>add items</Text>
             </TouchableHighlight>
            </View>
        );
    }
}