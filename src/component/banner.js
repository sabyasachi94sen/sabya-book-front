import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import getLocalStorage from '../helpers/getLocalStorage';
import api from '../utils/api';
import CustomModal from './customModal';
import RenderLoader from './renderLoader';

const Banner = ({ fetchProfile, bannerData, userPost, userInfo, setUserPost, handlePostStatus }) => {

    const { profile_pic } = JSON.parse(getLocalStorage("user"));
    const [banner, setBanner] = useState(null)
    const [bannerPicPost, setBannerPicPost] = useState(null)
    const [bannerPicComments, setBannerPicComments] = useState(null)
    const [loading, setLoading] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [tempUserPost, setTempUserPost] = useState(userPost)
    const user_id = window.location.pathname.split("/")[2];
    const { user_id: logged_user_id, user } = JSON.parse(getLocalStorage("user"))


    const uploadBanner = () => {
        document.getElementById("banner").click();
    }

    const handleBanner = (e) => {
        try {
            const file = e.target.files[0];
            const sizeInBytes = file.size

            // if (Math.trunc(sizeInBytes / 1024) > 16) {
            //     toast.error("Max size be 16mb")

            // }
            // else {
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.addEventListener('load', async () => {
                    if (reader.result) {
                        setBanner(reader.result)
                    }
                });
            }


        } catch (error) {
            console.log(error);
        }

    }

    const updateBanner = async () => {
        try {
            setLoading(true)
            const createdAt = new Date();
            const { profile_pic, user } = JSON.parse(getLocalStorage("user"))
            const newPost = {
                user_id: Number(user_id),
                user,
                profile_pic: profile_pic,
                pic_post: banner,
                text_post: null,
                likes: [],
                comments: [],
                share: [],
                createdAt
            }
            await api.put("/user_banner/" + user_id, { banner: banner, newPost })
            setLoading(false)
            fetchProfile()
        }
        catch (err) {
            setLoading(false)
        }
    }

    const showBanner = () => {
        if (userInfo?.banner_pic_id) {
            setIsOpen(!isOpen)
            const post = tempUserPost.filter(it => it?._id == userInfo?.banner_pic_id)
            if (post?.length) {
                setBannerPicPost(post[0])
                setBannerPicComments(post[0]?.comments)
            }
        }
        else if (user_id == logged_user_id) {
            toast.error("Please upload a banner picture")
        }
        else {
            toast.error("No banner picture available")
        }
    }

    const handleBannerPicPost = (data) => {
        setBannerPicComments(data)
        for (let i = 0; i < tempUserPost?.length; i++) {
            if (tempUserPost[i]?._id == bannerPicPost._id) {
                tempUserPost[i].comments = data;
                break;
            }
        }
        setTempUserPost([...tempUserPost])
    }



    const is_user_liked = bannerPicPost?.likes?.some((it) => it.user_id == logged_user_id);

    useEffect(() => {
        if (banner)
            updateBanner()
    }, [banner])

    return (
        <>
            {loading && <RenderLoader />}
            <div className='banner-wrapper' >
                {logged_user_id == user_id &&
                    <div className='upload-banner-btn' onClick={uploadBanner}>
                        Edit Banner
                    </div>
                }
                <img className='banner-img' src={bannerData} onClick={showBanner} />
            </div>
            <input id="banner" onChange={handleBanner} type="file" style={{ position: "absolute", visibility: "hidden" }} />
            <Toaster />

            {isOpen && <CustomModal
                isOpen={isOpen}
                {...bannerPicPost}
                comments={bannerPicComments}
                handlePostStatus={handlePostStatus}
                is_user_liked={is_user_liked}
                onCancel={() => setIsOpen(!isOpen)}
                user_id={user_id}
                post_id={bannerPicPost?._id}
                post_user_id={bannerPicPost?.user_id}
                fetchPost={fetchProfile}
                setComments={handleBannerPicPost}
                post_profile_pic={bannerPicPost?.profile_pic}
            />}
        </>
    )
}

export default Banner;