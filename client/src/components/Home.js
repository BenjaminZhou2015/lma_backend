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
        let res =[];
        let index =[];
        let locationName =[];
        var checkres = (item)=>{
            for(const ele of res){
                if(item === ele){
                    return true;
                }
            }
            return false;
        }
        data.map((dat) => {
                if(!checkres(dat.locationID)) {
                    res.push(dat.locationID);
                    index.push(res.length-1);
                }
                return null;
            }
        )
        res.map((ele)=>{
            for(let temp of location){
                if(temp._id.toString() === ele){
                    locationName.push(temp.name);
                    break;
                }
            }
            return null;
        });

        data.map((dat)=>{
           for(let i =0; i<res.length; i++){
               if(dat.locationID == res[i]){
                   dat["locationName"] = locationName[i];
                   break;
               }
           }
        });
        console.log(data);
        const componentsSwitch = (key) => {
            switch (key) {
                case 'Machine':
                    return (<Machine data={data} location={location} locationIDs={res} locationNames={locationName}/>);
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