import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import getLocalStorage from '../helpers/getLocalStorage';
import api from "../utils/api";
import PostAnalytics from './postAnaytics';
import {
    LikeOutlined,
    LikeFilled,
    MessageOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import parse from "html-react-parser"
import { useProvider } from '../utils/context';

const PostComment = ({ post_status, post_profile_pic, setComments, fetchPost, createdAt, comments, user_id, post_id, post_user_id, user, text_post, pic_post, likes, share, is_user_liked, handlePostStatus }) => {
    const [userComment, setUserComment] = useState(null);
    const [loading, setLoading] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    const [storeUserComment, setStoreUserComment] = useState([])
    const [storeReply, setStoreReply] = useState(null)
    const url = window.location.pathname.split("/")[1];
    const { globalSocket } = useProvider()

    const { profile_pic, user: user_name, user_id: logged_user_id } = JSON.parse(getLocalStorage("user"))

    const sendComment = async () => {
        try {
            setLoading(true)
            const comment_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
            const payload = { profile_pic, comment: userComment, user_id: logged_user_id, _id: comment_id, user: user_name, likes: [], reply: [] }
            const { data } = await api.put("/user_comment/" + post_id, { comments: [...storeUserComment, payload], user_id: logged_user_id })
            setStoreUserComment([...storeUserComment, payload])
            setComments([...storeUserComment, payload])
            setUserComment(null)
            setLoading(false)
            document.getElementById("comment-ip").value = "";
            const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

            if (post_user_id != logged_user_id) {
                const createdAt = new Date()
                globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `commented on your post`, post_user_id, user: user_name, user_id: logged_user_id, likes: likes, comments, _id: notification_id, profile_pic })
            }
            // fetchPost()
        }
        catch (err) {
            setLoading(false)
        }
    }


    useEffect(() => {
        for (let i = 0; i < comments.length; i++) {
            comments[i]["reply_open"] = false;
        }
        setStoreUserComment([...comments])
    }, [])


    useEffect(() => {
        let ele = document.getElementsByClassName("user-info-id");
        let el = ele[ele.length - 1]
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, [storeUserComment])


    function handleKeyPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault(); // Ensure it is only this code that runs
            if (userComment) {
                sendComment()
            }
        }
    }



    const handleCommentStatus = async (_id) => {
        try {
            let comment_user_id;
            let is_liked;
            for (let i = 0; i < comments.length; i++) {
                if (comments[i]?._id == _id) {
                    comment_user_id = comments[i].user_id
                    const likes = comments[i].likes;
                    is_liked = likes?.some((it) => it.user_id == logged_user_id)
                    if (is_liked) {
                        const index = likes.findIndex((it) => it.user_id == logged_user_id)
                        likes.splice(index, 1)
                    }
                    else {
                        const like_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
                        likes.push({ user_id: logged_user_id, user_name, like_id })
                    }
                    comments[i].likes = likes;
                }
            }
            setStoreUserComment([...comments])
            setComments([...comments])
            await api.put("/user_comment_status/" + post_id, { comments, user_id: logged_user_id })
            const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

            if (!is_liked && comment_user_id != logged_user_id) {
                const createdAt = new Date()
                globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `liked your comment`, post_user_id: comment_user_id, user: user_name, user_id: logged_user_id, likes: likes, comments, _id: notification_id, profile_pic })

            }
            // fetchPost()
        }
        catch (err) {
            setLoading(false)
        }

    }


    const checkUserLiked = (_id) => {

        let is_liked = false;
        for (let i = 0; i < comments.length; i++) {
            if (comments[i]?._id == _id) {
                const likes = comments[i]?.likes;
                is_liked = likes?.some((it) => it.user_id == logged_user_id)
            }
        }


        return is_liked;

    }

    const handleReplyBox = (_id) => {
        const tempArr = storeUserComment
        for (let i = 0; i < tempArr.length; i++) {
            if (tempArr[i]._id == _id) {
                tempArr[i].reply_open = !tempArr[i].reply_open
            }
        }
        setUserComment([...tempArr])
    }

    const handleReplyStatus = async (replies, _id, user_comment) => {
        try {
            console.log("l0l");
            setReplyLoading(true);
            let comment_user_id;

            const reply_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
            const payload = {
                reply_id,
                user: user_name,
                user_id: logged_user_id,
                profile_pic,
                reply: storeReply
            }
            replies.push(payload)
            for (let i = 0; i < user_comment.length; i++) {
                if (user_comment[i]?._id == _id) {
                    comment_user_id = user_comment[i].user_id;
                    user_comment[i].reply = replies
                }
            }



            const { data } = await api.put("/user_comment_status/" + post_id, { comments: user_comment, user_id: logged_user_id })
            setUserComment([...user_comment])
            setComments([...user_comment])
            let ele = document.getElementsByClassName("user-info-reply-id");
            let el = ele[ele.length - 1]
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
            document.getElementById("comment-inner-ip").value = ""
            setReplyLoading(false);
            const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
            const createdAt = new Date()
            if (comment_user_id != logged_user_id) {
                globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `replied on your comment`, post_user_id: comment_user_id, user: user_name, user_id: logged_user_id, likes: likes, comments, _id: notification_id, profile_pic })
            }
            // fetchPost()
        }
        catch (err) {
            setReplyLoading(false)
        }
    }

    const visitProfile = (user_id) => {
        window.location.href = `/profile/${user_id}`

    }

    const getTime = (time) => {
        const diff = Math.abs(new Date().getTime() - new Date(time).getTime())
        var diffTime = Math.ceil(diff / 60000);
        if (diffTime < 60)
            return `${diffTime} min ago`
        else if (diffTime >= 60 && diffTime < 1440)
            return `${Math.ceil(diffTime / 60)} h ago`
        else
            return `${new Date(time).toUTCString().split(' ').slice(0, 4).join(' ')}`

    }


    return (
        <div className='notification-comment-wrapper'>
            <div className="user-info">
                <img onClick={() => visitProfile(user_id)}
                    className="profile_pic" src={post_profile_pic} />
                <div className='user-post-status'>
                    <span onClick={() => visitProfile(user_id)}
                        className='name'>{user}</span>
                    <span className='time'>{getTime(createdAt)}</span>
                </div>
            </div>
            <div>
                {pic_post ?
                    <img className="pic-post" src={pic_post} />
                    :
                    <p>{text_post}</p>
                }
                <PostAnalytics pic_post={pic_post} text_post={text_post} post_user_id={post_user_id} likes={likes} user_id={user_id} comments={comments} share={share} post_id={post_id} handlePostStatus={handlePostStatus} is_user_liked={is_user_liked} />
                <div className='post-comment-wrapper'>
                    {storeUserComment?.length ? storeUserComment?.map((it) =>
                        <div className="user-info user-info-id">
                            <img onClick={() => visitProfile(it?.user_id)} className="profile_pic"
                                src={it?.profile_pic}
                            />
                            <div className='com-wrapper'>
                                <div className='user-comment'>
                                    <span onClick={() => visitProfile(it?.user_id)} className='user-name'>{it?.user}</span>
                                    <p className='user-com'>{it?.comment}</p>
                                </div>
                                <div className='comment-status'>
                                    <div style={{ cursor: "pointer" }}>
                                        {!checkUserLiked(it?._id) ? <LikeOutlined onClick={() => handleCommentStatus(it?._id)} />
                                            :
                                            <LikeFilled onClick={() => handleCommentStatus(it?._id)} />}
                                        {it?.likes?.length > 0 && <span>&nbsp;{it?.likes?.length}</span>}
                                    </div>
                                    <div onClick={() => handleReplyBox(it?._id)} style={{ cursor: "pointer" }}>Reply</div>
                                </div>
                                {it?.reply?.length > 0 && !it?.reply_open &&
                                    <div style={{ cursor: "pointer" }} className="reply-status" onClick={() => handleReplyBox(it?._id)}>
                                        <MessageOutlined />
                                        {it?.reply?.length > 0 && <span>&nbsp;{it?.reply?.length} replies</span>}
                                    </div>
                                }
                                {it?.reply_open && it?.reply?.map((d) => <div className="user-info user-info-reply-id">
                                    <img onClick={() => visitProfile(d?.user_id)} className="profile_pic"
                                        src={d?.profile_pic}
                                    />
                                    <div className='com-wrapper'>
                                        <div className='user-comment'>
                                            <span onClick={() => visitProfile(d?.user_id)} className='user-name'>{d?.user}</span>
                                            <p className='user-com'>{d?.reply}</p>
                                        </div>

                                    </div>
                                </div>)}
                                {it?.reply_open && <div className="user-comment-wrapper user-reply-wrapper">
                                    <img className="profile_pic"
                                        src={profile_pic}
                                    />
                                    <input onKeyDown={handleKeyPress} id="comment-inner-ip" onChange={(e) => setStoreReply(e.target.value)} placeholder='Write your comment here' type="text" className='comment-input' />
                                    <Button className='send-btn' disabled={replyLoading || !storeReply} loading={replyLoading} onClick={() => handleReplyStatus(it?.reply, it?._id, storeUserComment)}>Send</Button>
                                </div>}
                            </div>
                        </div>
                    )
                        :
                        <div>No Comments yet</div>
                    }
                </div>
            </div>
            <div className="user-comment-wrapper-post">
                <img onClick={() => visitProfile(user_id)} className="profile_pic"
                    src={profile_pic}
                />
                <input onKeyDown={handleKeyPress} id="comment-ip" onChange={(e) => setUserComment(e.target.value)} placeholder='Write your comment here' type="text" className='comment-input' />
                <Button className='send-btn' disabled={loading || !userComment} loading={loading} onClick={sendComment}>Send</Button>
            </div>
        </div>
    )
}

export default PostComment