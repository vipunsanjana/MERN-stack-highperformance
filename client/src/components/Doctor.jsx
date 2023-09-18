import React from 'react'
import { useNavigate } from 'react-router-dom'


function Doctor({doctor}) {

    const navigate = useNavigate();

    return (
        
        <div className="card p-2 cursor-pointer mt-4" onClick={() => navigate(`/book-appoinment/${doctor._id}`)}>
            
            <h1 className="card-title">{doctor.firstName} {doctor.lastName}</h1>
            <hr />
            <p><b>Phone Number : {doctor.phoneNumber}</b></p>
            <p><b>Specialization : {doctor.specialization}</b></p>
            <p><b>Address : {doctor.address}</b></p>
            <p><b>Fee Per Vist : {doctor.feePerConsultation}</b></p>
            <p><b>Timings : {doctor.timings[0]} - {doctor.timings[1]}</b></p>
        </div>
    )
}

export default Doctor