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
    Image
} from 'react-native';
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

export default class profile extends Component<{}> {
    constructor() {
        super();
        this.state = {
            text1 : "",
            text2 : ""
        }
    }
    closeControlPanel = () => {
        this._drawer.close()
      };
      openControlPanel = () => {
        this._drawer.open()
      };

    render() {
        return(
            <Drawer
                ref={(ref) => this._drawer = ref}
                type="overlay"
                content={<drawerContent />}
                tapToClose={true}
                openDrawerOffset={0.2} // 20% gap on the right side of drawer
                panCloseMask={0.2}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                  main: { opacity:(2-ratio)/2 }
                })}
            >
                <View style={{alignItems:'center',justifyContent:'center'}}>
                    <Text>Test Drawer</Text>
                </View>
            </Drawer>
        );
        const drawerStyles = {
            drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
            main: {paddingLeft: 3},
          }
    }
}