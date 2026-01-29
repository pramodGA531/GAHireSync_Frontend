import React, { useState } from 'react';
import { Modal, Button, Input, Select, Upload, Form, InputNumber, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useAuth } from '../common/useAuth';
import dayjs from 'dayjs';
import CustomDatePicker from '../common/CustomDatePicker';

const { Option } = Select;


const ApplyJobOutsider = ({ fillApplication, setFillApplication, job_id, job_locations }) => {
    const [form] = Form.useForm();
    const { apiurl } = useAuth();
    const job_status = Form.useWatch('job_status', form);
    const [buttonLoading, setButtonLoading] = useState(false)


    const handleFinish = async (values) => {
        const formData = new FormData();
        const resumeFile = values.resume?.[0]?.originFileObj;
        if (resumeFile) {
            formData.append('resume', resumeFile);
        }
        if (values.date_of_birth) {
            values.date_of_birth = dayjs(values.date_of_birth).format('YYYY-MM-DD');
        }
        Object.entries(values).forEach(([key, value]) => {
            if (key !== 'resume') {
                formData.append(key, value);
            }
        });

        setButtonLoading(true);

        try {
            const response = await fetch(`${apiurl}/candidate/sendapplication/?job_id=${job_id}`, {
                method: 'POST',
                body: formData
            },
            )

            const data = await response.json()
            if (data.error) {
                setButtonLoading(false)
                message.error(data.error)
                return
            }
            if (data.message) {

                message.success(data.message)
                form.resetFields()
            }
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setButtonLoading(false);
        }
    };

    return (
        <Modal
            title="Candidate Application Form"
            open={fillApplication}
            onCancel={() => setFillApplication(false)}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    date_of_birth: dayjs('2000-01-01')
                }}
            >
                <Form.Item
                    name="resume"
                    label="Resume"
                    valuePropName="fileList"
                    getValueFromEvent={e => Array.isArray(e?.fileList) ? e.fileList : []}
                    rules={[{ required: true, message: 'Resume file is required' }]}
                >
                    <Upload
                        beforeUpload={(file) => {
                            const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type);
                            if (!isValidType) {
                                Modal.error({ title: 'Unsupported file type', content: 'Only PDF or Word documents are allowed.' });
                                return Upload.LIST_IGNORE;
                            }

                            const isLt150KB = file.size / 1024 < 150;
                            if (!isLt150KB) {
                                Modal.error({ title: 'File too large', content: 'File must be smaller than 150KB.' });
                                return Upload.LIST_IGNORE;
                            }

                            return false;
                        }}
                    >
                        <Button icon={<UploadOutlined />}>Upload Resume</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    name="candidate_name"
                    label="Candidate Name"
                    rules={[
                        { required: true, message: 'Candidate name is required' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, digits, and underscores allowed (no spaces)' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="candidate_email"
                    label="Email"
                    rules={[
                        { type: 'email', message: 'Please enter a valid email address' },
                        { required: true, message: 'Email is required' },
                    ]}
                >
                    <Input type="email" />
                </Form.Item>

                <Form.Item
                    name="contact_number"
                    label="Contact Number"
                    rules={[
                        { required: true, message: 'Contact number is required' },
                        { pattern: /^\d+$/, message: 'Only digits allowed' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="alternate_contact_number"
                    label="Alternate Contact Number"
                    rules={[
                        { pattern: /^\d+$/, message: 'Only digits allowed' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="experience" label="Experience (years)" 
                 rules={[{ required: true, message: 'Experience is required' }]}
                 >
                    <InputNumber style={{ width: '100%' }} min={0} step={0.1} />
                </Form.Item>

                <Form.Item name="job_status" label="Job Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="working">Working</Option>
                        <Option value="not_working">Not Working</Option>
                        <Option value="serving_notice">Serving Notice</Option>
                    </Select>
                </Form.Item>

                {(job_status === 'working' || job_status === 'serving_notice') && (
                    <>
                        <Form.Item name="current_organization" label="Current Organisation">
                            <Input />
                        </Form.Item>
                        <Form.Item name="current_job_location" label="Current Job Location">
                            <Input />
                        </Form.Item>
                        <Form.Item name="notice_period" label="Notice Period (days)">
                            <InputNumber style={{ width: '100%' }} min={0} />
                        </Form.Item>
                        <Form.Item name="current_ctc" label="Current CTC">
                            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                        </Form.Item>
                        <Form.Item name="current_job_type" label="Current Job Type">
                            <Select>
                                <Option value="permanent">Permanent</Option>
                                <Option value="contract">Contract</Option>
                            </Select>
                        </Form.Item>
                    </>
                )}

                <Form.Item
                    name="date_of_birth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'DOB is required' }]}
                >
                    <CustomDatePicker size='sm' defaultValue={dayjs("2000-01-01").toDate()} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item name="expected_ctc" label="Expected CTC"
                    rules={[{ required: true, message: 'Expected CTC is required' }]}>
                    <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                </Form.Item>

                <Form.Item
                    name="highest_qualification"
                    label="Highest Qualification"
                    rules={[{ required: true, message: 'Highest Qualification is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="joining_days_required"
                    label="Joining Days Required"
                    rules={[{ required: true, message: 'Joining Days is required' }]}
                >
                    <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>

                <Form.Item name="other_details" label="Other Details">
                    <Input />
                </Form.Item>

                <Form.Item name="location" label="Select Location"

                    rules={[{ required: true, message: 'location is required' }]}
                >
                    <Select>
                        {job_locations?.map((item, val) => (
                            <Option value={item}>{item}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {buttonLoading ? "Submitting" : "Submit"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ApplyJobOutsider;
