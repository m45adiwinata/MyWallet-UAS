import React, { Component } from 'react';
import {
    Router,
    Stack,
    Scene
} from 'react-native-router-flux';
import Login from './android/pages/Login';
import Signup from './android/pages/Signup';
import outcomePage from './android/pages/outcomePage';
import incomePage from './android/pages/incomePage';
import profile from './android/pages/profile';
import splash from './android/pages/Splashscreen';

export default class Routes extends Component<{}> {
    render() {
        return(
            <Router>
                <Stack key="root">
                    <Scene key="login" component={Login} title="Login" hideNavBar={true}/>
                    <Scene key="signup" component={Signup} title="Signup" hideNavBar={true}/>
                    <Scene key="outcome" component={outcomePage} title="outcome" hideNavBar={true}/>
                    <Scene key="income" component={incomePage} title="income" hideNavBar={true}/>
                    <Scene key="profile" component={profile} title="profile" hideNavBar={true} />
                    <Scene key="splash" component={splash} title="splash" hideNavBar={true} initial={true}/>
                </Stack>
            </Router>
        );
    }
}