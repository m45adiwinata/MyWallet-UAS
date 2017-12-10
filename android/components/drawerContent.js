import React, { Component } from 'react';
import {
    AppRegistry,
    Text,
    View
} from 'react-native';

export default class drawerContent extends Component<{}> {
    render() {
      return (
       <View>
            <Text >
                Control Panel
            </Text>       
        </View>
        );
    }
}
AppRegistry.registerComponent('drawerContent', () => drawerContent);