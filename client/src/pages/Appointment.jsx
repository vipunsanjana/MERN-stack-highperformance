import Layout from '../components/Layout'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import axios from 'axios';
import { useState } from 'react';
import { Table } from 'antd';

function Appointment() {
    const [ appointment, setAppointment ] = useState([]);
    const dispatch = useDispatch();

    const getAppointmentData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/user/get-appointments-by-user-id", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());

            if (response.data.success) {
                setAppointment(response.data.data);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    }



    const columns = [
        {
            title: "Id",
            dataIndex:"_id",
        },
        {
            title: 'Doctor',
            dataIndex: "name",
            render: (text, record) => (
                <h1 className="normal-text">{record.doctorInfo.firstName} {record.doctorInfo.lastName}</h1>
            ),
        },
        {
            title: 'Phone Number',
            dataIndex: "phoneNumber",
            render: (text, record) => (
                <h1 className="normal-text">{record.doctorInfo.phoneNumber}</h1>
            ),
        },
        {
            title: 'Date',
            dataIndex: "date",
            render: (text, record) => (
                <span>
                    {record.date}
                </span>
            ),
        },
        {
            title: 'Time',
            dataIndex: "time",
            render: (text, record) => (
                <span className='mr-2'>
                    {record.time}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: "status",
        },
    ];

    useEffect(() => {
        getAppointmentData();
    }, []);

    return (
        <Layout>
            <h1 className="page-title">Appointments</h1>
            <hr />
            <Table columns={columns} dataSource={appointment} />
        </Layout>
    )
}

export default Appointment