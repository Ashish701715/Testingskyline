import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import './style.css';
import { TableColumnsType, Dropdown, Menu } from 'antd';

import { NavLink } from 'react-router-dom';
import { GETDATA } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { EyeOutlined, DeleteOutlined, MailOutlined, FileDoneOutlined, MenuOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined, CheckOutlined } from '@ant-design/icons';
import jwt from '../../getLoggedUser/GetUserInfomation';
import FileTransferModal from './modal/Student_File_Transfer';
import { Tag } from 'antd';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { Pagination } from '@nextui-org/react';
import debounce from 'lodash.debounce';
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
    const token = jwt('jwt');
    const [loading, setLoader] = useState(true);
    const [limit, setlimit] = useState(10);
    const [page, setpage] = useState(1);
    const [dataview, setdataview] = useState('asc');
    const [viewCol, setviewCol] = useState('ID');
    const [total_record, set_total_record] = useState(0);
    const [ApplicationId, setApplicationId] = useState('');
    const [PassportNumber, setPassportNumber] = useState('');
    const [StudentNameEmail, setStudentNameEmail] = useState('');
    const [ClientRecord, setClientRecord] = useState([]);
    const [pagerefresh, setpageRefresh] = useState(false);
    const GetStudentData = async () => {
        setLoader(true);
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                GETDATA +
                '?action=view.client.record&limit=' +
                limit +
                '&page=' +
                page +
                '&orderby=' +
                dataview +
                '&orderCol=' +
                viewCol +
                '&ApplicationId=' +
                ApplicationId +
                '&passportId=' +
                PassportNumber +
                '&StudentNameEmail=' +
                StudentNameEmail,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                        'x-token-access': 'true',
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'STUDENT_DATA_NEW',
                        RequesterUser: 'agent',
                        userId: UserAuthID,
                    }),
                }
            );
            const data = await responseData.json();

            setClientRecord(data.data);
            set_total_record(data.total);
            setLoader(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }
    };

    const storedUserId = sessionStorage.getItem('studentdataloader');
    const debouncedGetStudentData = debounce(GetStudentData, 300);
    useEffect(() => {
        debouncedGetStudentData();
        if (storedUserId) {
            sessionStorage.clear();
        }
    }, [ApplicationId, PassportNumber, StudentNameEmail, viewCol, dataview, pagerefresh]);

    function TableView(pagination: any, filters: any, sorter: any, extra: any) {
        setviewCol(sorter.columnKey);
        setdataview(sorter.order == 'ascend' ? 'asc' : 'desc');
    }

    const onChangePage = (page: any, pageSize: any) => {
        setpage(page);
        setlimit(pageSize);
    };
    const items: any['items'] = [
        {
            label: '1st menu item',
            key: '1',
            icon: <EyeOutlined />,
        },
        {
            label: '2nd menu item',
            key: '2',
            icon: <EyeOutlined />,
        },
        {
            label: '3rd menu item',
            key: '3',
            icon: <EyeOutlined />,
            danger: true,
        },
        {
            label: '4rd menu item',
            key: '4',
            icon: <EyeOutlined />,
            danger: true,
            disabled: true,
        },
    ];

    //File Transfer
    function FileTransfer(event: any) {
        setTransferFile(true);
        setTransferFileInfo(event);
    }

    const [isfileTransfer, setTransferFile] = useState(false);
    const [isfileTransferInfo, setTransferFileInfo] = useState('');
    const menu = (event: any, fullInfo: any) => (
        <Menu>
            <Menu.Item key="1">
                <NavLink to={`/agent/client/view/${fullInfo.ID}/${fullInfo.CLIENT_ID}`} className="ml-3">
                    <EyeOutlined className="text-blue-900" title="view and edit client record" /> View
                </NavLink>
            </Menu.Item>
            <Menu.Item key="3">
                <NavLink to="#" className="ml-3" onClick={() => FileTransfer(event)}>
                    <FileDoneOutlined className="text-green-700" title="Transfer File" /> Transfer File
                </NavLink>
            </Menu.Item>

        </Menu>
    );

    const RenderFunction = ({ color, children }: any) => {
        if (children === 'Rivew') {
            return <Tag data-column="FILE STATUS" color="processing">{children}</Tag>;
        } else if (children === 'On-Hold') {
            return <Tag data-column="FILE STATUS" color="warning">{children}</Tag>;
        } else if (children === 'Completed') {
            return <Tag data-column="FILE STATUS" color="success">{children}</Tag>;
        } else if (children === 'Transfer') {
            return <Tag data-column="FILE STATUS" color="success">{children}</Tag>;
        } else if (children === 'Not-accepted') {
            return <Tag data-column="FILE STATUS" color="success">{children}</Tag>;
        } else if (children === 'In-Hand') {
            return <Tag data-column="FILE STATUS" color="processing">{children}</Tag>;
        } else {
            return <Tag data-column="FILE STATUS" color="default">{children}</Tag>;
        }
    };
    const columns: TableColumnsType<DataType> = [
        {
            className: 'text-style text-center',
            title: 'MENU',
            fixed: 'right',
            render: (event, fullInfo) => (
                <>
                    <Dropdown overlay={menu(event, fullInfo)} trigger={['click']}>
                        <a data-column="ACTION" className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                            <MenuOutlined />
                        </a>
                    </Dropdown>
                </>
            ),
            width: 100,
        },
        {
            title: 'ID',
            className: 'text-style',
            dataIndex: 'ID',
            key: 'ID',
            fixed: 'left',
            width: 100,
            render: (event, fullInfo: any) => (
                <NavLink to={`/agent/client/view/${event}/${fullInfo.CLIENT_ID}`} className="text-color-blue" data-column="ID" >
                    {event}

                </NavLink>
            ),
        },
        {
            className: 'text-style',
            title: 'EMAIL',
            dataIndex: 'EMAIL',
            key: 'EMAIL',
            width: 250,
            render: (event) => (
                <NavLink to={`mailto:${event}`} className="text-color-blue" data-column="EMAIL">
                    {event}
                </NavLink>
            ),
        },
        {
            className: 'text-style',
            title: 'FIRST NAME',
            dataIndex: 'FIRST_NAME',
            key: 'FIRST_NAME',
            render: (text: string) => (
                <span data-column="First Name">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'LAST NAME',
            dataIndex: 'LAST_NAME',
            key: 'LAST_NAME',
            render: (text: string) => (
                <span data-column="LAST NAME">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'PHONE NUMBER',
            dataIndex: 'PHONE_NUMBER',
            key: 'PHONE_NUMBER',
            render: (text: string) => (
                <span data-column="PHONE NUMBER">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'DATE OF BIRTH',
            dataIndex: 'DATE_OF_BIRTH',
            key: 'DATE_OF_BIRTH',
            width: 150,
            render: (text: string) => (
                <span data-column="DATE OF BIRTH">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style text-center',
            title: 'COUNTRY OF CITIZENSHIP',
            dataIndex: 'COUNTRY_OF_CITIZENSHIP',
            key: 'COUNTRY_OF_CITIZENSHIP',
            width: 250,
            render: (text: string) => (
                <span data-column="COUNTRY OF CITIZENSHIP">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'PASSPORT',
            dataIndex: 'PASSPORT_NUMBER',
            key: 'PASSPORT_NUMBER',
            render: (text: string) => (
                <span data-column="PASSPORT NUMBER">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'PASSPORT EXPIRY DATE',
            dataIndex: 'PASSPORT_EXPIRY_DATE',
            key: 'PASSPORT_EXPIRY_DATE',
            render: (text: string) => (
                <span data-column="PASSPORT EXPIRY DATE">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style text-center',
            title: 'GENDER',
            dataIndex: 'GENDER',
            key: 'GENDER',
            width: 100,
            render: (text: string) => (
                <span data-column="GENDER">{text}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style text-center',
            title: 'FILE STATUS',
            dataIndex: 'AGENT_FILE_STATUS',
            key: 'AGENT_FILE_STATUS',
            fixed: 'right',
            width: 150,
            render: (event) => <RenderFunction color={event}>
                {event}
            </RenderFunction>,
        },

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
    const sizes = ['sm'];
    const table_heading: any = [
        { key: 'ID', label: 'ID' },
        { key: 'EMAIL', label: 'Email Id' },
        { key: 'FIRST_NAME', label: 'First Name' },
        { key: 'LAST_NAME', label: 'Last Name' },
        { key: 'PHONE_NUMBER', label: 'Phone Number' },
        { key: 'DATE_OF_BIRTH', label: 'Date Of Birth' },
        { key: 'Country Of Citizenship', label: 'Country Of Citizenship' },
        { key: 'PASSPORT_NUMBER', label: 'Passport' },
        { key: 'PASSPORT_EXPIRY_DATE', label: 'Passport Expiry Date' },
    ];
    const OrderBy: any = [
        { key: 'asc', label: 'asc' },
        { key: 'desc', label: 'desc' },
    ];

    const handleSearch = useCallback(
        debounce((searchTerm) => {
            setApplicationId(searchTerm);
        }, 200),
        []
    );

    const handleSearchPassport = useCallback(
        debounce((searchTerm) => {
            setPassportNumber(searchTerm);
        }, 200),
        []
    );

    const handleSearchNameEmail = useCallback(
        debounce((searchTerm) => {
            setStudentNameEmail(searchTerm);
        }, 200),
        []
    );

    const handleKeyDown = (event: any) => {
        const searchTerm = event.target.value;
        handleSearch(searchTerm);
    };

    const handleKeyDownPassport = (event: any) => {
        const searchTerm = event.target.value;
        handleSearchPassport(searchTerm);
    };

    const handleKeyDownName = (event: any) => {
        const searchTerm = event.target.value;
        handleSearchNameEmail(searchTerm);
    };

    return (
        <>
            {/* File Transfer Modal Code Hidden And View After Click Transfer Button   */}
            {isfileTransfer && <FileTransferModal setTransferFile={setTransferFile} isfileTransferInfo={isfileTransferInfo} />}
            <div>
                <ul className="flex justify-between">
                    <li>
                        <h4 className="bold-font-700 font-32px">Client Record</h4>
                    </li>
                    <li className="flex">

                        <button
                            className="btn modal-btn-custom"
                            onClick={() => {
                                pagerefresh ? setpageRefresh(false) : setpageRefresh(true);
                            }}
                        >
                            Refresh
                        </button>
                    </li>
                </ul>
            </div>
            <div className="grid grid-cols-5 gap-11 set_margin_bottom">
                <div className="col-span-3">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="h3_tag">Search Student Data</h3>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Input size={'sm'} type="text" className="color_placeholder" placeholder="Application ID" onChange={handleKeyDown} />
                            <Input size={'sm'} type="text" className="color_placeholder" placeholder="Passport Number" onChange={handleKeyDownPassport} />
                            <Input size={'sm'} type="text" className="color_placeholder" placeholder="Student Email" onChange={handleKeyDownName} />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="h3_tag">Filtter Column Name</h3>
                        {sizes.map((size) => (
                            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                <Select
                                    items={table_heading}
                                    placeholder="Select Column Heading"
                                    size={'sm'}
                                    onChange={(e) => {
                                        setviewCol(e.target.value);
                                    }}
                                >
                                    {(table_heading: any) => <SelectItem key={table_heading.key}>{table_heading.label}</SelectItem>}
                                </Select>
                                <Select
                                    items={OrderBy}
                                    // label="Select Column Heading"
                                    placeholder="Select Column Heading"
                                    size={'sm'}
                                    onChange={(e: any) => {
                                        setdataview(e.target.value);
                                    }}
                                >
                                    {(OrderBy: any) => <SelectItem key={OrderBy.key}>{OrderBy.label}</SelectItem>}
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="table-background scroll-container" ref={tableRef}>
                <Table
                    className="my-class-table table w-full"
                    columns={columns}
                    dataSource={ClientRecord}
                    scroll={{ x: 2000 }}
                    onChange={TableView}
                    loading={loading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: total_record,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        onChange: onChangePage,
                    }}
                />

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
            <div className="justify-end">{/* <Pagination total={10} initialPage={1} /> */}</div>
        </>
    );
};

export default App;
