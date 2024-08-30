import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { Tabs, Tab } from '@nextui-org/react';
import './style.css';
import Infomation from './tab/student_infomation';
import Comment from './tab/Comment';
import ApplicationList from './tab/application_list';
import CourseDetails from './tab/course';
import Document from './tab/document';
import ApplicationHistory from './tab/application_history';
import { GETDATA } from '../../APIurl/url';
import { useParams } from 'react-router-dom';
import gettoken from '../../getLoggedUser/GetUserInfomation';

const App: React.FC = () => {
    const { client_id } = useParams();
    const { encrypt_id } = useParams();
    const [ClientInformation, setInformation]: any = useState([]);
    const token = gettoken('jwt');
    const ClientInfomation = async () => {
        try {
            const res = await fetch(GETDATA + '?Action=clientInfomation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'STUDENT_DATA_VIEW_FULL_RECORD',
                    ClientId: client_id,
                    Encrypt_id: encrypt_id,
                }),
            });
            const data = await res.json();
            if (data.data.length > 0) {
                setInformation(data.data[0]);
            } else {
                setInformation([]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        ClientInfomation();
    }, []);

    return (
        <>
            <Card bordered={false} style={{ width: '100%' }}>
                <h1 className="Application-Heading">Application History </h1>
                <div className="grid-12">
                    <ul className="flex">
                        <li className="text-heading"> STUDENET ID:</li>
                        <li className="text-content ml-2"> {ClientInformation.UUID} </li>
                    </ul>

                    <ul className="flex">
                        <li className="text-heading"> STUDENET NAME:</li>
                        <li className="text-content ml-2">
                            {' '}
                            {ClientInformation.FIRST_NAME} {ClientInformation.MIDDLE_NAME} {ClientInformation.LAST_NAME}{' '}
                        </li>
                    </ul>
                </div>
            </Card>
            {/* //Infomaion Section */}
            <Card bordered={false} style={{ width: '100%' }} className="mt-3">
                <div className="Tab-Section">
                    <Tabs disabledKeys={['music']} aria-label="Disabled Options" radius={'full'}>
                        <Tab
                            key="Student - Details"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                                        />
                                    </svg>

                                    <span>Client Infomation</span>
                                </div>
                            }
                        >
                            <Infomation Clientinfo={ClientInformation} />
                        </Tab>
                        <Tab
                            key="Course Details"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                                        />
                                    </svg>

                                    <span>Course Details</span>
                                </div>
                            }
                        >
                            <CourseDetails className="mt-5" ClientInformation={ClientInformation} />
                        </Tab>
                        <Tab
                            key="Document/Download"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                        />
                                    </svg>

                                    <span>Document/Download</span>
                                </div>
                            }
                        >
                            <Document />
                        </Tab>
                        <Tab
                            key="Comment"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                        />
                                    </svg>

                                    <span>Comment</span>
                                </div>
                            }
                        >
                            <Comment className="mt-5" />
                        </Tab>

                        <Tab
                            key="Application Data"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                                        />
                                    </svg>

                                    <span>Application History</span>
                                </div>
                            }
                        >
                            <ApplicationHistory />
                        </Tab>
                        <Tab
                            key="Offer Letter"
                            title={
                                <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                        />
                                    </svg>

                                    <span>Application Application Files</span>
                                </div>
                            }
                        >
                            <ApplicationList className="mt-5 table-background scroll-container" />
                        </Tab>
                    </Tabs>
                </div>
            </Card>
        </>
    );
};

export default App;
