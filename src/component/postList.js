import React from 'react';
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Modal } from "antd";
import parse from "html-react-parser"
import getLocalStorage from '../helpers/getLocalStorage';
import Comment from './comment';
import { useState } from 'react';
import CustomModal from './customModal';
import PostAnalytics from './postAnaytics';
import api from '../utils/api';


const PostList = (
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
    post_status
  }
) => {


  const [isOpen, setIsOpen] = useState(false)
  const { user_id, profile_pic: user_profile_pic, user: user_name } = JSON.parse(getLocalStorage("user"))
  const is_user_liked = likes.some((it) => it.user_id == user_id);
  const [comments, setComments] = useState(userComments)

  const handleComment = () => {
    setIsOpen(!isOpen)
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




  const handleShare = async () => {
    let tempStr;
    let separateLines;
    let htmlEle;

    if (text_post) {
      tempStr = text_post;
      separateLines = tempStr.split(/\r?\n|\r|\n/g);
      htmlEle = convertStringToHTML(separateLines)
    }
    else {
      htmlEle = null;
    }
    const createdAt = new Date()


    const payload = {
      user_id,
      user: user_name,
      profile_pic: user_profile_pic,
      pic_post: pic_post ? pic_post : null,
      text_post: htmlEle,
      likes: [],
      comments: [],
      share: [],
      createdAt
    }

    await api.post("/user_post", payload)
    fetchPost()
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

  const visitProfile = (user_id) => {
    window.location.href = `/profile/${user_id}`

  }




  return (
    <>
      <div className="fb-post">
        <div className="user-info">
          <img onClick={() => visitProfile(post_user_id)}
            className="profile_pic" src={profile_pic} />
          <div className='user-post-status'>
            <span onClick={() => visitProfile(post_user_id)}
              className='name'>{user}</span>
            {post_status && <span className='post-status'>{post_status}</span>}
            <span className='time'>{getTime(createdAt)}</span>
          </div>
        </div>
        <div className="post-info" >
          {text_post && <span className='text-post'>{parse(text_post)}</span>}
          {pic_post && <img onClick={() => setIsOpen(!isOpen)} className="fb-img" src={pic_post} />}
          <PostAnalytics
            handleShare={handleShare}
            likes={likes}
            share={share}
            comments={comments}
            user_id={user_id}
            handlePostStatus={handlePostStatus}
            is_user_liked={is_user_liked}
            handleComment={handleComment}
            post_id={_id}
            post_user_id={post_user_id}
            pic_post={pic_post}
            text_post={text_post}
          />
        </div>
      </div>
      {isOpen && <CustomModal
        isOpen={isOpen}
        likes={likes}
        share={share}
        pic_post={pic_post}
        handlePostStatus={handlePostStatus}
        is_user_liked={is_user_liked}
        comments={comments}
        onCancel={() => setIsOpen(!isOpen)}
        user_id={post_user_id}
        post_id={_id}
        text_post={text_post}
        post_user_id={post_user_id}
        user={user}
        fetchPost={fetchPost}
        setComments={setComments}
        createdAt={createdAt}
        post_profile_pic={profile_pic}
      />
      }
    </>
  )
}

export default PostList