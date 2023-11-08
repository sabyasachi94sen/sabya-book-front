import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast';
import getLocalStorage from '../helpers/getLocalStorage';
import api from '../utils/api';
import { useProvider } from '../utils/context';

const Chat = ({ setChatClose, friend, friend_profile_pic, friend_id }) => {
    const { user, user_id, profile_pic } = JSON.parse(getLocalStorage("user"))
    const [message, setMessage] = useState(null)
    const { globalSocket, chat, setChat } = useProvider()
    const [loading, setLoading] = useState(false)


    const sendMessage = () => {
        const connection_id = friend_id + user_id
        globalSocket.socket.emit("send_message", { message, user_id, user, friend_id, friend, connection_id, profile_pic })
        document.getElementById("comment-ip").value = ""
    }

    const fetchMessage = async () => {
        setLoading(true)
        const connection_id = friend_id + user_id
        const { data } = await api.get("/messages/" + connection_id)
        setChat(data)
        setLoading(false)
    }

    function handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault(); // Ensure it is only this code that runs
            if (message) {
                sendMessage()
            }
        }
    }


    useEffect(() => {
        fetchMessage()
    }, [friend])

    useEffect(() => {
        const ele1 = document.getElementsByClassName("friend-chat");
        const ele2 = document.getElementsByClassName("user-chat");
        if (ele1) {
            let el1 = ele1[ele1.length - 1]
            if (el1) {
                el1.scrollIntoView({ behavior: "smooth" });
            }
        }
        if (ele2) {
            let el2 = ele2[ele2.length - 1]
            if (el2) {
                el2.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [chat])


    console.log(chat, "chat");



    return (
        <div className='chat-wrapper'>
            <div className='user-chat-header'>
                <div style={{color:"white",fontWeight:"bolder"}}>{friend}</div>
                <div>
                    {/* <span>online</span> */}
                    <span style={{ cursor: "pointer",color:"white",fontWeight:"bolder" }} onClick={setChatClose}>&nbsp;X</span>
                </div>
            </div>
            <div className='user-chat-body clear-fix'>
                {chat?.users?.map(it =>
                    <div>
                        {it[friend_id] && <div className='friend-chat' style={{ float: "left", clear: "both", marginTop: "5px", marginLeft: "5px", wordBreak: "break-all" }}>
                            <div className="user-info user-info-reply-id">
                                <img className="profile_pic" src={it[friend_id]?.profile_pic} />
                                <div className='user-comment' style={{ paddingTop: "10px", backgroundColor: "#1a81ff", color: "white" }}>
                                    <p className='user-com'>{it[friend_id]?.message}</p>
                                </div>

                            </div>

                        </div>}
                        {it[user_id] && <div className='user-chat' style={{ marginTop: "5px", marginRight: "5px", float: "right", clear: "both", wordBreak: "break-all" }}>
                            <div className="user-info user-info-reply-id">
                                <div className='user-comment' style={{ paddingTop: "10px", backgroundColor: "#1a81ff", color: "white" }}>
                                    <p className='user-com'>{it[user_id]?.message}</p>
                                </div>

                            </div>
                        </div>}
                    </div>

                )}
                {loading && <LoaderIcon style={{ margin: "auto" }} />}
                <div className="user-comment-wrapper user-chat-footer">
                    <input onKeyDown={handleKeyPress} id="comment-ip" onChange={(e) => setMessage(e.target.value)} placeholder='Write your message here' type="text" className='comment-input' />
                    <Button className='send-btn' onClick={sendMessage}>Send</Button>
                </div>
            </div>
        </div >
    )
}

export default Chat;