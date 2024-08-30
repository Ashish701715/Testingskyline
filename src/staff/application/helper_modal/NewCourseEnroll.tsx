import React, { useState, useEffect } from 'react';
import { Checkbox, Drawer, Space, Row } from 'antd';
import { Input } from "@nextui-org/input";
import type { DrawerProps } from 'antd';
import { GETDATA } from '../../../APIurl/url';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primeicons/primeicons.css';
import './../../../pages/university/university-flag.css';
import './../../../pages/university/university.css';
import { Popover } from 'antd';
import { university_Api } from '../../../APIurl/url';
import { NavLink } from 'react-router-dom';
import ApplyCourse from './ApplyCourse';
import Calculateintak from './calculateintak';
import AddProgram from '../../../Admin/University/modal/AddNewProgram';

interface CourseProps {
    ClientData: any;
}

const DocumentRequire: React.FC<CourseProps> = ({ ClientData }) => {

    const [open, setOpen] = useState(false);
    const [size, setSize] = useState<DrawerProps['size']>();
    const [documentList, setDocumentList] = useState([]);
    const [program, setProgram] = useState([]);
    const [filteredProgram, setFilteredProgram] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loader, setLoader] = useState(false);
    const { client_id } = useParams();
    const Token = jwt('jwt');

    const showLargeDrawer = () => {
        setSize('large');
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const GetDocuList = async () => {
        const requester = await fetch(GETDATA + '?action=getDocList', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
                'x-token-access': `true`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_DOCUMENT_LIST_DATA',
            }),
        });
        const res = await requester.json();
        if (res.status === true && res.data.length > 0) {
            setDocumentList(res.data);
        } else {
            setDocumentList([]);
        }
    };

    const handleDocumentRequirement = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        const target = e.target;
        const formData = new FormData(target);
        formData.append('PAGE_REQUEST', 'INSERT_DOCUMENT_REQUEST_DATA');
        formData.append('ClientId', client_id || '');
        const insertData = await fetch('https://boostupinfinity.in/CRM/API/V1/ajax.insert.php?action=insertDoc', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
            },
            body: formData,
        });
        const res = await insertData.json();
        if (res.status === true) {
            setLoader(false);
            Swal.fire({
                text: res.message,
                icon: 'success',
            }).then(() => {
                sessionStorage.setItem('documentStore', 'true');
                setOpen(false);
            });
        } else {
            setLoader(false);
            Swal.fire({
                text: res.message,
                icon: 'error',
            });
        }
    };

    const fetchProgramData = async () => {
        const response = await fetch(university_Api + `?view=university-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authenticate: `Bearer ${Token}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_UNIVERSITY_DATA',
            }),
        });
        const data = await response.json();
        if (data.status) {
            setProgram(data.data);
            setFilteredProgram(data.data); // Initialize filteredProgram
        }
    };

    useEffect(() => {
        GetDocuList();
        fetchProgramData();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchTerm(searchValue);
        if (searchValue) {
            const filtered = program.filter((value: any) =>
                value.PROGRAM_NAME.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredProgram(filtered);
        } else {
            setFilteredProgram(program);
        }
    };

    const text = <span>Title</span>;
    const content = (
        <div>
            <p className="popover-content">Additional incentives,</p>
            <p className="popover-content">discounts, or bonus offers</p>
            <p className="popover-content">may exist for this program.</p>
            <p className="popover-content">Please check your Offers</p>
            <p className="popover-content">Dashboard and emails for</p>
            <p className="popover-content">more details.</p>
        </div>
    );

    const Header = ({ logo, title, UPID }: any) => (
        <div>
            <Space className="flex mt-3 ml-3">
                <img alt={'title'} src={logo} className="card-img-custom" />
                <NavLink to={`/staff/university/program/view/${UPID}`} target='_blank'>
                    <div className="underline text-lg">{title} </div>
                </NavLink>
            </Space>
        </div>
    );

    const Footer = (
        <div className="justify-end">
            <button
                className="btn btn-primary"
                onClick={() => {
                    onClose();
                }}
            >
                Cancel
            </button>
        </div>
    );

    return (
        <>
            <Space className='w-full'>
                <button className="btn btn-primary" onClick={showLargeDrawer}>
                    Enroll New Courses
                </button>
            </Space>
            <Drawer title="Enroll New Courses" className="font-Nunito new-header-class" placement="left" width={'95%'} onClose={onClose} open={open} closable={false} footer={Footer}>
                <Row className="grid grid-cols-5 pb-4 gap-4 scroll-fiex-header">
                    <div className="col-span-3 page_headng"></div>
                    <div className="col-span-2 custom-flex-container justify-content-end">
                        <div className="custom-flex-item">
                            <Input
                                type="text"
                                label="Search Results"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className='set_height_input'
                            />
                        </div>

                        <div className="custom-flex-item ">
                            <AddProgram />
                        </div>
                    </div>
                </Row>
                <div className="design_bg_university">
                    <div className="grid grid-cols-4 gap-2">
                        {filteredProgram.map((value: any, index: number) => (
                            <div className="flex design_col_gap" key={index}>
                                <div className="card flex justify-content-center">
                                    <Card
                                        subTitle={value.PROGRAM_LENGTH ? value.PROGRAM_LENGTH : '_'}
                                        header={<Header logo={value.UNIVERSITY_LOGO} title={value.PROGRAM_NAME} UPID={value.IDS} />}
                                        className="md:w-25rem custom-card-width custom-card-heading"
                                    >
                                        <div className="flex">
                                            <div className="">
                                                <Popover placement="right" content={content}>
                                                    <Button className="clg-type-custom">Incentivized</Button>
                                                </Popover>
                                                <Popover placement="right" content={content}>
                                                    <Button className="clg-type-custom-1">Fast Acceptance</Button>
                                                </Popover>
                                            </div>
                                            <div className=""></div>
                                        </div>
                                        <hr />
                                        <br />
                                        <div className="flex card-content-custom">
                                            <div>Location</div>
                                            <div className='text_align_end'>{value.PROGRAM_ADDRESS ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Campus city</div>
                                            <div className='text_align_end'>{value.PROGRAM_CITY ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Gross tuition fee</div>
                                            <div className='text_align_end'>{value.GROSS_TUITION ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Application fee</div>
                                            <div className='text_align_end'>{value.APPLICATION_FEE ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Duration</div>
                                            <div className='text_align_end'>{value.PROGRAM_LENGTH ?? 'empty'}</div>
                                        </div>
                                        <hr />
                                        <div className="flex card-content-custom-1">
                                            <div>Success prediction</div>
                                            <Button className="btn-custom">Details</Button>
                                        </div>
                                        <div className="flex card-content-custom-1">
                                            <Calculateintak intakeData={value.UNIVERSITY_PROGRAM_INTAKE} />
                                        </div>
                                        <ApplyCourse ClientData={ClientData} program_infomation={value} intake={<Calculateintak intakeData={value.UNIVERSITY_PROGRAM_INTAKE} />} />
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default DocumentRequire;
