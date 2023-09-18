import React, { useState } from 'react';
import '../layout.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Badge } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.user);
    //console.log(user);
    const location = useLocation();
    const navigate = useNavigate();

    const userMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-8-fill"
        },
        {
            name: "Appointments",
            path: "/appointment",
            icon: "ri-file-list-3-fill"
        },
        {
            name: "Apply-Doctor",
            path: "/apply-doctor",
            icon: "ri-hospital-fill"
        },
        {
            name: "Notifications",
            path: "/notifications",
            icon: "ri-notification-3-fill"
        },
    ];

    // Define doctorMenu conditionally
    let doctorMenu = [];
    if (user && user._id) {
        doctorMenu = [
            {
                name: "Home",
                path: "/",
                icon: "ri-home-8-fill"
            },
            {
                name: "Appointments",
                path: "/doctor/appointment",
                icon: "ri-file-list-3-fill"
            },
            {
                name: "Profile",
                path: `/doctor/profile/${user._id}`,
                icon: "ri-user-2-fill"
            },
            {
                name: "Notifications",
                path: "/notifications",
                icon: "ri-notification-3-fill"
            },
        ];
    }

    const adminMenu = [
        {
            name: "Home",
            path: "/",
            icon: "ri-home-8-fill"
        },
        {
            name: "Users",
            path: "/admin/userslist",
            icon: "ri-user-2-fill"
        },
        {
            name: "Doctors",
            path: "/admin/doctorslist",
            icon: "ri-user-star-line"
        },
        {
            name: "Notifications",
            path: "/notifications",
            icon: "ri-notification-3-fill"
        }
    ];

    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu;
    const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

    return (
        <div className="main">
            <div className="d-flex layout">
                <div className="sidebar">
                    <div className="sidebar-header">
                        <h1 className='logo'>MEDI-care</h1>
                        <h1 className='logo h4 text-sm'>Hospital</h1>
                        <h1 className="role">{role}</h1>
                    </div>

                    <div className="menu">
                        {menuToBeRendered.map((menu, index) => {
                            const isActive = location.pathname === menu.path;
                            return (
                                <div key={index} className={`d-flex menu-item ${isActive && 'active-menu-item'}`}>
                                    <i className={menu.icon}></i>
                                    {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                                </div>
                            );
                        })}
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}>
                            <i className="ri-logout-box-fill"></i>
                            {!collapsed && <Link to="/login">Logout</Link>}
                        </div>
                    </div>
                </div>

                <div className="content">
                    <div className="header">
                        {collapsed ? (<i className="ri-menu-line header-action-icons" onClick={() => setCollapsed(false)}></i>) : (<i className="ri-close-circle-fill header-action-icons" onClick={() => setCollapsed(true)}></i>)}

                        <div className="d-flex align-items-center px-4">
                            <Badge count={user?.unseenNotifications.length} onClick={() => { navigate("/notifications") }}>

                                <i className="ri-notification-3-fill header-action-icons px-3"></i>

                            </Badge>

                            {/* <Link to="/profile" className="anchor mx-3">{user?.name}</Link> */}
                            <h1 className="text-white h2 mx-3 mt-2">{user?.name}</h1>
                        </div>

                    </div>

                    <div className="bodys">
                        <h1 className="text-black font-weight-bolder h4 text-sm">You can get best doctors..Try now..</h1>
                        <hr className='font-weight-bolder' />
                        {children}


                    </div>
                    
                        <div className="container" style={{height:"10px"}}>
                            <p className='text-white'>&copy; 2023 Lovely <HeartOutlined className='black ml-1 mr-1' /> Web Development By Vipun Sanjana .</p>
                        </div>
                    

                </div>
            </div>

        </div>
    )
}

export default Layout;
