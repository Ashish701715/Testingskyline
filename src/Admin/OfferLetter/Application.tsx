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
    const [StatusOfferLetter, offerletterStatus] = useState('');
    const [OfferLetterStatus, setOfferStatus] = useState([]);
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
                        PAGE_REQUEST: 'STUDENT_OFFER_LETTER_DATA_RECORD',
                        'FilterData': StatusOfferLetter
                    }),
                }
            );
            const data = await responseData.json();
            setClientRecord(data.data);
            setOfferStatus(data.statusList);
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
    }, [ApplicationId, PassportNumber, StudentNameEmail, viewCol, dataview, pagerefresh, StatusOfferLetter]);

    function TableView(pagination: any, filters: any, sorter: any, extra: any) {
        setviewCol(sorter.columnKey);
        setdataview(sorter.order == 'ascend' ? 'asc' : 'desc');
    }

    const menu = (event: any) => (
        <Menu>
            <Menu.Item key="1">
                <NavLink to={`/admin/student/view/${event.ID}/${event.CLIENT_IDS}`} className="">
                    <EyeOutlined className="text-blue-900" title="view and edit client record" /> View
                </NavLink>
            </Menu.Item>
        </Menu>
    );

    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            className: 'text-style',
            dataIndex: 'ID',
            key: 'ID',
            fixed: 'left',
            width: 100,
            render: (event, fullInfo: any) => (
                <span data-column="ID">
                    <NavLink to={`/admin/student/view/${event}/${fullInfo.CLIENT_IDS}`} className="text-color-blue">
                        {event}
                    </NavLink>
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Email',
            dataIndex: 'EMAIL',
            key: 'EMAIL',
            width: 250,
            render: (event) => (
                <span data-column="Email">
                    <NavLink to={`mailto:${event}`} className="text-color-blue">
                        {event}
                    </NavLink>
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'First Name',
            dataIndex: 'FIRST_NAME',
            key: 'FIRST_NAME',
            render: (event) => (
                <span data-column="First Name">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Last Name',
            dataIndex: 'LAST_NAME',
            key: 'LAST_NAME',
            render: (event) => (
                <span data-column="Last Name">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Phone Number',
            dataIndex: 'PHONE_NUMBER',
            key: 'PHONE_NUMBER',
            render: (event) => (
                <span data-column="Phone Number">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Date of Birth',
            dataIndex: 'DATE_OF_BIRTH',
            key: 'DATE_OF_BIRTH',
            width: 150,
            render: (event) => (
                <span data-column="Date of Birth">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Country of Citizenship',
            dataIndex: 'COUNTRY_OF_CITIZENSHIP',
            key: 'COUNTRY_OF_CITIZENSHIP',
            width: 250,
            render: (event) => (
                <span data-column="Country of Citizenship">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Passport',
            dataIndex: 'PASSPORT_NUMBER',
            key: 'PASSPORT_NUMBER',
            render: (event) => (
                <span data-column="Passport">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Passport Expiry Date',
            dataIndex: 'PASSPORT_EXPIRY_DATE',
            key: 'PASSPORT_EXPIRY_DATE',
            render: (event) => (
                <span data-column="Passport Expiry Date">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Gender',
            dataIndex: 'GENDER',
            key: 'GENDER',
            width: 100,
            render: (event) => (
                <span data-column="Gender">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'Action',
            fixed: 'right',
            render: (event) => (
                <span data-column="Action">
                    <Dropdown overlay={menu(event)} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                            <MoreOutlined />
                        </a>
                    </Dropdown>
                </span>
            ),
            width: 100,
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

    console.table(OfferLetterStatus)
    return (
        <div className='bg-white p-5 rounded-xl'>
            <div>
                <ul className="flex justify-between">
                    <li>
                        <h4 className="bold-font-700 font-32px">Offer-Letter Application</h4>
                    </li>
                </ul>
            </div>
            <div className="grid grid-cols-5 gap-11 set_margin_bottom mt-5">
                <div className="col-span-3">
                    <div className="w-full flex flex-col gap-4" />
                </div>
                <div className="col-span-2">
                    <div className="w-full flex flex-col gap-4">
                        <h3 className="h3_tag">Column Filter</h3>
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

                                <Select
                                    items={OfferLetterStatus}
                                    placeholder="Select Status"
                                    size={'sm'}
                                    onChange={(e: any) => {
                                        offerletterStatus(e.target.value);
                                    }}
                                >
                                    {(OfferLetterStatus: any) => <SelectItem key={OfferLetterStatus.key}>{OfferLetterStatus.label}</SelectItem>}
                                </Select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <br />
            <div className="table-background scroll-container" ref={tableRef}>
                <Table
                    className=""
                    columns={columns}
                    dataSource={ClientRecord}
                    onChange={TableView}
                    loading={loading}
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
