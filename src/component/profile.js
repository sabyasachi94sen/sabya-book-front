import React, { useEffect, useState } from 'react'
import getLocalStorage from '../helpers/getLocalStorage'
import setLocalStorage from "../helpers/setLocalStorage"
import { Button, Card, Col, Dropdown, Row, Space } from "antd"
import {
    UnorderedListOutlined,
    UserAddOutlined,
    CheckOutlined
} from '@ant-design/icons';
import NewPost from './newPost';
import 'antd/dist/reset.css';
import api from '../utils/api';
import PostList from './postList';
import { LoaderIcon } from 'react-hot-toast';
import { useProvider } from '../utils/context';
import UserDetailsCard from './userDetailsCard';
import { Loader } from 'rsuite';
import RenderLoader from './renderLoader';
import imageCompression from 'browser-image-compression';
import toast, { Toaster } from 'react-hot-toast';
import { Tabs } from 'antd';
import UserPhoto from './UserPhoto';
import Banner from './banner';
import CustomModal from './customModal';
import DataNotFound from './dataNotFound';


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


const Profile = () => {

    const [loading, setLoading] = useState(false)
    const [userPost, setUserPost] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [profilePicPost, setProfilePicPost] = useState(null)
    const [profilePicComments, setProfilePicComments] = useState(null);
    const [tabs, setTabs] = useState(1)
    const [userDp, setUserDp] = useState(null)
    const [isRequestSend, setRequestSend] = useState(false)
    const [dp, setDp] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [userInfoInput, setUserInfoInput] = useState({
        degree: false,
        college: false,
        school: false,
        lives_in: false,
        from: false,
        marital_status: false
    })
    const { profile_pic, user, user_id: profile_id } = JSON.parse(getLocalStorage("user"))
    const { globalSocket, requestLoading, setRequestLoading, friendStatus, setFriendStatus, recievedRequests, friends, sendRequests } = useProvider()
    const user_id = window.location.pathname.split("/")[2];


    const fetchProfile = async () => {
        setLoading(true)
        const { data } = await api.get("/user/" + user_id)
        setUserPost(data?.post?.reverse())
        setUserInfo({ ...data?.info, profile_pic_id: data?.profile_pic_id, profile_id: data?.user_id, banner_pic_id: data?.banner_pic_id, requests: data?.requests, friends: data?.friends })
        setUserDp({ profile_pic: data?.profile_pic, user: data?.user, banner: data?.banner })
        setLoading(false)
    }

    const handlePostStatus = async (post_id, likes, user_id, comments, post_user_id, pic_post, text_post, share) => {
        const tempPostArr = userPost;
        let temp_likes;
        var is_user_liked = false;

        for (let i = 0; i < tempPostArr.length; i++) {
            if (tempPostArr[i]._id == post_id) {
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
                tempPostArr[i].likes = temp_likes
            }
        }

        setUserPost([...tempPostArr])
        await api.put("/user_like/" + post_id, { likes: temp_likes, user_id })
        const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))

        if (!is_user_liked && post_user_id != user_id) {
            const createdAt = new Date()
            globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `likes your photo`, post_user_id, user, user_id, likes: temp_likes, comments, _id: notification_id, profile_pic })
        }

    }

    const isProfileUpdate = () => {
        let isUpdate = false;
        for (let key in userInfoInput) {
            if (userInfoInput[key]) {
                isUpdate = true
                break;
            }
        }
        return isUpdate;
    }

    const closeAllInput = () => {
        const input = userInfoInput
        for (let key in input) {
            input[key] = false
        }
        setUserInfoInput({ ...input })
    }

    const uploadDp = async () => {
        document.getElementById("dp").click()
    }



    const storeDp = async (e) => {
        try {
            const file = e.target.files[0];
            const sizeInBytes = file.size

            // if (Math.trunc(sizeInBytes / 1024) > 16) {
            //     toast.error("Max size be 16mb")
            // }
            // else {
            //     // const options = {
            //     //     maxSizeMB: 1,
            //     //     maxWidthOrHeight: 50,
            //     //     initialQuality: 0.1,       // optional, initial quality value between 0 and 1 (default: 1)
            //     //     alwaysKeepResolution: false
            //     // }
            //     // const compressedFile = await imageCompression(file, options);
            //     // console.log(compressedFile.size);
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.addEventListener('load', async () => {
                    if (reader.result) {
                        console.log(reader.result);
                        setDp(reader.result)
                    }
                });
            }
            // }

        } catch (error) {
            console.log(error);
        }
    }

    const handleUpload = async () => {
        try {
            const data = JSON.parse(getLocalStorage("user"))
            const createdAt = new Date()
            const newPost = {
                user_id: Number(user_id),
                user,
                profile_pic: dp,
                pic_post: dp,
                text_post: null,
                likes: [],
                comments: [],
                share: [],
                createdAt
            }
            setLoading(true)
            await api.put("/user_dp/" + user_id, { dp: dp, newPost })
            fetchProfile()
            setDp(null)
            setLoading(false)
            setLocalStorage("user", JSON.stringify({ ...data, profile_pic: dp }))
        }
        catch (err) {
            setLoading(false)
        }
    }

    const checkFriend = async () => {
        let is_checked;

        is_checked = friends?.some(d => d?.user_id == user_id)
        if (is_checked) {
            setFriendStatus("Friend")
            return;
        }

        is_checked = recievedRequests?.some((d) => d?.user_id == user_id)

        if (is_checked) {
            setFriendStatus("Accept Friend Request")
            return;
        }

        is_checked = sendRequests?.some((d) => d?.user_id == user_id)

        console.log(sendRequests,"hhh");

        if (is_checked) {
            setFriendStatus("Friend Request Send")
            return;
        }

    }


    useEffect(() => {
        fetchProfile();
    }, [tabs])

    useEffect(() => {
        if (profile_id != user_id) {
            checkFriend()
        }
    }, [friends, recievedRequests, sendRequests])

    useEffect(() => {
        if (dp)
            handleUpload()
    }, [dp])


    const items = [
        {
            key: '1',
            label: 'Post',
            children: <UserInfo
                closeAllInput={closeAllInput}
                userInfoInput={userInfoInput}
                setUserInfoInput={setUserInfoInput}
                userInfo={userInfo}
                isProfileUpdate={isProfileUpdate}
                setUserInfo={setUserInfo}
                user_id={user_id}
                fetchProfile={fetchProfile}
                handlePostStatus={handlePostStatus}
                loading={loading}
                user={user}
                profile_pic={profile_pic}
                userPost={userPost}
                profile_id={profile_id}
            />,
        },
        {
            key: '2',
            label: 'Photo',
            children: <div className='user-photo-wrapper'>
                {userPost?.length > 0 && userPost?.map(it =>
                    <UserPhoto
                        {...it}
                        handlePostStatus={handlePostStatus}
                        fetchPost={fetchProfile}
                    />
                )}
            </div>
        },
    ]


    const showDp = () => {
        if (userInfo?.profile_pic_id) {
            setIsOpen(!isOpen)
            const post = userPost.filter(it => it?._id == userInfo?.profile_pic_id)
            if (post?.length) {
                setProfilePicPost(post[0])
                setProfilePicComments(post[0]?.comments)
            }
        }
        else {
            toast.error("Please upload a profile picture")
        }
    }

    const handleProfilePicPost = (data) => {
        setProfilePicComments(data)
        for (let i = 0; i < userPost?.length; i++) {
            if (userPost[i]?._id == profilePicPost._id) {
                userPost[i].comments = data;
                break;
            }
        }
        setUserPost([...userPost])
    }

    const sendFriendRequest = () => {
        try {
            setRequestLoading(true)
            if (friendStatus == "Friend Request Send") {
                globalSocket.socket.emit("cancel_request", { user_id, user, logged_user_id: profile_id })
            }
            else if (friendStatus == "Add Friend") {
                const request_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
                globalSocket.socket.emit("send_request", { user_id, user: userDp?.user, profile_pic: userDp?.profile_pic, _id: request_id, logged_user: user, logged_user_id: profile_id, logged_user_profile_pic: profile_pic })
            }
            else if (friendStatus == "Friend") {
                const request_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
                globalSocket.socket.emit("unfriend", { user_id, user: userDp?.user, profile_pic: userDp?.profile_pic, _id: request_id, logged_user: user, logged_user_id: profile_id, logged_user_profile_pic: profile_pic })
            }
            else {
                globalSocket.socket.emit("accept_request", { user_id, user: user, profile_pic: userDp?.profile_pic, logged_user_id: profile_id, logged_user_name: user, logged_user_profile_pic: profile_pic })
            }
        }
        catch (err) {
            setRequestLoading(false)
        }

    }


    const profileItems = [
        getItem(<div onClick={showDp} >See Profile Picture</div>, 'view_profile', null, null),
        getItem(<div onClick={uploadDp} > Update Profile Picture</div>, 'update_profile', null, null),
    ];

    const is_user_liked = profilePicPost?.likes?.some((it) => it.user_id == user_id);


    if (userInfo?.profile_id != profile_id) {
        profileItems.splice(profileItems.length - 1, 1)
    }


    return (
        <>
            {loading && <RenderLoader />}
            {userInfo && !loading && <div className='profile-wrapper-all'>
                <Banner
                    setUsePost={setUserPost}
                    bannerData={userDp?.banner}
                    fetchProfile={fetchProfile}
                    userPost={userPost}
                    userInfo={userInfo}
                    handlePostStatus={handlePostStatus}
                />
                <div className='profile-wrapper' onClick={closeAllInput}>
                    <Dropdown menu={{ items: profileItems }} placement="topCenter" trigger={['click']}>
                        <div className='dp-wrapper'>
                            <img src={userDp?.profile_pic} className='dp' />
                            <input type="file" id="dp" onChange={storeDp} style={{ position: "absolute", visibility: "hidden" }} />
                            <div className='dp-user-wrapper'>
                                <p className='dp-user'>{userDp?.user}</p>
                                <p className='dp-friends'>0 friends</p>
                            </div>
                            {profile_id != user_id &&
                                <Button disabled={requestLoading} loading={requestLoading} className='add-friend' onClick={sendFriendRequest}>
                                    {friendStatus != "Friend" && !requestLoading && <UserAddOutlined style={{ fontSize: "18px" }} />}
                                    {friendStatus == "Friend" && !requestLoading && <CheckOutlined />}
                                    <span>{friends && recievedRequests && sendRequests ? friendStatus : "..."}</span>
                                </Button>

                            }
                        </div>
                    </Dropdown>
                </div>
                <Tabs
                    className='tabs-profile'
                    defaultActiveKey={tabs}
                    items={items}
                    onChange={(key) => {
                        setTabs(key);
                    }}
                    destroyInactiveTabPane={true} // add this prop
                />
            </div>
            }
            {isOpen && <CustomModal
                isOpen={isOpen}
                {...profilePicPost}
                comments={profilePicComments}
                handlePostStatus={handlePostStatus}
                is_user_liked={is_user_liked}
                onCancel={() => setIsOpen(!isOpen)}
                user_id={user_id}
                post_id={profilePicPost?._id}
                post_user_id={profilePicPost?.user_id}
                fetchPost={fetchProfile}
                setComments={handleProfilePicPost}
                post_profile_pic={profilePicPost?.profile_pic}
            />
            }
            <Toaster />
        </>
    )
}

const UserInfo = ({ profile_id, user, userPost, profile_pic, loading, handlePostStatus, closeAllInput, userInfoInput, setUserInfoInput, userInfo, isProfileUpdate, setUserInfo, user_id, fetchProfile }) => {


    const [post, setPost] = useState([])
    const [textPost, setTextPost] = useState(null)
    const [postLoading, setPostLoading] = useState(false)
    const [selected, setSelected] = useState(null)


    const handleImg = (event) => {
        const imageFile = event.target.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.addEventListener('load', () => {
                setSelected(reader.result)
            });
        }
    }

    const uploadPic = () => {
        const ele = document.getElementById("upload-pic");
        if (ele)
            ele.click()
    }

    const convertStringToHTML = (textArr) => {
        let span = document.createElement("span");
        for (let i = 0; i < textArr.length; i++) {
            let temp_span = document.createElement("span")
            temp_span.innerHTML = textArr[i]
            span.appendChild(temp_span)
            span.appendChild(document.createElement("br"))
        }
        return new XMLSerializer().serializeToString(span);
    }

    const handlePost = async () => {

        let tempStr;
        let separateLines;
        let htmlEle;

        if (textPost) {
            tempStr = textPost;
            separateLines = tempStr.split(/\r?\n|\r|\n/g);
            htmlEle = convertStringToHTML(separateLines)
        }
        else {
            htmlEle = null;
        }

        const createdAt = new Date()

        const payload = {
            user_id,
            user,
            profile_pic,
            pic_post: selected,
            text_post: htmlEle,
            likes: [],
            comments: [],
            share: [],
            createdAt
        }
        setPostLoading(true)
        await api.post("/user_post", payload)
        fetchProfile()
        setSelected(null)
        setPostLoading(false)
        setTextPost(null)
        document.getElementById("text-area").value = ""
        toast.success("Successfully Posted")
    }


    return (
        <Row gutter={30}>
            <Col xs={{ span: 24 }} lg={{ span: 10 }} className='profile-info-card'>
                <UserDetailsCard
                    closeAllInput={closeAllInput}
                    userInfoInput={userInfoInput}
                    setUserInfoInput={setUserInfoInput}
                    userInfo={userInfo}
                    isProfileUpdate={isProfileUpdate}
                    setUserInfo={setUserInfo}
                    user_id={user_id}
                    fetchProfile={fetchProfile}
                />
            </Col>
            <Col xs={{ span: 24 }} lg={{ span: 14 }} className='profile-post-card' onClick={closeAllInput}>
                {userInfo?.profile_id == profile_id && <NewPost
                    user={user}
                    profile_pic={profile_pic}
                    handleImg={handleImg}
                    uploadPic={uploadPic}
                    selected={selected}
                    handlePost={handlePost}
                    postLoading={postLoading}
                    setTextPost={setTextPost}
                    user_id={user_id}
                />}
                <div className="post-container">
                    {!loading ? userPost?.map((it, i) =>
                        <PostList
                            fetchPost={fetchProfile}
                            handlePostStatus={handlePostStatus}
                            {...it}
                        />
                    )
                        :
                        <LoaderIcon />
                    }
                    {!loading && !userPost?.length && <DataNotFound />}
                </div>
            </Col>

        </Row>
    )
}


export default Profile