import React from 'react'
import Main from "./Layout"
import { useAuth } from '../../common/useAuth'

const Admin = () => {
    const { apiurl, token } = useAuth();
    return (
        <Main defaultSelectedKey={1}>
            <h2>Welcome to Admin dashboard</h2>
        </Main>
    )
}

export default Admin