import React, {useState,Component} from 'react';
import Box from './Box';
import List from './List';
import {Input, InputNumber, Menu,Select} from "antd";
import { Table,  Button, Popconfirm} from 'antd';
import {Form} from 'antd4'

const { Option } = Select;
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
/*sn: {
    type: String,
        required: true
},
isAvailable: Boolean,
    isReserved: {
    type: Boolean,
default: false
},
//for machine which is not picked up by user who use it
//related function:updateNonPickupMachineStatus
isPickedUp: {
    type: Boolean,
default: true
},
machineType: String, // washer, dryer
    startTime: {
    type: Date,
default: Date.UTC(1970, 0, 1)
},
userID: String,
    userReservedID: String,
    locationID: String,
    scanString: String  //base64(id)*/

function handleChange(value) {
    console.log(`selected ${value}`);
}

class Machine extends Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state= {
            dataSource : this.props.data,
            count: this.props.data.length,
            editingKey: '',
            machine:''

        };
        const formRef = React.createRef();

        this.columns = [
            {
                title: 'SN',
                dataIndex: 'sn',
                key: 'sn',
                editable: true,

            },
            {
                title: 'IsAvailable',
                dataIndex: 'isAvailable',
                key: 'isAvailable',
                editable: true,

            },
            {
                title: 'MachineType',
                dataIndex: 'machineType',
                key: 'machineType',
                editable: true,
                render: (_, record) => {

                    /*const editable = this.isEditing(record);
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
                        <Popconfirm title="Sure to cancel?" onConfirm={this.cancel}>
                          <a>Cancel</a>
                        </Popconfirm>
                        </span>
                    ) : (
                        <a disabled={this.state.editingKey !== ''} onClick={() => this.edit(record)}>
                            Edit
                        </a>
                    );*/
                    const editable = this.isEditing(record);
                    const {machine} = this.state;
                    return editable ?
                        (<Select defaultValue={record.machineType} style={{width: 120}}
                                 onChange={(value, record)=>{
                                     record.machineType =value;

                                 }}>
                            <Option value="washer" >washer</Option>
                            <Option value="dryer" >dryer</Option>
                        </Select>):
                        (<Select defaultValue={record.machineType} style={{width: 120}} onChange={handleChange}>

                        </Select>)

                },

            },
            {
                title: 'LocationID',
                dataIndex: 'locationID',
                key: 'locationID',
                editable: true,
            },
            {
                title: 'UserID',
                dataIndex: 'userID',
                key: 'userID',
                editable: true,
            },
            {
                title: 'UserReservedID',
                dataIndex: 'userReservedID',
                key: 'userReservedID',
                editable: true,
            },
            {
                title: 'ScanString',
                dataIndex: 'scanString',
                key: 'scanString',
                editable: true,
            },
            {
                title: "",
                key: "delete",
                render: (text, record) => (
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record._id)}>
                            <a>Delete</a>
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
                    <Popconfirm title="Sure to cancel?" onConfirm={this.cancel}>
                      <a>Cancel</a>
                    </Popconfirm>
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
        const {machine} = this.state;
        this.formRef.current.setFieldsValue({
            sn: '',
            isAvailable: '',
            machineType: machine,
            locationID: '',
            userID:'',
            userReservedID:'',
            scanString:'',
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
        this.setState({
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

                if(key === "VirtualID"){
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
        fetch(`http://lmapp.us-east-2.elasticbeanstalk.com/api/machines/${item._id}`, {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify({
                sn: item.sn,
                isAvailable: item.isAvailable,
                machineType: item.machineType,
                locationID:item.locationID,
                userID:item.userID,
                userReservedID:item.userReservedID,
                scanString:item.scanString,
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

        fetch(`http://lmapp.us-east-2.elasticbeanstalk.com/api/machines/${_id}`, {
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
            sn: '',
            isAvailable: '',
            machineType: '',
            locationID: '',
            userID:'',
            userReservedID:'',
            scanString:'',
            _id : "VirtualID"
        };

        this.setState({
            dataSource:[...dataSource, newData],
            count: count + 1,
        });
        this.edit(newData)
    };

    handleAdd = (newData) => {
        fetch("http://lmapp.us-east-2.elasticbeanstalk.com/api/machines", {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                sn: newData.sn,
                isAvailable: newData.isAvailable,
                machineType: newData.machineType,
                locationID: newData.locationID,
                userID:newData.userID,
                userReservedID:newData.userReservedID,
                scanString:newData.scanString,
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
        const { data ,location} = this.props;
        const { dataSource } = this.state;

        const mergedColumns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <>
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
                <List data={data}/>
                <Box data={data} location={location}/>
            </>
        );
    }
}

export default Machine;