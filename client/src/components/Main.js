import React, {Component} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './Login';
import  Home  from './Home';
class Main extends Component {

    getLogin = () => {
        return this.props.isLoggedIn ?
            <Redirect to="/home"/> : <Login handleLoginSucceed={this.props.handleLoginSucceed}/>;
    }
    getMachine = () => {
        //console.log(this.props.data)
        return this.props.isLoggedIn ?
            <Home data={this.props.data}
            user={this.props.user}
            location={this.props.location}/> : <Redirect to = "/login"/>;
    }

    render() {
        return (
            <div className="main">
                <Switch>
                    <Route path="/login" render={this.getLogin}/>
                    <Route path="/home" render={this.getMachine}/>
                    <Route render={this.getLogin}/>
                </Switch>
                <p className="footnote">22Sparkling Laundry Management, Mailing Address: admin@foxmail.com, LMA 2020 Project</p>
            </div>
        );
    }
}

export default Main;
