import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DatePicker, TimePicker } from 'antd';
import { Row, Col, Button } from 'antd';
import moment from 'moment';
import toast from 'react-hot-toast'


function BookAppoinment() {

    const [isAvailable, setIsAvailable] = useState(false);
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [doctor, setDoctor] = useState(null);

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/get-doctor-info-by-id", { doctorId: params.doctorId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

            dispatch(hideLoading());
            if (response.data.success) {
                setDoctor(response.data.data);
            }

        } catch (error) {
            dispatch(hideLoading());
        }

    }

    const bookNow = async () => {
        setIsAvailable(false);
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/book-appointment", {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctor,
                userInfo: user,
                date: date,
                time: time,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/');
            } else {
                toast.error("Error booking appointment");
            }

        } catch (error) {
            toast.error("Error booking appointment");
            dispatch(hideLoading());
        }
    }


    const checkAvailability = async () => {

        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/check-booking-availability", {
                doctorId: params.doctorId,
                date: date,
                time: time,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                setIsAvailable(true);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error("Error booking appointment");
            dispatch(hideLoading());
        }
    }



    useEffect(() => {

        getDoctorData();

    }, []);

    return (
        <Layout>
            {doctor && (
                <div>
                    <h1 className=" text-black h2 d-flex">Dr. {doctor.firstName} {doctor.lastName}<p  className=" text-black h5 ml-2 mt-3">MBBS(Sri Lanka)</p> </h1>
                    <hr />
                    <Row gutter={20} className='mt-4 ml-5' align="middle">


                        <Col span={8} sm={24} xs={24} lg={8}>
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/5110/5110947.png"
                                alt=""
                                srcset=""
                                width="100%"
                                height="350"
                                className='mt-4 ml-5'
                            />
                        </Col>

                        <Col span={12} sm={24} xs={24} lg={8} className='ml-5 mt-n5'>
                            <h1 className="normal-text"><b>Timings : {doctor.timings[0]} - {doctor.timings[1]}</b></h1>

                            <p className='mt-n1'>
                                <b>Phone Number : </b>
                                {doctor.phoneNumber}
                            </p>
                            <p className='mt-n3'>
                                <b>Address : </b>
                                {doctor.address}
                            </p>
                            <p className='mt-n3'>
                                <b>Fee Per Visit : </b>
                                {doctor.feePerConsultation}
                            </p>
                            <p className='mt-n3'>
                                <b>Website : </b>
                                {doctor.website}
                            </p>

                            <div className="d-flex flex-column pt-2">
                                <DatePicker
                                    format='DD-MM-YYYY'
                                    onChange={(value) => {
                                        setIsAvailable(false);
                                        setDate(moment(value).format('DD-MM-YYYY'))
                                    }}
                                />
                                <TimePicker
                                    format='HH:mm'
                                    className='mt-3'

                                    onChange={(value) => {
                                        setIsAvailable(false);
                                        console.log(value)
                                        setTime(value.format("HH:mm"))
                                        }
                                    }
                                />

                                {!isAvailable && (
                                    <Button
                                        className='primary-button-two mt-3 full-width-button'
                                        onClick={checkAvailability}
                                    >
                                        Check Availability
                                    </Button>
                                )}

                                {isAvailable && (<Button
                                    className='primary-button-two mt-3 full-width-button'
                                    onClick={bookNow}
                                >
                                    Book Now
                                </Button>)}
                            </div>

                        </Col>

                    </Row>
                </div>
            )}
        </Layout>
    )
}

export default BookAppoinment