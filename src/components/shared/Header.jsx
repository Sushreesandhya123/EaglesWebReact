import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import { HiOutlineBell, HiOutlineChatAlt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import profileImg from '../../assets/profile.jpg';
import headerImg from '../../assets/logo.png';  // Import the logo
import { FaComment, FaAngleRight, FaUserCircle, FaHeart } from "react-icons/fa";
import { HiOutlineLogout, HiOfficeBuilding } from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
 
export default function Header() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const token = localStorage.getItem('token');
    const empId = localStorage.getItem('emp_id');
    const orgId = localStorage.getItem('org_id');
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (role === 'Manager') {
                    const response = await fetch('http://127.0.0.1:8000/Session/sessions/today');
                    const data = await response.json();
                    setNotifications(data);  
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [role]);
 
    // Fetch employee details along with org_name
    const fetchEmployeeDetails = async () => {
        if (!token) {
            setError("Session expired. Please log in again.");
            return;
        }
 
        try {
            const response = await fetch(`http://localhost:8000/Employee/get_employee_id/?emp_id=${empId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                const message = errorData.message || 'Failed to fetch employee details. Please try again.';
                throw new Error(message);
            }
 
            const data = await response.json();
            setFullName(data.employee_name);
            setEmail(data.employee_email);
            setRole(data.employee_role);
            setOrgName(data.org_name || localStorage.getItem('org_name')); 
        } catch (error) {
            setError(error.message);
            console.error('Failed to fetch employee details:', error);
        }
    };
 
   
 
    useEffect(() => {
        // Retrieve the data from localStorage
        const storedOrgName = localStorage.getItem('org_name');
        const storedFullName = localStorage.getItem('full_name');
        const storedEmail = localStorage.getItem('email');
        const storedRole = localStorage.getItem('role');
    
        if (storedOrgName) setOrgName(storedOrgName);
        if (storedFullName) setFullName(storedFullName);
        if (storedEmail) setEmail(storedEmail);
        if (storedRole) setRole(storedRole);
    
        // If employee data is not in localStorage, fetch it using empId
        if (empId && !storedFullName) {
            fetchEmployeeDetails();
        }
    }, [empId]);
    
 
    const handleLogout = () => {
        Cookies.remove('access_token'); // Remove token from cookies
        localStorage.clear(); // Clear all data from local storage
        navigate('/signin');
        toast.info('Logged out successfully', { position: 'top-right' });
    };
 
    const getInitials = (name) => {
        const nameArray = name.split(' ');
        return nameArray.length >= 2
            ? `${nameArray[0][0]}${nameArray[1][0]}`.toUpperCase()
            : nameArray[0][0].toUpperCase();
    };
 
    return (
        <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
            {/* Add the company logo to the header */}
            <div className="flex items-center gap-4 ml-8">
                <img src={headerImg} alt="Company Logo" className="h-14 w-auto " />
                <h1 className="font-semibold text-gray-700" style={{ fontSize: '15px', fontFamily: 'Lato, sans-serif' }}>
                    {orgName || 'Organization Name'}  {/* Display the organization name dynamically */}
                </h1>
            </div>
 
            <div className="flex items-center gap-2 mr-2">
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(
                                    open && 'bg-gray-100',
                                    'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                                )}
                            >
                                <HiOutlineChatAlt fontSize={24} />
                            </Popover.Button>
                            {/* Messages popover here */}
                        </>
                    )}
                </Popover>
 
                {role === 'Manager' && (  // Only show bell icon and notifications for Managers
                    <Popover className="relative">
                        {({ open }) => (
                            <>
                                <Popover.Button
                                    className={classNames(
                                        open && "bg-gray-100",
                                        "group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                                    )}
                                >
                                    <HiOutlineBell fontSize={24} />
                                    <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-green-600 text-xs text-white rounded-full">
                                        {notifications.length} 
                                    </span>
                                </Popover.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-1"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 translate-y-1"
                                >
                                    <Popover.Panel className="absolute right-0 z-10 mt-2.5 transform w-80">
                                        <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                                            <strong className="text-gray-700 font-medium">Notifications</strong>
                                            <div className="mt-2 py-1 text-sm">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notification, index) => (
                                                        <div key={index} className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md">
                                                            <FaComment className="text-green-600" />
                                                            <div>
                                                                <p className="text-gray-700">{notification.session_name} created by HR Admin</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {format(new Date(notification.start_date), 'PPP')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-center">No new notifications</p>
                                                )}
                                            </div>
                                            <a
                                                href="#"
                                                className="block text-center text-gray-700 py-2 bg-gray-100 hover:bg-gray-200"
                                            >
                                                See all notifications <FaAngleRight className="inline" />
                                            </a>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </>
                        )}
                    </Popover>
                )}
                <Menu as="div" className="relative inline-block text-left">
                <div className="flex items-center">
                       
                        <Menu.Button className="ml-2 text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-400 w-8 h-8 rounded-full bg-[#c3b7a4] flex items-center justify-center ">
                        {getInitials(fullName || 'User')}
                        </Menu.Button>
                    </div>
 
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 w-[14rem]">
                            <div className="py-1">
                                 <h6 className="px-4 py-2 text-sm font-semibold text-gray-700">{fullName || 'Unknown User'}</h6>
                                <p className="px-4 text-sm text-gray-500">{email || 'No email available'}</p>
                                <p className="px-4 text-sm text-gray-400">{role || 'No role specified'}</p>  
                                <div className="border-t border-gray-200 my-2"></div>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/profile/"
                                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                        >
                                            <FaUserCircle className="inline mr-2" /> My Profile
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/organisationprofile/"
                                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                        >
                                            <HiOfficeBuilding className="inline mr-2" /> Organization Profile
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            onClick={handleLogout}
                                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                                        >
                                            <HiOutlineLogout className="inline mr-2" /> Logout
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}
 