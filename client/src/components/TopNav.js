import React from 'react';
import logo from '../assets/logo.png';
import '../styles/TopNav.css';
import { LoginOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const TopBar = props => {
    const { user, logout } = props;
    return (
        <div className="App-header">
            <div className="logo">
                <img src={logo} alt=""/>
            </div>
            <span className="App-title">Sparkling Admin Console</span>
            <div className="logout">
                {
                    user.token ?
                        <Button
                            icon={<LoginOutlined />}
                            onClick={logout}
                            type="primary"
                        >
                            Logout
                        </Button> : null
                }
            </div>
        </div>
    );
}

export default TopBar;
