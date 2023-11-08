import React, { useEffect, useState } from 'react'
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    FireOutlined,
    PlayCircleOutlined,
    ImportOutlined,
    FileImageOutlined,
    SearchOutlined,
    UserOutlined,
    BellOutlined,

} from '@ant-design/icons';

import { Breadcrumb, Layout, Menu, theme, Image, Space, Input, Avatar, Dropdown } from 'antd';
import { Outlet } from '@tanstack/react-router';
import removeLocalStorage from "../helpers/removeLocalStorage"
import { useProvider } from '../utils/context';
import getLocalStorage from '../helpers/getLocalStorage';
import Notification from './notification';
import SbIo from "./socket";
import { base_url } from "../baseUrl";
import io from "socket.io-client"
import SearchableDropdown from './SearchableDropdown';
import axios from 'axios';
import FriendRequest from './friendRequest';
import api from '../utils/api';




const { Header, Content, Sider } = Layout;

const handleLogout = () => {
    removeLocalStorage("user");
    window.location.href = "/"
}


function getItem(
    label,
    key,
    icon,
    children,
    type
) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}



export const Dashboard = () => {

    const { notification, setNotification, globalSocket, setGlobalSocket, showNotification, setShowNotification, showNavbar, requestLoading, setRequestLoading, friendStatus, setFriendStatus, sendRequests, setSendRequests, recievedRequests, setRecievedRequests, friends, setFriends,chat,setChat } = useProvider()
    const [storeNotification, setStoreNotification] = useState(null)
    const [notificationItems, setNotificationItems] = useState(null)
    const [notificationSize, setNotificationSize] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const [showRequest, setShowRequest] = useState(false)

    const { user_id, user, profile_pic } = JSON.parse(getLocalStorage("user"))

    const url = window.location.pathname.split("/")[1]

    const items = [
        getItem('Games', 'games', <FireOutlined />, [
            getItem('Angry bird', 'g1', null, [], 'group'),
            getItem('Pool 8', 'g2', null, [], 'group'),
        ]),
        getItem('Videos', 'videos', <PlayCircleOutlined />, null),
        getItem('Posts', 'post', <ImportOutlined />, null),
        getItem('Image', 'images', <FileImageOutlined />, null),
    ];


    const dropdownItems = [
        getItem(<div>Settings</div>, 'setting', null, null),
        getItem(<div onClick={() => window.location.href = "/profile/" + user_id}>Profile</div>, 'profile', null, null),
        getItem(<div onClick={handleLogout}>Logout</div>, 'logout', null, null)
    ];


    const getNotification = () => {
        let size = 0;
        if (notification) {
            let tempArr = []
            notification.map((it) => {
                if (it?.post_user_id == user_id) {
                    tempArr.push(it)
                    if (!it?.seen)
                        size++;
                }
            })
            if (tempArr.length)
                setStoreNotification(tempArr.reverse())
            else
                setStoreNotification([])

            setNotificationSize(size)
        }
    }


    const getConnection = async () => {
        const socket = await new SbIo("http://localhost:3001/", { user_id, room: `${user_id}` })
        socket.socket.on("recieve_notification", (data) => {
            if (data) {
                setNotification(data)
            }

        })
        socket.socket.on("recieve_request", (data) => {
            if (data) {
                setRecievedRequests(data)
            }
        })

        socket.socket.on("recieve_message", (data) => {
            console.log(data,"data");
            if (data) {
                setChat(data)
            }
        })


        socket.socket.on("request_status", (data) => {
            if (data?.status == 200) {
                setFriendStatus("Friend Request Send")
                setRequestLoading(false)
            }
            else if (data?.status == 300) {
                setFriendStatus("Add Friend")
                setRequestLoading(false)
            }
            else if (data?.status == 400) {
                console.log(user_id, "user_id");
                setFriendStatus("Friend")
                setRequestLoading(false)
            }
            else if (data?.status == 500) {
                setFriendStatus("Accept Friend Request")
                setRequestLoading(false)
            }
        })

        setGlobalSocket(socket)
    }

    const getAllProfiles = async () => {
        const { data } = await api.get("profiles")
        setProfileData(data?.profileData)
    }

    const getRequest = async () => {
        const { data } = await api.get("/friend_request/" + user_id)
        setRecievedRequests(data?.recieved_requests)
        setSendRequests(data?.send_requests)
        setFriends(data?.friends)
    }

    const handleDropdown = (text) => {
        if (text == "request") {
            setShowRequest(!showRequest)
            if (showNotification)
                setShowNotification(false)
        }
        else {
            setShowNotification(!showNotification)
            if (showRequest) {
                setShowRequest(false)
            }
        }
    }


    useEffect(() => {
        if (user) {
            getConnection()
            getAllProfiles()
            getRequest()
        }
    }, [user])


    useEffect(() => {
        if (user) {
            getNotification()
        }
    }, [notification, user])

    console.log("user", user);


    useEffect(() => {
        if (showNotification && user) {
            globalSocket.socket.emit("close_notification", { post_user_id: user_id })
        }
    }, [showNotification, user])



    return (
        <Layout className='layout-container'>
            <Header style={{ display: 'flex', justifyContent: "space-between", position: "sticky", top: 0, zIndex: "999", width: "100%" }}>
                <div style={{ display: "flex", columnGap: "50px", alignItems: "center" }}>
                    <img
                        onClick={() => window.location.href = "/home"}
                        width={50}
                        src="https://play-lh.googleusercontent.com/xfEspWVgqszn0jbG5EMk22L71j2NykKn8n09xIZKz1Z-eMyqFmKXciAtQzhnN_qd2w"
                    />
                    <Space.Compact size="large">
                        <SearchableDropdown
                            options={profileData}
                            label="user"
                            id="id"
                        />
                    </Space.Compact>
                </div>
                <div style={{ display: "flex", alignItems: "center", columnGap: "20px" }}>
                    <div style={{ cursor: "pointer", position: "relative", padding: "4px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                    >
                        <UserOutlined onClick={() => handleDropdown("request")} style={{ fontSize: "25px", color: "white" }} />
                        {showRequest && <FriendRequest request={recievedRequests} />}
                        {recievedRequests?.length && !showRequest ? <div style={{ display: "flex", fontSize: "10px", color: "white", alignItems: "center", justifyContent: "center", backgroundColor: "red", right: 0, bottom: "2px", width: "14px", height: "14px", borderRadius: "50%", position: "absolute" }}>
                            <span>{recievedRequests?.length}</span>
                        </div>
                            :
                            <></>
                        }
                    </div>
                    <div
                        style={{ cursor: "pointer", position: "relative", padding: "4px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                    >
                        <BellOutlined
                            onClick={() => handleDropdown("notification")}
                            style={{ fontSize: "25px", color: "white" }}
                        />
                        {notificationSize && !showNotification ? <div style={{ display: "flex", fontSize: "10px", color: "white", alignItems: "center", justifyContent: "center", backgroundColor: "red", right: 0, bottom: "2px", width: "14px", height: "14px", borderRadius: "50%", position: "absolute" }}>
                            <span>{notificationSize}</span>
                        </div> :
                            <></>
                        }
                        {showNotification ? <Notification notification={storeNotification} />
                            :
                            <></>
                        }
                    </div>
                    <Dropdown menu={{ items: dropdownItems }} placement="bottomCenter">
                        <a onClick={(e) => e.preventDefault()}>
                            <Space wrap>
                                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </Header>
            <Layout >
                {showNavbar && <Sider  width={200}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={items}
                    />
                </Sider>}
                <Layout>
                    <Content>
                        {url != "register" &&
                            <Outlet />
                        }
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

