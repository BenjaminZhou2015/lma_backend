import React, {Component} from 'react';
import Box from './Box';
import List from './List';
import {Menu} from "antd";
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import SubMenu from "antd/es/menu/SubMenu";
import User from "./User";
import Location from "./Location";

class Machine extends Component {
    render() {
        const { data } = this.props;
        return (
            <>
                <List data={data}/>
                <Box data={data}/>
            </>
        );
    }
}

export default Machine;