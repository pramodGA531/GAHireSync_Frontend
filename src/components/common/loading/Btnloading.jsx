import React from "react";
import { Spin } from "antd";

const Btnloading = ({ spincolor }) => {
    return (
        <>
            <style>
                {`
            .white-spinner .ant-spin-dot-item {
              color: white !important;
            }
            .blue-spinner .ant-spin-dot-item {
              color: #488CD3 !important;
            }
            `}
            </style>
            <Spin size="small" className={spincolor} />
        </>
    );
};

export default Btnloading;
