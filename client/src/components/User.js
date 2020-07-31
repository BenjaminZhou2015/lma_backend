import React, {Component} from 'react';
import 'antd/dist/antd.css';
import { Table, Tag, Space } from 'antd';


class User extends Component {



    render() {
        const { user } = this.props;
        const columns = [
            {
                title: 'RegisterDate',
                dataIndex: 'registerDate',
                key: 'date',
                render: text => <a>{text}</a>,
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
            <>

                <Table columns={columns} dataSource={user} />


            </>
        );
    }
}

export default User;