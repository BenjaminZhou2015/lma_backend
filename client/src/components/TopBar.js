import React, {Component} from 'react';
import { Icon } from 'antd';

class TopBar extends Component {
    render() {
        return (
            <header className="App-header">
<<<<<<< HEAD
                <span className="App-title">Sparkling Laundry Management</span>
=======
                <span className="App-title">Sparkling Laundry Management11</span>
>>>>>>> 7767d31cfcd9b7b104a731212c8903ed5fe08493

                {this.props.isLoggedIn ?
                    <a className="logout" onClick={this.props.handleLogout} >
                        <Icon type="logout"/>{' '}Logout
                    </a> : null }
            </header>
        );
    }
}

export default TopBar;