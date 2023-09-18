import DoctorForm from '../../components/DoctorForm';
import Layout from '../../components/Layout';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { hideLoading, showLoading } from '../../redux/alertsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';



function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [doctor, setDoctor] = useState(null);
    const { user } = useSelector((state) => state.user);

    const onFinish = async (values) => {
        

        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/update-doctor-profile", { ...values, userId: user._id, timings: [
                // moment(values.timings[0]).format("HH:mm"),
                // moment(values.timings[1]).format("HH:mm")
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

    const getDoctorData = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post("/api/doctor/get-doctor-info-by-user-id", {userId: params.userId},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
    
            dispatch(hideLoading());
            if(response.data.success){
                setDoctor(response.data.data);
            }
            
        } catch (error) {
            dispatch(hideLoading());
        }

    }
    useEffect(() => {

        getDoctorData();
        
    },[]);

    return (
        <Layout>
            <h1 className="page-title">Doctor Profile</h1>
            <hr />
            {doctor && <DoctorForm onFinish={onFinish} initivalValues={doctor} />}
        </Layout>
    )
}

export default Profile