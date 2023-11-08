import React from 'react';
import {
    FileImageOutlined
} from '@ant-design/icons';
import { Button } from 'antd';

const NewPost = (
    {
        handleImg,
        selected,
        uploadPic,
        postLoading,
        handlePost,
        user,
        profile_pic,
        setTextPost,
        user_id
    }
) => {

    const visitProfile = (user_id) => {
        window.location.href = `/profile/${user_id}`
    }

    return (
        <div className="new_post">
            <div className="user-info">
                <img onClick={() => visitProfile(user_id)} className="profile_pic"
                    src={profile_pic}
                />
                <div className='user-post-status'>
                    <span onClick={() => visitProfile(user_id)} className='name'>{user}</span>
                </div>
            </div>
            <div className="post-area">
                <textarea
                    id="text-area"
                    placeholder="Write whats on your mind!"
                    className="post-input"
                    onChange={(e) => setTextPost(e.target.value)}
                >
                </textarea>
                {selected && <input type="image" className="post-img" src={selected} />}
                <div className="add-pic" onClick={uploadPic}>
                    <FileImageOutlined size={25} />
                    <span>Add photo</span>
                </div>
                <input id="upload-pic" type="file" style={{ visibility: "hidden" }} onChange={handleImg} />
            </div>
            <Button
                loading={postLoading}
                disabled={postLoading}
                className="post-btn"
                onClick={handlePost}
            >
                Post
            </Button>
        </div>
    )
}

export default NewPost