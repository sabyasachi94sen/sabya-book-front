import moment from 'moment';
import React from 'react'
import { useProvider } from '../utils/context';
import { useNavigate } from '@tanstack/react-router';

const Notification = ({ notification }) => {

    const { setPostData } = useProvider()
    const navigator = useNavigate({ from: "/" })

    const getTime = (time) => {
        const diff = Math.abs(new Date().getTime() - new Date(time).getTime())
        var diffTime = Math.ceil(diff / 60000);
        if (diffTime < 60)
            return `${diffTime}min ago`
        else if (diffTime >= 60 && diffTime < 1440)
            return `${Math.ceil(diffTime / 60)}h ago`
        else
            return `${new Date(time).toUTCString().split(' ').slice(0, 4).join(' ')}`
    }

    const handlePost = (item) => {
        setPostData(item)
        if (item?.status == "Accepted your friend request") {
            window.location.href = "/profile" + item?.post_id
        }
        else {
            window.location.href = "/post/" + item?.post_id
        }
    }

    return (
        <div className='notification'>
            {notification?.length ? notification?.map((it) =>
                <>
                    <div className='user-notification' onClick={() => handlePost(it)}>
                        <img className="profile_pic" src={it?.profile_pic} />
                        <span className='notification-status'>
                            <span style={{ color: "black" }}>{it?.user}</span>
                            &nbsp;
                            <span>{it?.status}</span>
                            <p style={{ color: "blue", fontWeight: "bolder" }}>
                                {getTime(it?.createdAt)}
                            </p>
                        </span>
                    </div>
                </>
            )
                :
                <div className='no-notification'>
                    <p>No Notification Yet</p>
                </div>
            }
        </div>
    )
}

export default Notification;