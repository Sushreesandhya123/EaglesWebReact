 import { 
	FaHome,
	FaChalkboardTeacher,
	FaUsers,
	FaAward,
	FaFileAlt,
	FaWallet,
	FaCog,
	FaQuestionCircle,
} from 'react-icons/fa';

export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: 'dashboard',
		icon: <FaHome />
	},
	{
		key: 'hrdashboard',
		label: 'HR Dashboard',
		path: 'hrdashboard',
		icon: <FaHome />
	},
	{
		key: 'mysession',
		label: 'HR Session',
		path: '/mysession',
		icon: <FaChalkboardTeacher />
	},

	{
		key: 'employee',
		label: 'Employees',
		path: '/Employee',
		icon: <FaUsers/>
	},
    {
		key: 'sessions',
		label: 'Sessions',
		path: '/Sessions',
		icon: <FaChalkboardTeacher />
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
		icon: <FaWallet />
	},
    {
		key: 'reports',
		label: 'Reports',
		path: '/Report',
		icon: <FaFileAlt />
	},
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/Setting',
		icon: <FaCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		// path: '/support',
		icon: <FaQuestionCircle />
	}
]


