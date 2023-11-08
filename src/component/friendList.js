import React from 'react'
import Friends from './friends';

const FriendList = ({ friends, handleFriendData}) => {
    console.log("lol");
    return (
        <div className='friend-list'>
            <h3>Friends</h3>
            <div>
                {friends?.map((options, index) => {
                    return (
                        <div className={`user-info`} onClick={()=>handleFriendData(options?.profile_pic,options?.user,options?.user_id)}>
                            <img className="profile_pic"
                                src={options.profile_pic}
                            />
                            <div className='user-post-status'>
                                <span className='name'>{options?.user}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default FriendList;