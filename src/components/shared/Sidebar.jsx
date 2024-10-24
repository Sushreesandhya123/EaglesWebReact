import React, { useState } from 'react';
import classNames from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineLogout, HiMenuAlt3 } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../../lib/constants/Navigation';
import logoFull from '../../assets/eagleslogo.png';
import logoSmall from '../../assets/eaglesfav.png';

const linkClass = 'flex items-center gap-3 px-4 py-3 hover:bg-[#c3b7a4] hover:text-white active:bg-[#c3b7a4] hover:no-underline rounded-lg text-base font-medium';

export default function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <div className={`bg-white ${open ? 'w-72' : 'w-20'} duration-300 p-2 flex flex-col relative`}>
            {/* Sidebar Toggle Button */}
            <HiMenuAlt3
                className={`text-black text-3xl absolute -right-8 top-4 cursor-pointer ${!open && 'rotate-180'}`}
                onClick={() => setOpen(!open)}
            />

            {/* Sidebar Header */}
            <div className="flex items-center py-3">
                <img 
                    src={open ? logoFull : logoSmall}
                    alt="Logo"
                    className="h-14 w-auto"
                />
            </div>

            {/* Sidebar Links */}
            <div className="flex flex-1 flex-col gap-1">
                {DASHBOARD_SIDEBAR_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} open={open} />
                ))}
            </div>

            {/* Bottom Links */}
            <div className="flex flex-col gap-1 pt-4 border-t border-[#c3b7a4]">
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
                    <SidebarLink key={link.key} link={link} open={open} />
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
