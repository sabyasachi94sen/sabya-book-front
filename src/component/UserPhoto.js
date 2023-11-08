import React, { useState } from 'react'
import getLocalStorage from '../helpers/getLocalStorage';
import CustomModal from './customModal';

const UserPhoto = (
    {
        profile_pic,
        pic_post,
        likes,
        comments: userComments,
        share,
        user,
        user_id: post_user_id,
        text_post,
        handlePostStatus,
        _id,
        fetchPost,
        createdAt,
    }
) => {
    const [open, setOpen] = useState(false);
    const { user_id, profile_pic: user_profile_pic, user: user_name } = JSON.parse(getLocalStorage("user"))
    const is_user_liked = likes.some((it) => it.user_id == user_id);
    const [comments, setComments] = useState(userComments)


    return (
        <>
            <div onClick={() => setOpen(!open)}>
                <img src={pic_post} className="user-photo" />
            </div>
            {open && <CustomModal
                isOpen={open}
                likes={likes}
                share={share}
                pic_post={pic_post}
                handlePostStatus={handlePostStatus}
                is_user_liked={is_user_liked}
                comments={comments}
                onCancel={() => setOpen(!open)}
                user_id={post_user_id}
                post_id={_id}
                text_post={text_post}
                post_user_id={post_user_id}
                user={user}
                setComments={setComments}
                fetchPost={fetchPost}
                createdAt={createdAt}
                post_profile_pic={profile_pic}
            />
            }
        </>
    )
}

export default UserPhoto;