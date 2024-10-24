import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Popover, Transition } from '@headlessui/react';
import { HiOutlineBell, HiOutlineChatAlt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import profileImg from '../../assets/profile.jpg';
import headerImg from '../../assets/image (1).png';  // Import the logo
import { FaComment, FaAngleRight, FaUserCircle } from "react-icons/fa";
import { HiOutlineLogout, HiOfficeBuilding } from 'react-icons/hi';

export default function Header() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    // Fetch session notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/Session/sessions/today');
                const data = await response.json();
                setNotifications(data);  // Assuming `data` is an array of notifications
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const handleLogout = () => {
      // Add any logout logic here (like clearing tokens or user data)
      navigate('/signin'); // Navigate to the SignIn page
    };

    return (
        <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-between">
            {/* Add the company logo to the header */}
            <div className="flex items-center gap-4 ml-8">
                <img src={headerImg} alt="Company Logo" className="h-14 w-auto ml-[-17px]" />
                <h1 className="font-semibold text-gray-700" style={{ fontSize: '15px', fontFamily: 'Lato, sans-serif' }}>
                    Management
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
                                    {notifications.length} {/* Show count of notifications */}
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
                                                            <p className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
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

                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="flex items-center focus:outline-none focus:ring-2 focus:ring-neutral-400">
                            <div className="h-10 w-10 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${profileImg})` }}
                            >
                                <span className="sr-only">Open user menu</span>
                            </div>
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-50 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                            <div className="py-1">
                                <h6 className="px-4 py-2 text-sm font-semibold text-gray-700">Rupashree Routray</h6>
                                <p className="px-4 text-sm text-gray-500">rupashreeroutray4gmail.com</p>
                                <p className="px-4 text-sm text-gray-400">Admin</p>
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
                                            href="/settings/"
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
