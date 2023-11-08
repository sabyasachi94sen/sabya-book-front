import { Button } from 'antd'
import React, { useState } from 'react'
import getLocalStorage from '../helpers/getLocalStorage'
import { useProvider } from '../utils/context'

const FriendRequest = ({ request }) => {

    const [loading, setLoading] = useState(false)
    const { globalSocket } = useProvider()
    const { user_id: logged_user_id, profile_pic: logged_user_profile_pic, user: logged_user_name } = JSON.parse(getLocalStorage("user"))


    const visitProfile = (user_id) => {
        window.location.href = `/profile/${user_id}`

    }

    const acceptFriend = (user) => {
        try {
            setLoading(true)
            globalSocket.socket.emit("accept_request", { ...user, logged_user_id, logged_user_name, logged_user_profile_pic })
        }
        catch (err) {
            setLoading(false)
        }
    }

    console.log(loading, "sss");

    return (
        <div className='notification'>
            {request?.length ? request?.map((d) =>
                <div className={`user-info`}>
                    <img className="profile_pic"
                        src={d?.profile_pic}
                        onClick={() => visitProfile(d?.user_id)}
                    />
                    <div className='user-post-status' onClick={() => visitProfile(d?.user_id)}>
                        <span className='name'>{d?.user}</span>
                    </div>
                    <Button disabled={loading} loading={loading} className='accept-friend' onClick={() => acceptFriend(d)}>
                        <span>Accept Friend</span>
                    </Button>
                </div>)
                :
                <div className='no-notification'>
                    <p>No Request Yet</p>
                </div>
            }
        </div>
    )
}

export default FriendRequest;