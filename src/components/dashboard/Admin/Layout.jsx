import React from 'react'
import MainLayout from '../../common/Layout/MainLayout2'
import dashboard from "../../../images/SideBar/dashboard.svg"
import tickets from "../../../images/SideBar/invoice.svg"
import blogs from "../../../images/SideBar/jobpostings.svg"
import tickets_active from "../../../images/SideBar/invoice-active.svg"
import dashboard_active from "../../../images/SideBar/dashboard-active.svg"
import blogs_active from "../../../images/SideBar/jobpostings-active.svg"
import money_bag from "../../../images/Client/money bag.svg"

const Layout = ({ children, defaultSelectedKey }) => {
	const cilentoptions = [
		{
			"key": 1,
			"label": "Dashboard",
			"logo": dashboard,
			"active_logo": dashboard_active,
			"path": '/admin'
		},
		{
			"key": 2,
			"label": "Tickets",
			"logo": tickets,
			"active_logo": tickets_active,
			"path": '/admin/tickets'
		},
		{
			"key": 3,
			"label": "Blogs",
			"logo": blogs,
			"active_logo": blogs_active,
			"path": '/admin/blogs'
		},
		{
			"key": 4,
			"label": "Plans",
			"logo": money_bag,
			"active_logo": money_bag,
			"path": '/admin/plans'
		},
	
	]

	return (
		<>
			<MainLayout children={children} defaultSelectedKey={defaultSelectedKey} options={cilentoptions}></MainLayout>
		</>
	)
}

export default Layout