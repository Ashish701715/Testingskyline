import { Col, Row } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload, Popover, Tag } from 'antd';
import { Empty } from 'antd';
import { NavLink } from 'react-router-dom';
import { GETDATA } from '../../../APIurl/url';
import DocumentAdd from '../helper_modal/documentAdd';
import { useParams } from 'react-router-dom';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import Blank from '../tab/blank';
import { useEffect, useState } from 'react';
const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

const { Dragger } = Upload;
const Document = () => {
    const [loaddata, setloaddata] = useState(true);
    const Token = jwt('jwt');
    const { client_id } = useParams();
    const [DocumentData, setDocumentData] = useState([]);
    const documentlist = async () => {
        const get = await fetch(GETDATA + '?action=fetchdocument&dataget=true', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
                'x-token-access': `true`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_DOCUMENT_LIST_DATA_REQUEST_WITH_STATUS',
                ClientId: client_id,
            }),
        });

        const res = await get.json();
        if (res.status === true && res.data.length > 0) {
            setDocumentData(res.data);
            setloaddata(false);
        } else {
            setDocumentData([]);
            setloaddata(false);
        }
    };

    useEffect(() => {
        documentlist();
    }, []);

    return (
        <>
            <div className="flex justify-end ">
                <DocumentAdd />
            </div>
            <Row className="mt-3">
                <Col span={10}>
                    <Dragger {...props} disabled> 
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.</p>
                        <p className="ant-upload-hint">Please Upload only COLOR SCAN COPY</p>
                    </Dragger>
                </Col>
                <Col span={1} className=""></Col>
                <Col span={13} className="scroll-bar-css">
                    {/* <Empty description="It looks like the documents haven't been uploaded yet."/> */}
                    <table id="filehistory" className="table table-borderless">
                        <tbody className="scroller-class-table">
                            {loaddata ? (
                                <Blank />
                            ) : (
                                <>
                                    {DocumentData.length > 0 ? (
                                        DocumentData.map((value: any, index) => (
                                            <tr key={index}>
                                                <td width="10%" valign="top">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[50px] font-thin">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                        />
                                                    </svg>
                                                </td>
                                                <td width="80%">
                                                    <p>
                                                        <span className="document-name">{value.DOCUMENT_NAME}</span>
                                                        <br />
                                                        <span className="document-size font-Nunito">
                                                            {value.REQUEST_UPDATE_AT} | <b>Type: </b> <span className="font-Nunito">{value.DOCUMENT_TYPE}</span>
                                                        </span>
                                                    </p>
                                                </td>
                                                <td>{(value.IS_UPLOAD_STATUS !=="FALSE") ? <Tag color="green">Uploaded</Tag> : <Tag color="blue">Not Upload</Tag>}</td>
                                                <td>
                                                    <Popover placement="top" content={'View Document'}>
                                                        <NavLink to="#">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] ">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                                />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </svg>
                                                        </NavLink>
                                                    </Popover>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <Empty description="It looks like the documents haven't been uploaded yet." />
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    );
};
export default Document;
