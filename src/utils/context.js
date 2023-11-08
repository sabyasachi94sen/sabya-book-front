import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)
export const UserContextProvider = ({ children }) => {

    const [notification, setNotification] = useState(null)
    const [showNotification, setShowNotification] = useState(false)
    const [allPost, setAllPost] = useState(null)
    const [postData, setPostData] = useState(null)
    const [showNavbar, setShowNavbar] = useState(false)
    const [globalSocket, setGlobalSocket] = useState(null)
    const [friendStatus, setFriendStatus] = useState("Add Friend")
    const [requestLoading, setRequestLoading] = useState(false)
    const [recievedRequests, setRecievedRequests] = useState(null)
    const [sendRequests, setSendRequests] = useState(null)
    const [friends, setFriends] = useState(null)
    const [chat, setChat] = useState([])


    return (
        <UserContext.Provider value={{ notification, setNotification, globalSocket, setGlobalSocket, showNotification, setShowNotification, postData, setPostData, allPost, setAllPost, showNavbar, setShowNavbar, friendStatus, setFriendStatus, requestLoading, setRequestLoading, sendRequests, setSendRequests, recievedRequests, setRecievedRequests, friends, setFriends ,chat,setChat}}>
            {children}
        </UserContext.Provider>
    )
}

export const useProvider = () => useContext(UserContext)