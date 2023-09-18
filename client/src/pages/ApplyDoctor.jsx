import React from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';
import DoctorForm from '../components/DoctorForm'



function ApplyDoctor() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const onFinish = async (values) => {
        console.log(values)
        console.log(values.timings.map(momentObject => momentObject.format("HH:mm"))[0]);
        console.log(values.timings.map(momentObject => momentObject.format("HH:mm"))[1]);
        
        //const dateString = "Sun Sep 17 2023 05:40:10 GMT+0530 (India Standard Time)";

        // Parse the date string using a format string
        // const momentObject = moment(dateString, "ddd MMM DD YYYY HH:mm:ss ZZ");
        
        // Extract hours and minutes
        // const hours = momentObject.hours();
        // const minutes = momentObject.minutes();
        
        // console.log("Hours:", hours);
        // console.log("Minutes:", minutes);
        




        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/apply-doctor-account", { ...values, userId: user._id,timings: [
                values.timings.map(momentObject => momentObject.format("HH:mm"))[0],
                values.timings.map(momentObject => momentObject.format("HH:mm"))[1]
            ] }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                navigate("/");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("smething went wrong.");
        }
    }

    return (
        <Layout>
            <h1 className='page-title'>Apply Doctor</h1>
            <hr />
            {/* <Form layout='vertical' onFinish={onFinish}>
                <h1 className="card-title mt-3">Persanal Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="First Name" name="firstName" rules={[{ required: true }]}>
                            <Input placeholder='First Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Last Name" name="lastName" rules={[{ required: true }]}>
                            <Input placeholder='Last Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                            <Input placeholder='Phone Number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Website" name="website" rules={[{ required: true }]}>
                            <Input placeholder='Website' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Address" name="address" rules={[{ required: true }]}>
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>
                </Row>
                <hr />
                <h1 className="card-title mt-3">Professional Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Specialization" name="specialization" rules={[{ required: true }]}>
                            <Input placeholder='Specialization' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Experience" name="experience" rules={[{ required: true }]}>
                            <Input placeholder='Experience' type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Fee Per Consultation" name="feePerConsultation" rules={[{ required: true }]}>
                            <Input placeholder='Fee Per Consultation' type='number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Timings" name="timings" rules={[{ required: true }]}>
                            <TimePicker.RangePicker />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end">
                    <Button className='primary-button-one' htmlType='submit'>APPLY</Button>
                </div>
            </Form> */}

            <DoctorForm onFinish={onFinish} />

        </Layout>
    )
}

export default ApplyDoctor