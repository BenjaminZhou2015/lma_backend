import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import request from "umi-request";
import { Table } from 'antd';
import { API_ROOT } from '../constants';

const UserTable = () => {
    const [ data, setData ] = useState()
    useEffect(() => {
        request(`${API_ROOT}/users`).then(
            response => {
                const { users } = response;
                setData(users);
            }
        )
    }, []);
    const columns = [
        {
            title: 'RegisterDate',
            dataIndex: 'registerDate',
            key: 'date',
            render: text => new Date(text).toLocaleString(),
        },
        {
            title: 'FirstName',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'LastName',
            dataIndex: 'lastName',
            key: 'lastName',
        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'LocationID',
            dataIndex: 'locationID',
            key: 'locationID',
        },

    ];

    return (
        <Table columns={columns} dataSource={data} rowKey="email"/>
    );
}

export default UserTable;
