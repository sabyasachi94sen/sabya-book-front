import { Outlet } from '@tanstack/react-router'
import React from 'react'
import { Dashboard } from '../component/dashboard';
import { Login } from '../component/login';
import { Register } from '../component/register';
import getLocalStorage from '../helpers/getLocalStorage';
import { UserContextProvider } from '../utils/context';


const Layout = () => {
    const data = getLocalStorage("user");
    let token;
    if (data) {
        const userData = JSON.parse(data);
        token = userData?.token;
    }
    const url = window.location.pathname.split("/")[1]

    return (
        <div>
            {token ?
                <UserContextProvider>
                    <Dashboard />
                </UserContextProvider>
                :
                <>
                    {url != "register" ?
                        <Login />
                        :
                        <Register />
                    }
                </>
            }
        </div>
    )
}

export default Layout