import React from 'react'

const Friends = ({ profile_pic, user, user_id }) => {

    const visitProfile = () => {
        window.location.href = `/profile/${user_id}`

    }

    return (
        <div onClick={visitProfile}>
            <img src={profile_pic} className="user-friends" />
            <div className='friends-name'>{user}</div>
        </div>
    )
}

export default Friends