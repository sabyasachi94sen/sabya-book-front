import { Modal } from 'antd';
import React from 'react'
import Comment from './comment';
import { useMediaQuery } from 'react-responsive'


const CustomModal = ({ post_status,post_profile_pic, createdAt, setComments, fetchPost, isOpen, comments, text_post, post_user_id, onCancel, user_id, post_id, user, pic_post, likes, share, is_user_liked, handlePostStatus }) => {

    const isMobile = useMediaQuery({
        query: '(max-width: 1024px)'
    })

    return (
        <Modal
            backdrop
            width={isMobile ? "100%" : "50%"}
            open={isOpen}
            footer={null}
            onCancel={onCancel}
            closable={false}
            centered
        >
            <Comment
                createdAt={createdAt}
                comments={comments}
                user_id={user_id}
                post_id={post_id}
                user={user}
                pic_post={pic_post}
                share={share}
                likes={likes}
                is_user_liked={is_user_liked}
                handlePostStatus={handlePostStatus}
                post_user_id={post_user_id}
                text_post={text_post}
                fetchPost={fetchPost}
                setComments={setComments}
                post_status={post_status}
                post_profile_pic={post_profile_pic}
            />
        </Modal>
    )
}

export default CustomModal;