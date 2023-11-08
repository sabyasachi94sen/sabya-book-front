import React from 'react'
import {Spin} from "antd"

const RenderLoader = () => {
    return (
        <div style={{
            position: "fixed",
            width: "100%",
            height: "100vh",
            backgroundColor: "black",
            opacity: "0.5",
            top:0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex:999999999,
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <Spin />
        </div>
    )
}

export default RenderLoader;