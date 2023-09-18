import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import Doctor from '../components/Doctor';
import { Row, Col } from 'antd';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';


function Home() {

    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/user/get-all-approved-doctors",
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                });
            dispatch(hideLoading());
            if (response.data.success) {
                setDoctors(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <Layout>
            <Row gutter={20}>
                {doctors.map((doctor,index) => (
                    <Col key={index} span={8} xs={24} sm={24} lg={8}>
                        <Doctor doctor={doctor} />
                    </Col>
                ))}
            </Row>
        </Layout>
    )
}

export default Home