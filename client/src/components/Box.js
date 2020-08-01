import React, { Component } from 'react';
import { Row, Col, Divider } from 'antd';
import '../index.css';
import 'antd/dist/antd.css';

const style = { background: '#0092ff', padding: '8px 0' };



class Box extends Component{

    render() {
        const { data,location } = this.props;
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
        //res.map((dat))
        const getRow=(data, element)=>{
            return <Row gutter={[16, 24]}>
                {data.length <= 0
                    ? 'NO DB ENTRIES YET'
                    : data.sort((a,b)=>a.machineType===b.machineType?a.sn < b.sn?-1:1:a.machineType==="washer"?-1:1).map((dat) => (
                        dat.locationID == res[element]?
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
                            </Col>:null

                    ))}


            </Row>
        }


        return (
            <>

                <div>
                    {index.map((ele)=>(
                        <div>
                            <Divider orientation="middle" style={{ color: '#333', fontWeight: 'normal',fontSize:30, height:50,justifyContent: 'center', alignItems: 'center'}}>
                                {"location:"+ele}
                            </Divider>
                            {getRow(data,ele)}
                        </div>
                    ))}
                </div>
            </>
        );

    }

}
export default Box;