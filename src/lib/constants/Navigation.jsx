import {
	HiOutlineViewGrid,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog,
	HiOutlineDocumentReport
	
} from 'react-icons/hi'
import {
	// MdApartment,
	// MdWorkOutline,
	// MdSpeed,
	MdEventNote

 } from 'react-icons/md';
 import { 
	FaUserTie,
	FaAward,
	FaMoneyBillWave 
} from 'react-icons/fa';

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: 'dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'mysession',
		label: 'HR Session',
		path: '/mysession',
		icon: <MdEventNote />
	},
	// {
	// 	key: 'departments',
	// 	label: 'Departments',
	// 	path: '/Departments',
	// 	icon: <MdApartment />
	// },
	// {
	// 	key: 'projects',
	// 	label: 'Projects',
	// 	path: '/Projects',
	// 	icon: <MdWorkOutline />
	// },
	// {
	// 	key: 'performance parameters',
	// 	label: 'Performance Parameters',
	// 	// path: '/Velocity',
	// 	icon: <MdSpeed />
	// },
	{
		key: 'employee',
		label: 'Employees',
		path: '/Employee',
		icon: <FaUserTie />
	},
    {
		key: 'sessions',
		label: 'Sessions',
		path: '/Sessions',
		icon: <MdEventNote />
	},
    {
		key: 'rewards',
		label: 'Rewards',
		path: '/Rewards',
		icon: <FaAward />
	},
    {
		key: 'withdraw requests',
		label: 'Withdraw Requests',
		path: '/WithdrawaRequest',
		icon: <FaMoneyBillWave />
	},
    {
		key: 'reports',
		label: 'Reports',
		path: '/Report',
		icon: <HiOutlineDocumentReport />
	},
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/Setting',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		// path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
