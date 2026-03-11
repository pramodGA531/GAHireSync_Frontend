import React from 'react'

import MainLayout from '../../common/Layout/MainLayout2';
import dashboard from '../../../images/SideBar/dashboard.svg'
import dashboard_active from "../../../images/SideBar/dashboard-active.svg"
import invoice from "../../../images/SideBar/invoice.svg"
import invoice_active from "../../../images/SideBar/invoice-active.svg"


const Main = ({ children, defaultSelectedKey }) => {


  const accountantoptions = [
    {
      "key": 1,
      "label": "Dashboard",
      "logo": dashboard,
      "active_logo": dashboard_active,
      "path": '/accountant'
    },
    {
      "key": 2,
      "label": "Invoices",
      "logo": invoice,
      "active_logo": invoice_active,
      "path": '/accountant/invoice'
    },
    // {
    //   "key": 3,
    //   "label": "Profile",
    //   "logo": dashboard,
    //   "active_logo": dashboard_active,
    //   "path": '/profile'
    // },
  ]

  return (
    <MainLayout children={children} defaultSelectedKey={defaultSelectedKey} options={accountantoptions}></MainLayout>
  )
}

export default Main
