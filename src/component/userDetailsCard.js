import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from "antd"
import {
    UnorderedListOutlined
} from '@ant-design/icons';
import api from '../utils/api';
import getLocalStorage from '../helpers/getLocalStorage';

const tempObj = {
    degree: "",
    college: "",
    school: "",
    lives_in: "",
    from: "",
    marital_status: ""
}
function UserDetailsCard({ fetchProfile, user_id, userInfoInput, isProfileUpdate, userInfo, setUserInfoInput, setUserInfo, closeAllInput }) {

    const [updateLoading, setUpdateLoading] = useState(false)
    const [storeInfo, setStoreInfo] = useState(null)

    const { user_id: profile_id } = JSON.parse(getLocalStorage("user"))

    const handleUpdate = async () => {
        try {
            setUpdateLoading(true)
            await api.put("/user_info/" + user_id, storeInfo)
            setUpdateLoading(false)
            setUserInfo(storeInfo)
            closeAllInput()
            fetchProfile()
        }
        catch (err) {
            setUpdateLoading(false)
        }
    }


    const handleChange = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        setStoreInfo(userInfo)
    }, [userInfo])

    return (
        <Card className="profile-info">
            <p
            >
                <UnorderedListOutlined />
                {!userInfoInput?.degree ?
                    <span className='info' onClick={() => {
                        if (profile_id == userInfo?.profile_id)
                            setUserInfoInput({ ...userInfoInput, degree: true })
                    }}>
                        {userInfo?.degree ?
                            userInfo?.degree :
                            profile_id == userInfo?.profile_id ?
                                "Kindly fill your degree"
                                :
                                "Empty"
                        }
                    </span>
                    :
                    <textarea name="degree" onChange={handleChange} defaultValue={userInfo?.degree} ></textarea>
                }
            </p>
            <p
            ><UnorderedListOutlined />
                {!userInfoInput?.college ?
                    <span
                        className='info'
                        onClick={() => {
                            if (profile_id == userInfo?.profile_id)
                                setUserInfoInput({ ...userInfoInput, college: true })
                        }}
                    >{userInfo?.college ? userInfo?.college :
                        profile_id == userInfo?.profile_id ?
                            "Kindly fill your college" :
                            "Empty"
                        }
                    </span>
                    :
                    <textarea name="college" onChange={handleChange} defaultValue={userInfo?.college} ></textarea>
                }
            </p>
            <p><UnorderedListOutlined />
                {!userInfoInput?.school ?
                    <span
                        className='info'
                        onClick={() => {
                            if (profile_id == userInfo?.profile_id)
                                setUserInfoInput({ ...userInfoInput, school: true })
                        }
                        }
                    >{userInfo?.college ? userInfo?.school :
                        profile_id == userInfo?.profile_id ?
                            "Kindly fill your school"
                            :
                            "Empty"
                        }
                    </span>
                    :
                    <textarea onChange={handleChange} name="school" defaultValue={userInfo?.school} ></textarea>
                }
            </p>
            <p><UnorderedListOutlined />
                {!userInfoInput?.lives_in ?
                    <span
                        className='info'
                        onClick={() => {
                            if (profile_id == userInfo?.profile_id)
                                setUserInfoInput({ ...userInfoInput, lives_in: true })
                        }
                        }
                    >{userInfo?.lives_in ? "Lives in " + userInfo?.lives_in :
                        profile_id == userInfo?.profile_id ?
                            "Kindly fill your location"
                            :
                            "Empty"
                        }
                    </span>
                    :
                    <textarea name="lives_in" onChange={handleChange} defaultValue={userInfo?.lives_in} ></textarea>
                }
            </p>
            <p> <UnorderedListOutlined />
                {!userInfoInput?.from ?
                    <span
                        className='info'
                        onClick={() => {
                            if (profile_id == userInfo?.profile_id)
                                setUserInfoInput({ ...userInfoInput, from: true })
                        }
                        }
                    >{userInfo?.from ? "From " + userInfo?.from :
                        profile_id == userInfo?.profile_id ?
                            "Kindly fill your home town"
                            :
                            "Empty"
                        }
                    </span>
                    :
                    <textarea name="from" onChange={handleChange} defaultValue={userInfo?.from} ></textarea>
                }
            </p>
            <p> <UnorderedListOutlined />
                {!userInfoInput?.marital_status ?
                    <span
                        className='info'
                        onClick={() => {
                            if (profile_id == userInfo?.profile_id)
                                setUserInfoInput({ ...userInfoInput, marital_status: true })
                        }
                        }
                    >{userInfo?.marital_status ? userInfo?.marital_status :
                        profile_id == userInfo?.profile_id ?
                            "Kindly fill your marital status"
                            :
                            "Empty"
                        }
                    </span>
                    :
                    <textarea name="marital_status" onChange={handleChange} defaultValue={userInfo?.marital_status} ></textarea>
                }
            </p>
            {isProfileUpdate() &&
                <Button
                    loading={updateLoading}
                    disabled={updateLoading}
                    className="post-btn"
                    onClick={handleUpdate}
                >
                    Update
                </Button>}
        </Card>
    )
}

export default UserDetailsCard