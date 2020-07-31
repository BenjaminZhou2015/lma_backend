import React, { Component } from 'react';
import { Row, Col, Divider } from 'antd';
import '../index.css';
import 'antd/dist/antd.css';

const style = { background: '#0092ff', padding: '8px 0' };


class Box extends Component{


    render() {
        const { data } = this.props;
        return (
            <>
                <Divider orientation="middle" style={{ color: '#333', fontWeight: 'normal',fontSize:30 }}>
                    live status
                </Divider>
                <Row gutter={[16, 24]}>
                    {data.length <= 0
                        ? 'NO DB ENTRIES YET'
                        : data.sort((dat)=>dat.machineType==="washer"?-1:1).map((dat) => (

                            <Col className="gutter-row" span={6}>
                                <div style={
                                    {...style,
                                        backgroundColor:dat.isAvailable?'#98FB98':'#87CEFA',
                                        color:'black',

                                        width:300,
                                        height:100,
                                        margin:10,

                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        fontSize:20

                                    }}> {dat.machineType+" "+dat.sn} </div>
                            </Col>

                        ))}


                </Row>
        </>
        );

    }

}
export default Box;