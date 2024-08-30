import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import { TableColumnsType, Dropdown, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { ClockAPI } from '../APIurl/url';
import userInfo from '../getLoggedUser/GetUserInfomation';
import { EyeOutlined, DeleteOutlined, MailOutlined, FileDoneOutlined, MoreOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { Input, Select, SelectItem } from '@nextui-org/react';
import debounce from 'lodash.debounce';
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;
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
    const [limit, setlimit] = useState(10);
    const [page, setpage] = useState(1);
    const [dataview, setdataview] = useState('asc');
    const [viewCol, setviewCol] = useState('ID');
    const [total_record, set_total_record] = useState(0);
    const [Userid, setuserid] = useState('');
    const [dateRange, setDateRange] = useState(null);
    const [PassportNumber, setPassportNumber] = useState('');
    const [StudentNameEmail, setStudentNameEmail] = useState('');
    const [ClientRecord, setClientRecord] = useState([]);
    const [pagerefresh, setpageRefresh] = useState(false);
    const [usertype, SetUserType] = useState('agent');

    const [Stafflist, Setstafflist] = useState([]);

    const GetStudentData = async () => {
        setLoader(true);
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                ClockAPI +
                '?action=view.client.record&limit=' +
                limit +
                '&page=' +
                page +
                '&orderby=' +
                dataview +
                '&orderCol=' +
                viewCol +
                '&Userid=' +
                Userid +
                '&dateRange=' +
                dateRange +
                '&StudentNameEmail=' +
                StudentNameEmail,
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'GET.CLOCK.IN.DATA.ADMIN',
                        UserRole: usertype,
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

    const GETSTAFF = async () => {
        setLoader(true);
        const UserAuthID = await userInfo('auth_token');
        try {
            const responseData: any = await fetch(
                ClockAPI +
                '?action=view.client.record&limit=',
                {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'GET.STAFF.DATA',
                        UserRole: usertype,
                    }),
                }
            );
            const data = await responseData.json();
            Setstafflist(data.data);
            setLoader(false);
        } catch (err) {
            console.error(err);
            setLoader(false);
        }
    }

    const storedUserId = sessionStorage.getItem('studentdataloader');
    const debouncedGetStudentData = debounce(GetStudentData, 300);
    const debouncedGetStaff = debounce(GETSTAFF, 300);
    useEffect(() => {
        debouncedGetStaff();

    }, []);
    useEffect(() => {
        debouncedGetStudentData();
        if (storedUserId) {
            sessionStorage.clear();
        }
    }, [Userid, dateRange, StudentNameEmail, viewCol, dataview, pagerefresh, usertype]);

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
    const menu = (event: any) => (
        <Menu>
            <Menu.Item key="1">

                <NavLink to={`/staff/client/view/${event.ID}/${event.application_id}/${event.CLIENT_ID}/staff`} className="">
                    <EyeOutlined className="text-blue-900" title="view and edit client record" />
                </NavLink>
            </Menu.Item>
        </Menu>
    );


    //chanage data formated

    const formatDateTime = (datetime: any) => {
        const date = new Date(datetime);

        if (datetime == null) {
            return '----';
        }


        // Define options for date and time formatting
        const dateOptions: any = { day: '2-digit', month: 'long', year: 'numeric' };
        const timeOptions: any = { hour: 'numeric', minute: '2-digit', hour12: true };

        // Format date and time
        const formattedDate = date.toLocaleDateString('en-GB', dateOptions); // "31 July 2024"
        const formattedTime = date.toLocaleTimeString('en-GB', timeOptions); // "1:45 PM"

        return `${formattedDate} (${formattedTime})`;
    };


    const RenderFunction = ({ color, children }: any) => {
        if (children === 'Rivew') {
            return <Tag color="processing">{children}</Tag>;
        } else if (children === 'On-Hold') {
            return <Tag color="warning">{children}</Tag>;
        } else if (children === 'Completed') {
            return <Tag color="success">{children}</Tag>;
        } else if (children === 'Transfer') {
            return <Tag color="success">{children}</Tag>;
        } else if (children === 'Not-accepted') {
            return <Tag color="success">{children}</Tag>;
        } else if (children === 'In-Hand') {
            return <Tag color="processing">{children}</Tag>;
        } else {
            return <Tag color="default">{children}</Tag>;
        }
    };
    // calculateWorkDuration
    const calculateWorkDuration = (clockIn: any, clockOut: any) => {
        const currentDate = new Date().toISOString().split('T')[0];
        if (!clockIn || !clockOut) {
            if (clockIn != currentDate) {
                return 'Forgot to clock out';
            } else {

                return '----';
            }
        }
        const start: any = new Date(clockIn);
        const end: any = new Date(clockOut);
        const duration = (end - start) / 1000; // duration in seconds

        if (duration < 0) return 'Invalid times';

        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);

        return `${hours}h ${minutes}m`;
    };

    const columns: TableColumnsType<DataType> = [
        // {
        //     className: 'text-style text-center',
        //     title: 'Action',
        //     fixed: 'left',
        //     render: (event) => (
        //         <>
        //             <Dropdown overlay={menu(event)} trigger={['click']}>
        //                 <a className="ant-dropdown-link" data-column="Action" onClick={(e) => e.preventDefault()}>
        //                     <MoreOutlined />
        //                 </a>
        //             </Dropdown>
        //         </>
        //     ),
        //     width: 100,
        // },

        {
            className: 'text-style',
            title: 'Employee Data',
            dataIndex: 'User',
            key: 'User',
            width: 350,
            render: (event, fullInfo: any) => (
                <div>
                    <span><b className='text-sm'>User Name : </b>{fullInfo.CLIENT_NAME}</span><br />
                    <span><b className='text-sm'>Client Email : </b>{fullInfo.CLIENT_EMAIL}</span>
                </div>
            ),
        },
        {
            className: 'text-style',
            title: 'Employee Number',
            dataIndex: 'CONTACT_NUMBER',
            key: 'CONTACT_NUMBER',
            render: (text: string) => (
                <span data-column="Employee Number">{text ? text : '----'}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'Check-In',
            dataIndex: 'CLOCK_IN',
            key: 'CLOCK_IN',

            render: (text: string) => (
                <span data-column="Check-In">{formatDateTime(text)}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style',
            title: 'Check-Out',
            dataIndex: 'CLOCK_OUT',
            key: 'CLOCK_OUT',
            render: (text: string) => (
                <span data-column="Check-Out">{formatDateTime(text)}</span> // Custom attribute added here
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Work Duration',
            dataIndex: 'Cal_Time',
            key: 'Cal_Time',
            fixed: 'right',
            render: (event, fullInfo: any) => (
                <span data-column="Work Duration">
                    {calculateWorkDuration(fullInfo.CLOCK_IN, fullInfo.CLOCK_OUT)}
                </span>
            ),
        },

    ];
    const [leftOffset, setLeftOffset] = useState(0); // Initial left offset
    const tableRef: any = useRef(null); // Ref for the table container

    // Function to handle mouse move for scrolling
    const moveScroll = (event: any) => {
        const movementX = event.nativeEvent.movementX;
        const newLeftOffset = leftOffset + movementX;


        const minLeftOffset = 0;
        const maxLeftOffset = 55;

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

    const userRole: any = [
        { key: 'agent', label: 'agent' },
        { key: 'staff', label: 'staff' },
    ];
    const handleSearch = useCallback(
        debounce((searchTerm) => {
            setuserid(searchTerm);
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
    const handleDateChange = (dates: any, dateStrings: any) => {
        setDateRange(dateStrings);
    };

    return (
        <div>
            <div>

            </div>
            <div className="grid grid-cols-5 gap-11 set_margin_bottom mt-5">
                <div className="col-span-2">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="h3_tag text-2xl">Attendance Report</h3>
                        <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                            <Select
                                items={Stafflist}
                                placeholder="Select User"
                                size={'sm'}
                                onChange={(e) => {
                                    setuserid(e.target.value);
                                }}
                            >
                                {/* {Stafflist.map(staff => (
                                    <SelectItem key={staff.ID}>{staff.CLIENT_NAME}</SelectItem>
                                ))} */}
                                {(Stafflist: any) => <SelectItem key={Stafflist.ID}>{Stafflist.CLIENT_NAME}</SelectItem>}
                            </Select>

                            <RangePicker onChange={handleDateChange} />
                        </div>
                    </div>
                </div>

            </div>
            <br />
            <div className="table-background scroll-container" ref={tableRef}>
                <Table className="" columns={columns} dataSource={ClientRecord} onChange={TableView} loading={loading}
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total: total_record,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        showSizeChanger: true,
                        pageSizeOptions: ['20', '50', '100'],
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
        </div>
    );
};

export default App;
