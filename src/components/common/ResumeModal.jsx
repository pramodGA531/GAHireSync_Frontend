import React from "react";
import { Modal } from "antd";
import ResumeViewer from "./ResumeViewer";

const ResumeModal = ({ resume, showModal, setShowModal }) => {
    const handleCancel = () => {
        setShowModal(false);
    };

    return (
        <Modal
            open={showModal}
            footer={null}
            onCancel={handleCancel}
            width={800}
            style={{ top: 20 }}
            styles={{ padding: 0 }}
            destroyOnClose
        >
            <div style={{ height: "80vh" }}>
                <ResumeViewer
                    resume={resume}
                    onPrintScreenAttempt={() => setShowModal(false)}
                />
            </div>
        </Modal>
    );
};

export default ResumeModal;
