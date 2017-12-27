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
import chart from './android/pages/chartPage';
import chart2 from './android/pages/chartPage2';
import stats from './android/pages/Stats';

export default class Routes extends Component<{}> {
    render() {
        return(
            <Router>
                <Stack key="root">
                    <Scene key="splash" component={splash} title="splash" hideNavBar={true} initial={true}/>
                    <Scene key="login" component={Login} title="Login" hideNavBar={true}/>
                    <Scene key="signup" component={Signup} title="Signup" hideNavBar={true}/>
                    <Scene key="outcome" component={outcomePage} title="outcome" hideNavBar={true}/>
                    <Scene key="income" component={incomePage} title="income" hideNavBar={true}/>
                    <Scene key="profile" component={profile} title="profile" hideNavBar={true} />
                    <Scene key="chart" component={chart} title="chart" hideNavBar={true} />
                    <Scene key="chart2" component={char2} title="chart2" hideNavBar={true} />
                    <Scene key="stats" component={stats} title="stats" hideNavBar={true} />
                </Stack>
            </Router>
        );
    }
}