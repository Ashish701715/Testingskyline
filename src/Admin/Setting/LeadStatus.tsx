import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import '../../components/style.css';
import { TableColumnsType, Menu, message } from 'antd';
import { NavLink } from 'react-router-dom';
import { GETDATA } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { EyeOutlined, DeleteOutlined, MailOutlined, FileDoneOutlined, MoreOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import debounce from 'lodash.debounce';
import { FetchData } from '../../FormHandler/FetchAction';
import { Chip } from '@nextui-org/react';
import Swal from 'sweetalert2';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import EditModal from './EditModal';
import AddNewStatus from './AddLeadStatus';
import { assert } from 'console';
const App: React.FC = () => {
    const [loading, setLoader] = useState(true);
    const [limit, setlimit] = useState(10);
    const [page, setpage] = useState(1);
    const [status, setStatus] = useState([]);
    const ApiToken = userInfo('jwt');
    const [reloading, setreloading] = useState(true);
    const GetStudentData = async () => {
        setLoader(true);
        try {
            const body = JSON.stringify({
                PAGE_REQUEST: 'GET_LEAD_STATUS_DATA_ADMIN_SIDE',
            });

            const Header = {
                Authenticate: `Bearer ${ApiToken}`,
            };

            const method = 'POST';
            const CallApiRequest = await FetchData(GETDATA, body, method, Header);
            const response = await CallApiRequest;
            setStatus(response['data']);
            setLoader(false);
            setreloading(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }
    };

    const DeleteData = async (event: any) => {
        if (event.IS_EDIT === 'false') {
            message.error("This status data can't be deleted because it is not editable.");
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const body = JSON.stringify({
                PAGE_REQUEST: 'GET_LEAD_STATUS_DATA_DELETE',
                DATA: event,
            });

            //Headers Components
            const Header = {
                Authenticate: `Bearer ${ApiToken}`,
            };
            const method = 'POST';

            try {
                const CallApiRequest = await FetchData(GETDATA, body, method, Header);
                if (CallApiRequest.status === true) {
                    Swal.fire({
                        title: CallApiRequest.message,
                        icon: 'success',
                    });
                    setreloading(true);
                } else {
                    Swal.fire({
                        title: CallApiRequest.message,
                        icon: 'error',
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: 'An error occurred',
                    icon: 'error',
                });
            }
        }
    };

    const debouncedGetStudentData = debounce(GetStudentData, 300);
    useEffect(() => {
        if (reloading === true) {
            debouncedGetStudentData();
        }
    }, [reloading]);

    const columns: TableColumnsType = [
        {
            title: 'ID',
            className: 'text-style',
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
            render: (event) => (
                <span data-column="id">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'STATUS NAME',
            dataIndex: 'STATUS',
            key: 'STATUS',
            width: 150,
            render: (event) => (
                <span data-column="STATUS NAME">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'LAST UPDATE',
            dataIndex: 'UPDATED_AT',
            key: 'UPDATED_AT',
            width: 50,
            render: (event) => (
                <span data-column="LAST UPDATE">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'BG COLOR',
            dataIndex: 'BG_COLOR',
            key: 'BG_COLOR',
            width: 50,
            render: (event) => (
                <span data-column="BG COLOR">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'TEXT COLOR',
            dataIndex: 'TEXT_COLOR',
            key: 'TEXT_COLOR',
            width: 50,
            render: (event) => (
                <span data-column="TEXT COLOR">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Editable',
            dataIndex: 'IS_EDIT',
            key: 'IS_EDIT',
            width: 100,
            render: (event) => (
                <Chip data-column="Editable" variant="flat" key={event} className={`text-${event == 'false' ? 'danger' : 'success'} Editable4`}>
                    {event}
                </Chip>
            ),
        },
        {
            className: 'text-style',
            title: 'Action',
            width: 50,
            render: (event) => (
                <Dropdown
                    key={event.ID}
                    className="min-w-[50px]"

                    classNames={{
                        base: 'before:bg-default-200', // change arrow background
                        content: 'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                    }}
                >
                    <DropdownTrigger key={event.ID}>
                        <span className='action_btn_lead4 w-6' data-column="Action" >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                />
                            </svg>
                        </span>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dynamic Actions" variant="faded">
                        <DropdownItem
                            key={event.ID}
                            onClick={() => {
                                EditStatusSection(event);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </DropdownItem>
                        <DropdownItem
                            key={event.ID}
                            onClick={() => {
                                DeleteData(event);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            ),
        },
    ];
    const [leftOffset, setLeftOffset] = useState(0);
    const tableRef: any = useRef(null);
    const moveScroll = (event: any) => {
        const movementX = event.nativeEvent.movementX;
        const newLeftOffset = leftOffset + movementX;
        const minLeftOffset = 0;
        const maxLeftOffset = 55;
        if (newLeftOffset >= minLeftOffset && newLeftOffset <= maxLeftOffset) {
            setLeftOffset(newLeftOffset);
            if (tableRef.current) {
                tableRef.current.scrollLeft = '500px';
                tableRef.current.scrollLeft = (newLeftOffset / maxLeftOffset) * (tableRef.current.scrollWidth - tableRef.current.clientWidth);
            }
        }
    };

    const [isEdit, setEdit] = useState(false);
    const [EditStausValue, setEditStatusValue] = useState({});
    const EditStatusSection = (event: any) => {
        setEdit(true);
        setEditStatusValue(event);
    };

    return (
        <>
            {isEdit && <EditModal setEdit={setEdit} EditValue={EditStausValue} refrehpage={setreloading} />}
            <div className={`table-background scroll-container `} ref={tableRef}>
                <div className="w-[150px] m-3">
                    <AddNewStatus />
                </div>
                <Table className="my-class-table table table_phone_width" columns={columns} dataSource={status} scroll={{ x: 2000 }} loading={loading} />

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
        </>
    );
};

export default App;
