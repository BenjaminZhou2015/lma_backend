import React, { Component } from 'react';
import Machine from './components/Machine';
import User from './components/User';
import Location from './components/Location';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import SubMenu from "antd/es/menu/SubMenu";
import {TOKEN_KEY} from "./constants";
import TopBar from "./components/TopBar";
import Main from "./components/Main";


class App extends Component {
  state = {
    data: [],
    //current: 'Machine',
    user: [],
    location: [],
    isLoggedIn: Boolean(localStorage.getItem(TOKEN_KEY)),
  };

  handleLoginSucceed = (token) => {
    console.log('token --- ', token)
    localStorage.setItem(TOKEN_KEY, token)
    this.setState({ isLoggedIn: true });
  }

  handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    this.setState({ isLoggedIn: false });
  }

  componentDidMount() {
    this.getMachineFromDb();
    this.getUserFromDb();
    this.getLocationFromDb();
  }

  componentWillUnmount() {
  }


  // 我们的第一个使用后端api的get方法
  // 从我们的数据库中获取数据
  getMachineFromDb = () => {
    fetch('/api/machines')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.machines}));
  };

  getUserFromDb = () => {
    fetch('/api/users')
        .then((user) => user.json())
        .then((res) => this.setState({ user: res.users}));
  };

  getLocationFromDb = () => {
    fetch('/api/locations')
        .then((location) => location.json())
        .then((res) => this.setState({ location: res.locations}));
  };

  putDataToDB = (message) => {
    //todo
  };

  deleteFromDB = (idTodelete) => {
    //todo
  };

  updateDB = (idToUpdate, updateToApply) => {
    //todo
  };


  // handleClick = e => {
  //   console.log('click ', e);
  //   this.setState({ current: e.key });
  // };

  render() {
    // const { data } = this.state;
    // const { current } = this.state;
    // const { user} = this.state;
    // const { location } = this.state;
    // const componentsSwitch = (key) => {
    //   switch (key) {
    //     case 'Machine':
    //       return ( <Machine data={data}/>);
    //     case 'User':
    //       return (<User user={user}/>);
    //     case 'Location':
    //       return (<Location location={location}/>);
    //     default:
    //       return ( <Machine data={data}/>);
    //   }
    // };


    return (
        <div className="App">
          <TopBar handleLogout={this.handleLogout}
                  isLoggedIn={this.state.isLoggedIn}
          />
          <Main  handleLoginSucceed={this.handleLoginSucceed}
                 isLoggedIn={this.state.isLoggedIn}
                 data={this.state.data}
                 user={this.state.user}
                 location={this.state.location}
          />

        </div>
      // <>
      //   <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
      //     <Menu.Item key="Machine" icon={<AppstoreOutlined />}>
      //       Machine Status
      //
      //     </Menu.Item>
      //     <Menu.Item key="User"  icon={<AppstoreOutlined />}>
      //       User Status
      //     </Menu.Item>
      //     <Menu.Item key="Location"  icon={<AppstoreOutlined />}>
      //       Location
      //     </Menu.Item>
      //   </Menu>
      //
      //   {componentsSwitch(current)}
      //
      // </>
    );
  }
}

export default App;