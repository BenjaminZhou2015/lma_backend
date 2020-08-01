import React, { useEffect, useState } from "react";
import { API_ROOT } from '../constants';
import { Table, Popconfirm, Button, Divider, Space, Drawer, Form, InputNumber, Select, Switch, Radio, Row, Col, notification } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import request from "umi-request";
import {useForm} from "antd/es/form/Form";

const { Option } = Select;

const MachineList = () => {
    const [ data, setData ] = useState();
    const [ visible, setV ] = useState(false);
    const [ machine, setMachine ] = useState({});
    const [ users, setUsers ] = useState([]);
    const [ locations, setLocations ] = useState([]);
    const [ form ] = useForm();
    useEffect(() => {
        request(`${API_ROOT}/users`)
            .then(
                response => {
                    const { users } = response;
                    setUsers(users);
                }
            )
        request(`${API_ROOT}/locations`)
            .then(
                response => {
                    const { locations } = response;
                    setLocations(locations);
                }
            )
    }, []);
    useEffect(() => {
        request(`${API_ROOT}/machines`)
            .then(
                response => {
                    const { machines } = response;
                    setData(machines);
                }
            )
    }, [visible, users, locations]);
    useEffect(() => {
        form.resetFields();
    }, [machine]);
    const columns = [
        {
            title: 'Serial Number',
            dataIndex: 'sn',
            key: 'sn',
            editable: true,
        },
        {
            title: 'LocationID',
            dataIndex: 'locationID',
            key: 'locationID',
            editable: true,

        },
        {
            title: 'Start time',
            dataIndex: 'startTime',
            key: 'startTime',
            editable: true,
            render: date => new Date(date).toLocaleString()
        },
        {
            title: 'Available',
            dataIndex: 'isAvailable',
            key: 'isAvailable',
            editable: true,
            render: isAvailable => isAvailable ? <CheckCircleTwoTone twoToneColor="#52c41a"/> :  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
        },
        {
            title: 'Reserved',
            dataIndex: 'isReserved',
            key: 'isReserved',
            editable: true,
            render: isAvailable => isAvailable ? <CheckCircleTwoTone twoToneColor="#52c41a"/> :  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
        },
        {
            title: 'Picked up',
            dataIndex: 'isPickedUp',
            key: 'isPickedUp',
            editable: true,
            render: isAvailable => isAvailable ? <CheckCircleTwoTone twoToneColor="#52c41a"/> :  <CloseCircleTwoTone twoToneColor="#eb2f96"/>
        },
        {
            title: 'Type',
            dataIndex: 'machineType',
            key: 'machineType',
            editable: true,
        },
        {
            title: 'Using by',
            dataIndex: 'userID',
            key: 'userID',
            editable: true,
        },
        {
            title: 'Reserved by',
            dataIndex: 'userReservedID',
            key: 'userReservedID',
            editable: true,
        },
        {
            title: "Actions",
            key: "op",
            render: (_, record) => {
                return (
                    <Space size="small">
                        <Button type="link" onClick={() => {setV(true); setMachine(record);}}>
                            edit
                        </Button>
                        <Divider type="vertical" />
                        <Popconfirm title="Sure to delete?" onConfirm={() => {
                            request(`${API_ROOT}/machines/${record._id}`, {
                                method: 'DELETE'
                            }).then(
                                response => {
                                    notification.success({
                                        message: response.msg,
                                        description: "Deleted"
                                    })
                                }
                            ).catch(
                                err => {
                                    notification.success({
                                        message: err.msg,
                                        description: err
                                    })
                                }
                            );
                        }}>
                            <Button danger type="link">delete</Button>
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ];
    return (
        <>
            <Button
                type="primary"
                style={{
                    marginTop:16,
                    marginBottom: 16
                }}
                onClick={() => {
                    setMachine({});
                    setV(true);
                }}
            >
                Add a machine
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                rowKey="_id"
            />
            <Drawer
                title="Add/Modify machine"
                visible={visible}
                closable
                width={720}
                mask
                maskClosable
                onClose={() => {setV(false); setMachine({});}}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={() => setV(false)} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form
                    layout="vertical"
                    form={form}
                    initialValues={machine}
                    onFinish={values => {
                        if (machine._id) {
                            request(`${API_ROOT}/machines/${machine._id}`, {
                                method: 'PUT',
                                data: {
                                    ...values
                                }
                            }).then(
                                response => {
                                    notification.success({
                                        message: response.msg,
                                        description: "Updated"
                                    })
                                }
                            );
                        } else {
                            request(`${API_ROOT}/machines`, {
                                method: 'POST',
                                data: {
                                    ...values
                                }
                            });
                        }
                        setMachine({});
                        setV(false);
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Serial Number"
                                name="sn"
                                required
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                required
                                label="Type"
                                name="type"
                            >
                                <Radio.Group >
                                    <Radio value="washer">washer</Radio>
                                    <Radio value="dryer">dryer</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                required
                                label="isAvailable"
                                name="isAvailable"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                required
                                label="isReserved"
                                name="isReserved"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                required
                                label="isPickedUp"
                                name="isPickedUp"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        required
                        label="Location"
                        name="locationID"
                    >
                        <Select>
                            {locations.map(location => <Option key={location._id} value={location._id}>{location.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Using by"
                        name="userID"
                    >
                        <Select>
                            {users.map(user => <Option key={user._id} value={user._id}>{user.email}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Reserved by"
                        name="userReservedID"
                    >
                        <Select>
                            {users.map(user => <Option key={user._id} value={user._id}>{user.email}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    )
};

export default MachineList;
