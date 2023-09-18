import React from 'react'
import { Button, Form, Input } from 'antd';
import { Link , useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../redux/alertsSlice';


function Register() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/register",values);
            dispatch(hideLoading());
            if(response.data.success){
                toast.success(response.data.message);
                navigate("/login");
            }else{
                toast.success(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("smething went wrong.");
        }
    }

    return (
        <div className="authentication">

            <div className="authentication-form card p-3">

                <h1 className='card-title'>Nice To Meet U</h1>

                <Form layout='vertical' onFinish={onFinish}>

                    <Form.Item label="Name" name="name">
                        <Input placeholder='Name' />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input placeholder='Password' />
                    </Form.Item>

                    <Button className='primary-button mt-3' htmlType='submit'>REGISTER</Button>

                    <Link to="/login" className='anchor mt-2'>I HAVE A ACCOUNT.LOGIN NOW...</Link>

                </Form>

            </div>

        </div>
    )
}

export default Register