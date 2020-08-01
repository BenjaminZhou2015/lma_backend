import React, {useState, Component} from 'react';
import 'antd/dist/antd.css';
import { Table,  Button, Popconfirm, Input, InputNumber} from 'antd';
import {Form} from 'antd4'

const Virtual_ID = "VirtualID"

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

class Location extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state= {
            dataSource : this.props.location,
            count: this.props.location.length,
            editingKey: ''
        };
        const formRef = React.createRef();

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                editable: true,

            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                editable: true,

            },
            {
                title: 'DefaultRunningTime',
                dataIndex: 'defaultRunningTime',
                key: 'defaultRunningTime',
                editable: true,


            },
            {
                title: 'DefaultReservationExpireTime',
                dataIndex: 'defaultReservationExpireTime',
                key: 'defaultReservationExpireTime',
                editable: true,
            },
            {
                title: 'DefaultPickupTime',
                dataIndex: 'defaultPickupTime',
                key: 'defaultPickupTime',
                editable: true,

            },
            {
                title: "",
                key: "delete",
                render: (text, record) => (
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
                            <a disabled={this.state.editingKey === Virtual_ID} >Delete</a>
                        </Popconfirm>
                    ) : null

                ),
            },
            {
                title: "",
                key: "edit",
                render: (_, record) => {
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                    <a
                        onClick={() => this.save(record._id)}
                        style={{
                            marginRight: 8,
                        }}
                    >
                      Save
                    </a>

                    <a onClick={() => this.cancel()}>Cancel</a>

                    </span>
                    ) : (
                        <a disabled={this.state.editingKey !== ''} onClick={() => this.edit(record)}>
                            Edit
                        </a>
                    );
                },
            },

        ];
    }

    edit = record => {
        this.formRef.current.setFieldsValue({
            name: '',
            email: '',
            defaultRunningTime: '',
            defaultReservationExpireTime: '',
            defaultPickupTime: '',
            ...record,
        });

        this.setState({
            editingKey: record._id
        });

        //record._id = id; //Cannot be recovered
    };

    isEditing = (record) => {
        return record._id === this.state.editingKey;
    };


    cancel = () => {
        const {dataSource} = this.state;
        this.setState({
            dataSource: dataSource.filter(item => item._id !== Virtual_ID),
            editingKey : ''
        });
    };

    save = async key => {
        try {
            const row = await this.formRef.current.validateFields();
            const newData = [...this.state.dataSource];
            const index = newData.findIndex(item =>  item._id === key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });

                if(key === Virtual_ID){
                    this.handleAdd(newData[index]);
                } else{
                    this.handleSave(newData[index]);
                }
                this.setState({
                    dataSource : newData,
                    editingKey: ''
                });
            } else {
                this.setState({
                    dataSource : newData,
                    editingKey: ''
                });

            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    handleSave = item => {
        const {dataSource} = this.state;
        fetch(`http://lmapp.us-east-2.elasticbeanstalk.com/api/locations/${item._id}`, {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                email: item.email,
                defaultRunningTime: item.defaultRunningTime,
                defaultReservationExpireTime: item.defaultReservationExpireTime,
                defaultPickupTime: item.defaultPickupTime,
            }),
        })
            .then((response) => {
                return response.json();
                //throw new Error(response.msg);
            })
            .then((res) => {
                return (res.isSuccess)
            })
            .catch((err) => console.log(err))
    };

    handleDelete = _id => {
        const {count, dataSource} = this.state;
        // this.setState({
        //     dataSource: dataSource.filter(item => item._id !== _id),
        // });

        fetch(`http://lmapp.us-east-2.elasticbeanstalk.com/api/locations/${_id}`, {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
        })
            .then((response) => {
                return response.json();
                //throw new Error(response.msg);
            })
            .then(() => {
                return this.setState({
                    dataSource: dataSource.filter(item => item._id !== _id),
                    count: count - 1,
                });
            })
            .catch((err) => console.log(err))
    };

    onAdd = () => {
        const {count, dataSource} = this.state;

        const newData = {
            name:"",
            email:"",
            defaultRunningTime: "",
            defaultReservationExpireTime: "",
            defaultPickupTime: "",
            _id : Virtual_ID
        };

        this.setState({
            dataSource:[...dataSource, newData],
            count: count + 1,
        });
        this.edit(newData)
    };

    handleAdd = (newData) => {
        fetch("http://lmapp.us-east-2.elasticbeanstalk.com/api/locations", {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                name: newData.name,
                email: newData.email,
                defaultRunningTime: newData.defaultRunningTime,
                defaultReservationExpireTime: newData.defaultReservationExpireTime,
                defaultPickupTime: newData.defaultPickupTime,
            }),
        })
            .then((response) => {
                //console.log(response.text());
                return response.json();
                //throw new Error(response.msg);
            })
            .then((res) => {
                if(res.isSuccess)
                    newData._id = res.id
                return res.isSuccess
            })
            .catch((err) => console.log(err))
    }




    render() {
        const { dataSource } = this.state;

        const mergedColumns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'name' || col.dataIndex ==='email' ? 'text' : 'number',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        //console.log(this.state.count)
        return (
            <div>
                <Button disabled={this.state.editingKey !== ''} onClick={this.onAdd}
                        type="primary"
                        style={{
                            marginTop:16,
                            marginBottom: 16
                        }}>
                    Add a New Location
                </Button>
                <Form ref={this.formRef} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        rowKey = "_id"
                        dataSource={dataSource}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={{
                            onChange: this.cancel,
                        }}
                    />
                </Form>
            </div>

        );
    };

}
export default Location;