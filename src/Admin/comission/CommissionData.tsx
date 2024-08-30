import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import '../../components/style.css';
import { TableColumnsType, Menu } from 'antd';
import { GETDATA } from '../../APIurl/url';
import { V1Delete } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { Tabs, Tab } from '@nextui-org/react';
import debounce from 'lodash.debounce';
import { FetchData } from '../../FormHandler/FetchAction';
import Swal from 'sweetalert2';
import CommissionApprove from './ApprovdeCommission';
import SetCommission from './SetCommission';
import PaidCommission from './CompleteCommision';
interface DataType {
    key: string;
    highestEducation: string;
    studentId: string;
    firstName: string;
    email: string;
    lastName: string;
    nationality: string;
    owner: string;
    action: any;
    tags: string[];
}

const App: React.FC = () => {
    const token = userInfo('jwt');
    const [loading, setLoader] = useState(true);
    const [ClientRecord, setClientRecord] = useState([]);
    const [pagerefresh, setpageRefresh] = useState(true);
    const GetStudentData = async () => {
        setLoader(true);
        try {
            const responseData: any = await fetch(GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'AGENT_COMMISSION_PAYMENT_REQUEST',
                }),
            });
            const data = await responseData.json();

            setClientRecord(data.data);
            setLoader(false);
            setpageRefresh(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }
    };

    const debouncedGetStudentData = debounce(GetStudentData, 300);
    useEffect(() => {
        if (pagerefresh === true) {
            debouncedGetStudentData();
        }
    }, [pagerefresh]);

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Id',
            className: 'text-style',
            dataIndex: 'ID',
            key: 'ID',
            fixed: 'left',
            width: 100,
            render: (event) => (
                <span className="td_value" data-column="Id">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Agent Name',
            width: 250,
            render: (event) => (
                <span className="td_value" data-column="Agent Name">{event.AGNET_NAME}</span>
            ),
        },
        {
            className: 'text-style',
            title: 'Agent Email',
            width: 250,
            render: (event) => (
                <span className="td_value" data-column="Agent Email"> {event.AGNET_EMAIL}</span>
            ),
        },
        {
            className: 'text-style',
            title: 'Client Name',
            width: 250,
            render: (event) => (
                <span className="td_value" data-column="Client Name">
                    {event.FIRST_NAME} {event.LAST_NAME}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Application Country',
            render: (event) => {
                const countryList = JSON.parse(event.ApplicationCountry);
                const uniqueCountryNames = Array.from(new Set(countryList.map((value: any) => value.SERVICE_COUNTRY_NAME))).join(', ');

                return <span className="td_value" data-column="Application Country">{uniqueCountryNames}</span>;
            },
        },
        {
            className: 'text-style',
            title: 'Application Services',
            render: (event) => {
                const Services = JSON.parse(event.ClientServicess);
                const uniqueCountryNames = Array.from(new Set(Services.map((value: any) => value.SERVICE_NAME))).join(', ');

                return <span className="td_value" data-column="Application Services">{uniqueCountryNames}</span>;
            },
        },
        {
            className: 'text-style',
            title: 'Commission Price',
            render: (event) => (
                <span className="td_value" data-column="Commission Price">
                    {event.CURRENCY_TYPE}
                    {event.COMMISSION_PRICE}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Application File Current Status',
            dataIndex: 'FINAL_FILE_STATUS',
            key: 'FINAL_FILE_STATUS',
            width: 150,
            render: (event) => (
                <span className="td_value" data-column="Application File Current Status">
                    {event ? event : '----'}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Commission Status',
            dataIndex: 'PAID_COMMSSION_STATUS',
            key: 'PAID_COMMSSION_STATUS',
            width: 150,
            render: (event) => (
                <span className="td_value" data-column="Commission Status">
                    {event ? event : '---'}
                </span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Action',
            fixed: 'right',
            render: (event) => (
                <div className="flex set_btn_margin">
                    <SetCommission data={event} setpageRefresh={setpageRefresh} />
                    <CommissionApprove data={event} setpageRefresh={setpageRefresh} />
                </div>
            ),
            width: 100,
        }

    ];
    const [leftOffset, setLeftOffset] = useState(0); // Initial left offset
    const tableRef: any = useRef(null); // Ref for the table container

    // Function to handle mouse move for scrolling
    const moveScroll = (event: any) => {
        const movementX = event.nativeEvent.movementX;
        const newLeftOffset = leftOffset + movementX;

        // Adjust these constants based on your specific setup
        const minLeftOffset = 0;
        const maxLeftOffset = 55; // Adjust this based on your actual maximum scroll width

        // Ensure newLeftOffset stays within the min-max range
        if (newLeftOffset >= minLeftOffset && newLeftOffset <= maxLeftOffset) {
            setLeftOffset(newLeftOffset);
            if (tableRef.current) {
                tableRef.current.scrollLeft = '500px';
                console.log(tableRef.current.clientWidth);
                tableRef.current.scrollLeft = (newLeftOffset / maxLeftOffset) * (tableRef.current.scrollWidth - tableRef.current.clientWidth);
            }
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl">
            <div>
                <ul className="flex justify-between">
                    <li>
                        <h4 className="bold-font-700 font-32px">Payment & Commission Request</h4>
                    </li>
                    <li>
                        <button className="btn btn-white btn-sm" onClick={() => { setpageRefresh(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                        </button>
                    </li>
                </ul>
            </div>
            <div className="w-full flex flex-col mt-10">
                <div className="">
                    <Tabs aria-label="Tabs radius" radius="lg" className="text-black">
                        <Tab key="Commission pay request" title="Commission Approval Request">
                            <div className="table-background scroll-container" ref={tableRef}>
                                <Table className="" columns={columns} dataSource={ClientRecord} loading={loading} />
                                <div id="mini-map" className="css-18v91cr">
                                    <div className="css-hxyrcv">
                                        <span style={{ display: 'inline-flex' }}>
                                            <div aria-label="column-0" className="css-1czhqfs" />
                                            <div aria-label="column-1" className="css-1czhqfs" />
                                            <div aria-label="column-2" className="css-1czhqfs" />
                                            <div aria-label="column-3" className="css-1czhqfs" />
                                            <div aria-label="column-4" className="css-1czhqfs" />
                                            <div aria-label="column-5" className="css-1czhqfs" />
                                            <div aria-label="column-6" className="css-1czhqfs" />
                                            <div aria-label="column-7" className="css-1czhqfs" />
                                        </span>
                                        <div className="css-11cntbg" style={{ left: `${leftOffset}px` }} onMouseMove={moveScroll} />
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab key="PayCommission" title="Payed Commission">
                            <PaidCommission />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default App;
