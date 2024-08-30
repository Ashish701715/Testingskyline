import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Table } from 'antd';
import '../../components/style.css';
import { TableColumnsType, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { GETDATA } from '../../APIurl/url';
import { V1Delete } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { EyeOutlined } from '@ant-design/icons';
import { Input } from '@nextui-org/react';
import AddComission from './AddNewcommission';
import debounce from 'lodash.debounce';
import { FetchData } from '../../FormHandler/FetchAction';
import Swal from 'sweetalert2';
import EditCommission from './EditCommission';
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
    const [dataview, setdataview] = useState('asc');
    const [viewCol, setviewCol] = useState('ID');
    const [ApplicationId, setApplicationId] = useState('');
    const [PassportNumber, setPassportNumber] = useState('');
    const [StudentNameEmail, setStudentNameEmail] = useState('');
    const [ClientRecord, setClientRecord] = useState([]);
    const [pagerefresh, setpageRefresh] = useState(true);
    const GetStudentData = async () => {
        setLoader(true);
        try {
            const responseData: any = await fetch(
                GETDATA +
                '?action=view.client.record&limit=' +
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
                        PAGE_REQUEST: 'AGNET_COMISSION_SETUP_AND_SETTING',
                    }),
                }
            );
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

    const handleDeleteFunction = async (value: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            const bodydata = JSON.stringify({
                ID: value,
                PAGE_REQUEST: 'DELETE_COMMISSION_RECORD_DATA',
            });
            const Header = {
                Authenticate: `Bearer ${token}`,
            };

            if (result.isConfirmed) {
                const deleteData = await FetchData(V1Delete, bodydata, 'DELETE', Header);
                if (deleteData.status === true) {
                    Swal.fire({
                        title: deleteData.message,
                        icon: 'success',
                    });
                    setpageRefresh(true);
                } else {
                    Swal.fire({
                        title: deleteData.message,
                        icon: 'error',
                    });
                }
            }
        });
    };
    const columns: TableColumnsType<DataType> = [
        {
            title: 'ID',
            className: 'text-style',
            dataIndex: 'COMMISSIONID',
            key: 'COMMISSIONID',
            fixed: 'left',
            width: 100,
            render: (event, fullInfo: any) => (
                <NavLink to={`/agent/client/view/${event}/${fullInfo.CLIENT_ID}`} className="text-color-blue" data-column="id">
                    {event}
                </NavLink>
            ),
        },
        {
            className: 'text-style',
            title: 'Commission Price',
            width: 250,
            render: (event) => (
                <span data-column="Commission Price">
                    {event.PRICE_TYPE}{event.PRICE}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'File Commission',
            dataIndex: 'FILE_TYPE',
            key: 'FILE_TYPE',
            width: 250,
            render: (event) => (
                <span data-column="File Commission">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Commission Country',
            dataIndex: 'VISA_COUNTRY',
            key: 'VISA_COUNTRY',
            render: (event) => {
                switch (event) {
                    case 'united_kingdom':
                        return <span data-column="Commission Country">United Kingdom</span>;
                    case 'united_states':
                        return <span data-column="Commission Country">United States</span>;

                    default:
                        return <span data-column="Commission Country">{event}</span>;
                }
            },
        },
        {
            className: 'text-style',
            title: 'Currency type',
            dataIndex: 'PRICE_TYPE',
            key: 'PRICE_TYPE',
            render: (event) => {
                switch (event) {
                    case '$':
                        return <span data-column="Currency type">Dollar</span>;
                    case '₹':
                        return <span data-column="Currency type">Rupees</span>;
                    case '€':
                        return <span data-column="Currency type">Euro</span>;
                    case '£':
                        return <span data-column="Currency type">Pound</span>;
                    default:
                        return <span data-column="Currency type">Other</span>;
                }
            },
        },
        {
            className: 'text-style',
            title: 'Last update',
            dataIndex: 'UPDATED_AT',
            key: 'UPDATED_AT',
            render: (event) => (
                <span data-column="Last update">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style',
            title: 'Status',
            dataIndex: 'STATUS',
            key: 'STATUS',
            width: 150,
            render: (event) => (
                <span data-column="Status">
                    {event}
                </span>
            ),
        },
        {
            className: 'text-style text-center',
            title: 'ACTION',
            fixed: 'right',
            render: (event) => (
                <div className="flex" >
                    <EditCommission setpageRefresh={setpageRefresh} EditData={event} />

                    <NavLink
                        data-column="ACTION "
                        to="#"
                        key={event.COMMISSIONID}
                        className="text-danger hover:text-danger"
                        onClick={() => {
                            handleDeleteFunction(event.COMMISSIONID);
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 svg_desgin_p">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    </NavLink>
                </div>
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
        <div className='bg-white p-5 rounded-xl'>
            <div>
                <ul className="flex justify-between">
                    <li>
                        <h4 className="bold-font-700 font-32px">Commission Manage</h4>
                    </li>
                </ul>
            </div>
            <div className="grid grid-cols-24 set_margin_bottom mt-5">
                <div className="col-span-24">
                    <div className="w-full flex flex-col">
                        <div className="flex w-full flex-wrap md:flex-nowrap md:mb-0 justify-end">
                            <AddComission />
                        </div>
                    </div>
                </div>
            </div>
            <br />
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
        </div>
    );
};

export default App;
