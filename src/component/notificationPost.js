import React, { useEffect, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast';
import getLocalStorage from '../helpers/getLocalStorage';
import api from '../utils/api';
import { useProvider } from '../utils/context';
import Comment from './comment';
import PostComment from './PostComment';



const NotificationPost = () => {

    const [postData, setPostData] = useState(null)
    const [comments, setComments] = useState(null)
    const [loading, setLoading] = useState(false)
    const urlParams = window.location.pathname;
    const { user_id, user, profile_pic } = JSON.parse(getLocalStorage("user"))
    const { showNavbar, setShowNavbar, globalSocket } = useProvider()




    const handlePostStatus = async (post_id, likes, user_id, comments, post_user_id, pic_post, text_post, share) => {
        const tempPostArr = postData;
        let temp_likes;
        var is_user_liked = false;

        is_user_liked = likes.some(it => it?.user_id == user_id)
        if (is_user_liked) {
            let index = likes.findIndex((val) => val?.user_id == user_id)
            likes.splice(index, 1)
            temp_likes = likes
        }
        else {
            temp_likes = likes;
            temp_likes.push({ user_id, user })
        }
        tempPostArr.likes = temp_likes

        setPostData({ ...tempPostArr })
        await api.put("/user_like/" + post_id, { likes: temp_likes, user_id })
        const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

        if (!is_user_liked && post_user_id != user_id) {
            const createdAt = new Date()
            globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `likes your photo`, post_user_id, user, user_id, likes: temp_likes, comments, _id: notification_id, profile_pic })
        }

    }


    const fetchPost = async () => {
        const id = urlParams?.split("/")[2]
        setLoading(true)
        const { data } = await api.get("/user_post/" + id)
        setLoading(false)
        setPostData(data)
        setComments(data?.comments)
    }

    useEffect(() => {
        setShowNavbar(false)
        fetchPost()
    }, [urlParams])

    return (
        <>
            {postData && !loading ?
                <>
                    <PostComment
                        {...postData}
                        comments={comments}
                        user_id={postData?.user_id}
                        post_id={postData?._id}
                        user={user}
                        is_user_liked={postData?.likes?.some((it) => it.user_id == user_id)}
                        handlePostStatus={handlePostStatus}
                        post_user_id={postData?.user_id}
                        fetchPost={() => { }}
                        setComments={setComments}
                        post_profile_pic={postData?.profile_pic}
                    />

                </>
                :
                < LoaderIcon />}
        </>
    )
}

export default NotificationPost;