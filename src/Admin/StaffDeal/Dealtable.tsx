import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import '../../components/style.css';
import { TableColumnsType, Dropdown, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { GETDATA } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { EyeOutlined, DeleteOutlined, MailOutlined, FileDoneOutlined, MoreOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import { Input, Select, SelectItem } from '@nextui-org/react';
import debounce from 'lodash.debounce';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import TableViewIcon from '@mui/icons-material/TableView';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ViewKanban from '../StaffDeal/Deal_Karban';
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
    const [ApplicationId, setApplicationId] = useState('');
    const [PassportNumber, setPassportNumber] = useState('');
    const [StudentNameEmail, setStudentNameEmail] = useState('');
    const [ClientRecord, setClientRecord] = useState([]);
    const [pagerefresh, setpageRefresh] = useState(false);
    const [usertype, SetUserType] = useState('agent');
    const [Showfilter, Setshowfilter] = useState('Table');
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
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'DEAL_DATA_FETCH_ADMIN_SIDE_TABLE',
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

    const storedUserId = sessionStorage.getItem('studentdataloader');
    const debouncedGetStudentData = debounce(GetStudentData, 300);
    useEffect(() => {
        debouncedGetStudentData();
        if (storedUserId) {
            sessionStorage.clear();
        }
    }, [ApplicationId, PassportNumber, StudentNameEmail, viewCol, dataview, pagerefresh, usertype]);

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

                <NavLink to={`/admin/student/view/${event.application_id}/${event.CLIENT_ID}`} className="">
                    <EyeOutlined className="text-blue-900" title="view and edit client record" />
                </NavLink>
            </Menu.Item>
        </Menu>
    );

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
    const columns: TableColumnsType<DataType> = [
        {
            className: 'text-style text-center',
            title: 'Action',
            fixed: 'left',
            render: (event) => (
                <>
                    <Dropdown overlay={menu(event)} trigger={['click']}>
                        <a className="ant-dropdown-link" data-column="Action" onClick={(e) => e.preventDefault()}>
                            <MoreOutlined />
                        </a>
                    </Dropdown>
                </>
            ),
            width: 100,
        },
        {
            title: 'Application ID',
            className: 'text-style',
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
            render: (event, fullInfo: any) => (
                <NavLink to={`/admin/student/view/${fullInfo.application_id}/${fullInfo.CLIENT_ID}`} className="text-color-blue" data-column="Application ID">
                    {fullInfo.application_id}
                </NavLink>
            ),
        },
        {
            className: 'text-style',
            title: 'Responsive Details',
            dataIndex: 'RESPONSIVE_INFO',
            key: 'RESPONSIVE_INFO',
            width: 250,
            render: (event, fullInfo: any) => (
                <div data-column="Agent Detail" className="full_duel_heading">
                    <span className="font-style_duali_heading"><b className="hidde_text">Staff Name: </b>{JSON.parse(fullInfo.RESPONSIVE_INFO).RESPONSIVE_NAME}</span><br />
                    <span className="font-style_duali_heading"><b className="hidde_text">Staff Email: </b>{JSON.parse(fullInfo.RESPONSIVE_INFO).RESPONSIVE_EMAIL}</span>
                </div>
            ),
        },
        {
            className: 'text-style',
            title: 'Agent Detail',
            dataIndex: 'AGENT',
            key: 'AGENT',
            width: 250,
            render: (event, fullInfo: any) => (
                <div data-column="Agent Detail" className="full_duel_heading">
                    <span className="font-style_duali_heading"><b className="hidde_text">Agent Name: </b>{JSON.parse(fullInfo.CREATE_INFO).CREATE_NAME}</span><br />
                    <span className="font-style_duali_heading"><b className="hidde_text">Agent Email: </b>{JSON.parse(fullInfo.CREATE_INFO).CREATE_EMAIL}</span>
                </div>
            ),
        },
        {
            className: 'text-style',
            title: 'Client Detail',
            dataIndex: 'EMAIL',
            key: 'EMAIL',
            width: 250,
            render: (event, fullInfo: any) => (
                <div data-column="Client Detail" className="full_duel_heading">
                    <span className="font-style_duali_heading"><b className="hidde_text">Client Name: </b>{fullInfo.FIRST_NAME} {fullInfo.LAST_NAME}</span><br />
                    <span className="font-style_duali_heading"><b className="hidde_text">Client Email: </b>{fullInfo.EMAIL}</span>
                </div>
            ),
        },
        {
            className: 'text-style',
            title: 'Client Number',
            dataIndex: 'PHONE_NUMBER',
            key: 'PHONE_NUMBER',
            render: (text: string) => (
                <span data-column="Client Number">{text}</span>
            ),
        },
        {
            className: 'text-style',
            title: 'Client D.O.B',
            dataIndex: 'DATE_OF_BIRTH',
            key: 'DATE_OF_BIRTH',
            width: 150,
            render: (text: string) => (
                <span data-column="Client D.O.B">{text}</span>
            ),
        },
        {
            className: 'text-style',
            title: 'Client Passport No.',
            dataIndex: 'PASSPORT_NUMBER',
            key: 'PASSPORT_NUMBER',
            render: (text: string) => (
                <span data-column="Client Passport No.">{text}</span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Application Status',
            dataIndex: 'DEAL_STATUS',
            key: 'DEAL_STATUS',
            fixed: 'right',
            render: (event) => <RenderFunction data-column="Application Status" color={event}>{event}</RenderFunction>,
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

    const handleTabChange = (key: any) => {
        debounceSetFilterCol(key);
    };

    const debounceSetFilterCol = useCallback(
        debounce((key) => {
            Setshowfilter(key);
        }, 300),
        []
    );

    return (
        <>
            <div>
                <ul className="flex justify-between">
                    <li>
                        {/* <h4 className="bold-font-700 font-32px">Student Application</h4> */}
                    </li>
                    <li>

                        <Tabs aria-label="Options" onSelectionChange={handleTabChange}>
                            <Tab key="Table" title={
                                <div className="flex items-center space-x-2">
                                    <TableViewIcon />
                                </div>
                            }>
                            </Tab>
                            <Tab key="Kanban" title={
                                <div className="flex items-center space-x-2">
                                    <ViewKanbanIcon />
                                </div>
                            }>
                            </Tab>

                        </Tabs>

                    </li>
                </ul>
            </div>
            {Showfilter == 'Table' ? (
                <div>
                    <div>

                    </div>
                    <div className="grid grid-cols-5 gap-11 set_margin_bottom mt-5">
                        <div className="col-span-3">
                            <div className="w-full flex flex-col gap-4">
                                <h3 className="h3_tag text-2xl"> Application Filter </h3>
                                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
                                    <Input size={'sm'} type="text" placeholder="Application ID" onChange={handleKeyDown} />
                                    <Input size={'sm'} type="text" placeholder="Client Passport No." onKeyDown={handleKeyDownPassport} />
                                    <Input size={'sm'} type="text" placeholder="Client Email" onChange={handleKeyDownName} />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <div className="w-full flex flex-col gap-4">
                                <h3 className="h3_tag text-2xl">Column Filter</h3>
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
                    <br />
                    <div className="table-background-admin scroll-container" ref={tableRef}>
                        <Table className="" columns={columns} dataSource={ClientRecord} onChange={TableView} loading={loading}
                            pagination={{
                                current: page,
                                pageSize: limit,
                                total: total_record,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                showSizeChanger: true,
                                pageSizeOptions: ['3', '20', '50', '100'],
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
            ) : <ViewKanban />}
        </>
    );
};

export default App;
