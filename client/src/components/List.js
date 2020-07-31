import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Descriptions} from 'antd';



class List extends Component{


    render() {
        const { data } = this.props;
        let availableMachines = 0;
        data.map((dat) => {
            if(dat.isAvailable) {
                availableMachines += 1;
            }
            return null;
            }
        )

        return (
                <>
                    <Descriptions title="Statistics">
                        <Descriptions.Item label="Washer & Dryer">{data.length}</Descriptions.Item>
                        <Descriptions.Item label="Available Machines">{availableMachines}</Descriptions.Item>
                    </Descriptions>,




                </>

            )


    }

}
export default List;