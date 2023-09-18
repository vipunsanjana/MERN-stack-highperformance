import { Tabs } from 'antd'
import Layout from '../components/Layout'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast'
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';

function Notifications() {

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();


    const markAllAsSeen = async() => {

        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/mark-all-notifications-as-seen", { userId: user._id },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            toast.error("smething went wrong.");
        }
    }
    const deleteAll = async() => {

        try {
            dispatch(showLoading());
            const response = await axios.post("/api/user/delete-all-notifications", { userId: user._id },{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(hideLoading());
            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setUser(response.data.data));
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
            <h1 className='page-title'>Notifications</h1>
            <hr />

            <Tabs>
                <Tabs.TabPane tab="Unseen" key={0}>
                    <div className="d-flex justify-content-end">
                        <h1 className="anchor" onClick={()=>{markAllAsSeen()}} >Mark all as seen</h1>
                    </div>

                    {user?.unseenNotifications.map((notification,index) => (
                        <div className='card p-2 mt-2' key={index} onClick={() => {
                            console.log("Clicked notification:", notification);
                            navigate(notification.onClickPath);
                        }}>
                            <div className="card-text mt-2">{notification.message}</div>
                        </div>
                    ))}

                </Tabs.TabPane>
                <Tabs.TabPane tab="seen" key={1}>
                    <div className="d-flex justify-content-end">
                        <h1 className="anchor" onClick={()=>{deleteAll()}} >Delete all</h1>
                    </div>
                    
                    {user?.seenNotifications.map((notification,index) => (
                        <div className='card p-2 mt-2' key={index}>
                            <div className="card-text mt-2">{notification.message}</div>
                        </div>

                    ))
                    }
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    )
}

export default Notifications

// import { Tabs } from 'antd';
// import Layout from '../components/Layout';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { hideLoading, showLoading } from '../redux/alertsSlice';
// import { setUser } from '../redux/userSlice';

// function Notifications() {
//     const navigate = useNavigate();
//     const { user } = useSelector((state) => state.user);
//     const dispatch = useDispatch();

//     const markAllAsSeen = async () => {
//         try {
//             dispatch(showLoading());
//             const response = await axios.post("/api/user/mark-all-notifications-as-seen", { userId: user._id });
//             dispatch(hideLoading());
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 // Refresh the page after marking notifications as seen
//                 dispatch(setUser(response.data.data));
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             dispatch(hideLoading());
//             toast.error("Something went wrong.");
//         }
//     }

//     return (
        // <Layout>
//             <h1 className='page-title'>Notifications</h1>
//             <Tabs>
//                  <Tabs.TabPane tab="Unseen" key={0}>
//                     <div className="d-flex justify-content-end">
//                         <h1 className="anchor" onClick={() => markAllAsSeen()}>Mark all as seen</h1>
//                     </div>
//                     {user && user.unseenNotifications ? (
//                         user.unseenNotifications.map((notification, index) => (
//                             <React.Fragment key={index}>
//                                 <div className='card p-2' onClick={() => navigate(notification.onClickPath)}>
//                                     <div className="card-text">{notification.message}</div>
//                                 </div>
//                                 {index < user.unseenNotifications.length - 1 && <br />} {/* Add line break if not the last item */}
//                             </React.Fragment>
//                         ))
//                     ) : (
//                         <p>Loading...</p>
//                     )}

//                 </Tabs.TabPane>
//                 <Tabs.TabPane tab="seen" key={1}>
//                     <div className="d-flex justify-content-end">
//                         <h1 className="anchor">Delete all</h1>
//                     </div>
//                 </Tabs.TabPane>
//             </Tabs>
//         </Layout>
//     );
// }

// export default Notifications;
