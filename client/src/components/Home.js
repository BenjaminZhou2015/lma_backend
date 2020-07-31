import React, {Component} from 'react';
import {Menu} from "antd";
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import SubMenu from "antd/es/menu/SubMenu";
import Machine from "./Machine"
import User from "./User";
import Location from "./Location";

class Home extends Component {
    state = {
        current: 'Machine',
    };

    handleClick = e => {
        console.log('click ', e);
        this.setState({ current: e.key });
    };

    render() {
        const { data, user, location } = this.props;
        const { current } = this.state;
        //console.log(location)
        const componentsSwitch = (key) => {
            switch (key) {
                case 'Machine':
                    return (<Machine data={data}/>);
                case 'User':
                    return (<User user={user}/>);
                case 'Location':
                    return (<Location location={location}/>);
                default:
                    return (<Machine data={data}/>);
            }
        };


        return (
            <div>
                <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                    <Menu.Item key="Machine" icon={<AppstoreOutlined />}> Machine Status</Menu.Item>
                    <Menu.Item key="User" icon={<AppstoreOutlined />}> User Status</Menu.Item>
                    <Menu.Item key="Location" icon={<AppstoreOutlined />}> Location </Menu.Item>
                </Menu>
                {componentsSwitch(current)}

            </div>

        );
    }
}

export default Home;