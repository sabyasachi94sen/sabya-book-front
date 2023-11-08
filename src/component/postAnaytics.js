import React, { useState } from 'react';
import {
    LikeOutlined,
    LikeFilled,
    MessageOutlined,
    ShareAltOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Modal, Space, Avatar, Dropdown } from "antd";
import { setSelectionRange } from '@testing-library/user-event/dist/utils';
import api from '../utils/api';

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


const PostAnalytics = ({ likes, comments, share, handleShare, handlePostStatus, pic_post, text_post, post_user_id, post_id, user_id, is_user_liked, handleComment }) => {

    const shareDropdown = [
        getItem(<div onClick={handleShare}>Share in Feed</div>, 'share in feed', <ShareAltOutlined />, null),
        // getItem('Share in profile', 'share in profile', <ShareAltOutlined />, null), ,
    ];

    return (
        <div className="post-analytics">
            <Row gutter={32}>
                <Col span={8} onClick={() => handlePostStatus(post_id, likes, user_id, comments, post_user_id, pic_post, text_post, share)}>
                    <div className="gutter-box">
                        {!is_user_liked ?
                            <LikeOutlined />
                            :
                            <LikeFilled style={{ color: "#0077CC" }} />
                        }
                        <span>Like</span>
                        <span className="likes">{likes?.length}</span>
                    </div>
                </Col>
                <Col span={8} onClick={handleComment}>
                    <div className="gutter-box">
                        <MessageOutlined />
                        <span>Comment</span>
                        <span className="comments">{comments?.length}</span>
                    </div>
                </Col>
                <Col span={8}>
                    <Dropdown menu={{ items: shareDropdown }} placement="bottomCenter" trigger={['click']}>
                        <div className="gutter-box">
                            <ShareAltOutlined />
                            <span>Share</span>
                            <span className="share">{share?.length}</span>
                        </div>
                    </Dropdown>
                </Col>
            </Row>
        </div>
    )
}

export default PostAnalytics;