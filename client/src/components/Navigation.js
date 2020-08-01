import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from "./Home";
import Login from "./Login";
import "../styles/Main.css";

const Navigation = props => {
    const { user } = props;
    const getLogin = () => {
        return user.token ?
            <Redirect to="/home"/> : <Login {...props}/>;
    }
    const getHome = () => {
        return user.token ?
            <Home /> : <Redirect to = "/login"/>;
    }
    return (
        <div className="main">
            <Switch>
                <Route path="/login" render={getLogin}/>
                <Route path="/home" render={getHome}/>
                <Route render={getLogin}/>
            </Switch>
        </div>
    );
}

export default Navigation;
