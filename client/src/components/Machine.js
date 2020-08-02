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
                          res,
                          locationName,
                          ...restProps
                      }) => {

    const inputNode = dataIndex === "machineType" || dataIndex === "isAvailable" || dataIndex == "locationID" ?
        <Select defaultValue={dataIndex === "machineType"?record.machineType: dataIndex==="locationID"?record.locationName:record.isAvailable?"true":"false"} style={{width: 120}}
                                                           onChange={(value, record)=>{
                                                               dataIndex === "machineType"?record.machineType =value:
                                                                   dataIndex === "locationID" ? record.locationID=(value)=>
                                                                   {
                                                                       for(let i =1; i< res.length; i++){
                                                                           if(value=== locationName[i]){
                                                                               return res[i];
                                                                           }
                                                                       }


                                                                   }:record.isAvailable =value;

                                                           }}>

            <Option value={dataIndex === "machineType"?"washer":dataIndex === "isAvailable"?"true":"Sunlight Apartments"}>{dataIndex === "machineType"?"washer":dataIndex === "isAvailable"?"true":"Sunlight Apartments"}</Option>
            <Option value={dataIndex === "machineType"?"dryer":dataIndex ==="isAvailable"?"false" :"East Side Living"}>{dataIndex === "machineType"?"dryer":dataIndex ==="isAvailable"?"false" :"East Side Living" }</Option>
            <Option value={dataIndex === "machineType"?null:dataIndex ==="isAvailable"?null:"Town Place Walkups"}>{dataIndex === "machineType"?null:dataIndex ==="isAvailable"?null:"Town Place Walkups"}</Option>
            {
              locationName.map((loc)=>{
                if(dataIndex === "isAvailable" || dataIndex ==="machineType" || (loc === "Sunlight Apartments" || loc === "East Side Living" || loc === "Town Place Walkups" )){
                    return null;
                }else{
                    return <Option value = {loc}> {loc + ""}</Option>
                }

            })}
        </Select>:
        inputType === 'number' ? <InputNumber /> :  <Input />
       ;
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
        const {locationIDs} = this.props;
        const {locationNames} = this.props;
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
                render:val=>(val?"true":"false")
            },
            {
                title: 'MachineType',
                dataIndex: 'machineType',
                key: 'machineType',
                editable: true,



            },
            {
                title: 'LocationID',
                dataIndex: 'locationID',
                key: 'locationID',
                editable: true,
                render:val=> {
                    console.log(locationNames);
                    console.log(locationIDs);
                    for (let i = 0; i < locationNames.length; i++) {
                        if(locationIDs[i] === val){
                            return locationNames[i]+"";
                        }
                    }
                }
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
            machineType: '',
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
        console.log(dataSource);
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
                    res,
                    locationName
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
                            pagination={{ pageSize: 50  }}
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