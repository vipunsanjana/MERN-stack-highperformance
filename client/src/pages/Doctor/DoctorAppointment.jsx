import Layout from '../../components/Layout'
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import axios from 'axios';
import { useState } from 'react';
import { Table } from 'antd';
import toast from 'react-hot-toast';

function DoctorAppointment() {
    const [ appointment, setAppointment ] = useState([]);
    const dispatch = useDispatch();

    const getDoctorAppointmentData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.get("/api/doctor/get-appointments-by-doctor-id", {
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

    const changeAppointmentStatus = async (record, status) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/change-appointment-status",{appointmentId: record._id, status: status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());

            if (response.data.success) {
                toast.success(response.data.message);
                getDoctorAppointmentData();
            }
        } catch (error) {
            toast.error("something went wrong.");
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
            title: 'Patient',
            dataIndex: "name",
            render: (text, record) => (
                <h1 className="normal-text">{record.userInfo.name}</h1>
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
                <span className="ant-table-cell-one">
                    {record.time}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: "status",
        },
        {
            title: 'Actions',
            dataIndex: "actions ",
            render: (text, record) => (
                <div className="d-flex ml-5">
                    {record.status === "pending" && (
                        <div className='d-flex'>
                            <h1 className='anchor mr-4 ml-2' onClick={() => {changeAppointmentStatus(record,'approved')}}>Approve</h1>
                            <h1 className='anchor ml-4' onClick={() => {changeAppointmentStatus(record,'rejected')}}>Block</h1>
                        </div>    
                    )}
                </div>
                
            ),
            align: 'center', 
            className: 'column-header ml-5',
            justify:"center"
        },
    ];

    useEffect(() => {
        getDoctorAppointmentData();
    }, []);

    return (
        <Layout>
            <h1 className="page-title">Appointments</h1>
            <hr />
            <Table columns={columns} dataSource={appointment} />
        </Layout>
    )
}

export default DoctorAppointment