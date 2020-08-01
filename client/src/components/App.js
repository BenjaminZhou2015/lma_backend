import React, { useState } from 'react';
import '../styles/App.css';
import TopBar from "./TopNav";
import Navigation from "./Navigation";

const App = () => {
    const [ user, setUser ] = useState({});
    const logout = () => {
        setUser({});
    };
    return (
        <div className="App">
            <TopBar user={user} logout={logout}/>
            <Navigation user={user} setUser={setUser}/>
            <div className="footer">Sparkling Laundry Management, Mailing Address: admin@foxmail.com, LMA 2020 Project</div>
        </div>
    );
}

export default App;
