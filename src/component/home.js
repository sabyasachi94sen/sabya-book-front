import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoaderIcon, toast, Toaster } from "react-hot-toast";
import NewPost from "./newPost";
import PostList from "./postList";
import api from "../utils/api";
import getLocalStorage from "../helpers/getLocalStorage";
import SbIo from "./socket";
import { base_url } from "../baseUrl";
import io from "socket.io-client"
import { Button, Col, Row } from "antd";
import { useProvider } from "../utils/context";
import Notification from "./notification";
import Chat from "./chat";
import FriendList from "./friendList";

export const Home = () => {

  const [post, setPost] = useState([])
  const [textPost, setTextPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [postLoading, setPostLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [socket, setSocket] = useState(null)
  const [friendInfo, setFriendInfo] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const { notification, setNotification, globalSocket, setGlobalSocket, allPost, setAllPost, showNavbar, setShowNavbar, friends, chat, setChat } = useProvider()


  const userData = JSON.parse(getLocalStorage("user"));
  const { user_id, user, profile_pic } = userData;


  const fetchPost = async () => {
    setLoading(true)
    const { data } = await api.get("/allpost")
    setPost(data?.post_data)
    setAllPost(data?.post_data)
    setNotification(data?.notificationData)
    setLoading(false)
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
    fetchPost()
    setSelected(null)
    setPostLoading(false)
    setTextPost(null)
    document.getElementById("text-area").value = ""
    toast.success("Successfully Posted")
  }

  useEffect(() => {
    setShowNavbar(true)
    fetchPost()
  }, [])

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

  const handlePostStatus = async (post_id, likes, user_id, comments, post_user_id, pic_post, text_post, share) => {
    const tempPostArr = post;
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
          const like_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
          temp_likes = likes;
          temp_likes.push({ user_id, user, profile_pic, _id: like_id })
        }
        tempPostArr[i].likes = temp_likes
      }
    }

    setPost([...tempPostArr])
    await api.put("/user_like/" + post_id, { likes: temp_likes, user_id })
    const notification_id = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))


    if (!is_user_liked && post_user_id != user_id) {
      const createdAt = new Date()
      globalSocket.socket.emit("send_notification", { share, text_post, pic_post, post_id, createdAt, status: `likes your post`, post_user_id, user, user_id, likes: temp_likes, comments, _id: notification_id, profile_pic })
    }

  }


  const handleFriendsData = async (friend_profile_pic, friend, friend_id) => {
    if (chat?.length) {
      setChat([])
    }
    const id = friend_id + user_id;
    setChatOpen(!chatOpen)
    setFriendInfo({ friend, friend_id, friend_profile_pic })
    await api.post("/create_chat/" + id)
  }




  return (
    <>
      <Row className="home-wrapper">
        <Col lg={{ span: 18 }}>
          <div className='user-content'>
            <div className="new_post_wrapper">
              <NewPost
                user={user}
                profile_pic={profile_pic}
                handleImg={handleImg}
                uploadPic={uploadPic}
                selected={selected}
                handlePost={handlePost}
                postLoading={postLoading}
                setTextPost={setTextPost}
                user_id={user_id}
              />
            </div>
            <div className="post-container">
              {!loading ? post?.map((it, i) =>
                <div className="fb-post-wrapper">
                  <PostList
                    fetchPost={fetchPost}
                    handlePostStatus={handlePostStatus}
                    {...it}
                  />
                </div>
              )
                :
                <LoaderIcon />
              }

              <Toaster
                position="top-center"
                reverseOrder={false}
              />
            </div>
          </div>
        </Col>
        <Col>
          <div>
            <FriendList friends={friends} handleFriendData={handleFriendsData} />
          </div>
          {friendInfo && chatOpen && <Chat {...friendInfo} setChatClose={() => setChatOpen(false)} />}
        </Col>
      </Row>
    </>
  );
};

