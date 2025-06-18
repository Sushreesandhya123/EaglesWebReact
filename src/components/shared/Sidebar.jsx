import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineLogout, HiMenuAlt3 } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants/Navigation';
import logoFull from '../../assets/eagleslogo.png';
import logoSmall from '../../assets/eaglesfav.png';

const linkClass = 'flex items-center gap-3 px-4 py-3 hover:bg-[#c3b7a4] hover:text-white active:bg-[#c3b7a4] hover:no-underline rounded-lg text-base font-medium';

export default function Sidebar() {
    const [open, setOpen] = useState(true);
    const [role, setRole] = useState(null);
    const { pathname } = useLocation();

    useEffect(() => {
        setRole(localStorage.getItem('role'));
    }, []);

    const filteredLinks = DASHBOARD_SIDEBAR_LINKS.filter(link => {
        if (role === 'HR Admin') return link.key !== 'sessions' && link.key !== 'dashboard';
        if (role === 'Manager') return ['dashboard', 'sessions', 'sessionentry', 'report'].includes(link.key);
        if (role === 'Member') return ['dashboard', 'withdrawrequests'].includes(link.key);
        return false;
    });

    return (
        <div className={`bg-white ${open ? 'w-72' : 'w-20'} duration-300 p-2 flex flex-col relative`}>
            <HiMenuAlt3
                className={`text-black text-3xl absolute -right-8 top-4 cursor-pointer ${!open && 'rotate-180'}`}
                onClick={() => setOpen(!open)}
            />
            <div className="flex items-center py-3">
                <img 
                    src={open ? logoFull : logoSmall}
                    alt="Logo"
                    className="h-14 w-auto"
                />
            </div>
            <div className="flex flex-1 flex-col gap-1">
                {filteredLinks.map((link) => (
                    <Link key={link.key} to={link.path} className={linkClass}>
                        <span className="text-2xl">{link.icon}</span>
                        {open && <span>{link.label}</span>}
                    </Link>
                ))}
            </div>
            {/* <div className="flex flex-1 flex-col gap-1">
                {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} open={open} />
                ))}
            </div> */}
            <div className="flex flex-col gap-1 pt-4 border-t border-[#c3b7a4]">
            {role === 'HR Admin' && DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
                    <Link key={link.key} to={link.path} className={linkClass}>
                        <span className="text-2xl">{link.icon}</span>
                        {open && <span>{link.label}</span>}
                    </Link>
                ))}
                <div className={classNames(linkClass, 'cursor-pointer text-black')}>
                    <span className="text-2xl">
                        <HiOutlineLogout />
                    </span>
                    {open && <span className="ml-4">Logout</span>}
                </div>
            </div>
        </div>
    );
}

function SidebarLink({ link, open }) {
    const { pathname } = useLocation();

    return (
        <Link
            to={link.path}
            className={classNames(
                pathname === link.path ? 'bg-[#c3b7a4] text-black' : 'text-black',
                linkClass,
                !open && 'justify-center'
            )}
        >
            <span className="text-2xl">{link.icon}</span>
            {open && <span className="ml-4">{link.label}</span>}
        </Link>
    );
}
