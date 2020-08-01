import React from "react";
import { Tabs } from "antd";
import "../styles/Home.css";
import UserTable from "./UserTable";
import LocationTable from "./LocationTable";
import MachineList from "./MachineList";

const { TabPane } = Tabs;

const Home = props => {
    return (
        <div className="contents">
            <Tabs defaultActiveKey="1" centered size="large">
                <TabPane tab="Machines" key="1">
                    <MachineList />
                </TabPane>
                <TabPane tab="Users" key="2">
                    <UserTable />
                </TabPane>
                <TabPane tab="Locations" key="3">
                    <LocationTable />
                </TabPane>
            </Tabs>
        </div>
    )
};

export default Home;
