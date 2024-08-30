import React, { useState, useEffect } from 'react';
import { Checkbox, Drawer, Space, Row } from 'antd';
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
import { Footer } from 'antd/es/layout/layout';
/**
 *
 * DocumentRequire component
 *
 * This component displays a button to open a large drawer containing a list of documents.
 * The list of documents is fetched from the API using the `GETDATA` URL and the `jwt` token.
 *
 * @example
 * ```jsx
 * import DocumentRequire from './DocumentRequire';
 *
 * const App = () => {
 *   return <DocumentRequire />;
 * };
 * ```
 */
interface CourseProps {
    ClientData: any;
}
const DocumentRequire: React.FC<CourseProps> = ({ ClientData }) => {
    /**
     * State to track whether the drawer is open or not
     */
    const [open, setOpen] = useState(false);

    /**
     * State to track the size of the drawer
     */
    const [size, setSize] = useState<DrawerProps['size']>();

    /**
     * Function to show the large drawer
     */
    const showLargeDrawer = () => {
        setSize('large');
        setOpen(true);
    };

    /**
     * Function to close the drawer
     */
    const onClose = () => {
        setOpen(false);
    };

    /**
     * Get the JWT token from the `jwt` module
     */
    const Token = jwt('jwt');

    /**
     * State to store the list of documents
     */
    const [DocumentList, setDocumentList] = useState([]);

    /**
     * Function to fetch the list of documents from the API
     *
     * @returns {Promise<void>}
     */
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
    /**
     * Use effect to fetch the list of documents when the component mounts
     */
    useEffect(() => {
        GetDocuList();
    }, []);

    const [loader, setLoader] = useState(false);
    const { client_id } = useParams();
    const { encrypt_id } = useParams();
    const handleDocumentRequirement = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        const target = e.target;
        const fornData = new FormData(target);
        fornData.append('PAGE_REQUEST', 'INSERT_DOCUMENT_REQUEST_DATA');
        fornData.append('ClientId', client_id || '');
        const insertdata = await fetch('https://boostupinfinity.in/CRM/API/V1/ajax.insert.php?action=insertDoc' + '?action=insertDoc', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${Token}`,
            },
            body: fornData,
        });
        const res = await insertdata.json();
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
    const [program, setProgram] = useState([]);
    useEffect(() => {
        fetch(university_Api + `?view=university-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authenticate: `Bearer ${Token}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_UNIVERSITY_DATA',
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setProgram(data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
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

    const Header = ({ logo, title }: any) => (
        <div>
            <Space className="flex mt-3 ml-3">
                <img alt={'title'} src={logo} className="card-img-custom" />
                <NavLink to={`/courses/view/${title}`}>
                    <div className="underline text-lg">{title} </div>
                </NavLink>
            </Space>
        </div>
    );

    const Footer = (
        <div className="justify-end">
            <button
                className="btn btn-danger"
                onClick={() => {
                    onClose();
                }}
            >
                Close page
            </button>
        </div>
    );

    return (
        <>
            <Space>
                <button className="btn hover-none font-Nunito mb-1" onClick={showLargeDrawer}>
                    Enroll New Courses
                </button>
            </Space>
            <Drawer title="Enroll New Courses" className="font-Nunito new-header-class" placement="left" width={'95%'} onClose={onClose} open={open} closable={false} footer={Footer}>
                <Row className="grid grid-cols-5 pb-4 gap-4 scroll-fiex-header">
                    <div className="col-span-3 page_headng">URM University</div>
                    <div className="col-span-2 custom-flex-container justify-content-end">
                        {/* First Dropdown */}
                        <div className="custom-flex-item">
                            <select className="custom-select">
                                <option value="">Option 1</option>
                                <option value="">Option 2</option>
                                <option value="">Option 3</option>
                                <option value="">Option 4</option>
                                <option value="">Option 5</option>
                            </select>
                        </div>

                        {/* Second Dropdown */}
                        <div className="custom-flex-item">
                            <select className="custom-select">
                                <option value="">Option 1</option>
                                <option value="">Option 2</option>
                                <option value="">Option 3</option>
                                <option value="">Option 4</option>
                                <option value="">Option 5</option>
                            </select>
                        </div>

                        {/* Button */}
                        <div className="custom-flex-item ">
                            <button className="custom-button">
                                <FontAwesomeIcon icon={faSearch} className="group-hover:!text-primary shrink-0 text-lg" />
                                <span className="">Filter</span>
                            </button>
                        </div>
                    </div>
                </Row>
                {/* Add the row with dropdowns and button */}
                <div className="design_bg_university">
                    <div className="grid grid-cols-4 gap-2">
                        {program.map((value: any, index: number) => (
                            <div className="flex design_col_gap" key={index}>
                                <div className="card flex justify-content-center">
                                    <Card
                                        subTitle={value.PROGRAM_LENGTH ? value.PROGRAM_LENGTH : '_'}
                                        header={<Header logo={value.UNIVERSITY_LOGO} title={value.PROGRAM_NAME} />}
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
                                            <div>{value.UNIVERSITIE_ADDRESS ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Campus city</div>
                                            <div>{value.UNIVERSITIE_CITY ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Gross tuition fee</div>
                                            <div>{value.GROSS_TUITION ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Application fee</div>
                                            <div>{value.APPLICATION_FEE ?? 'empty'}</div>
                                        </div>
                                        <div className="flex card-content-custom">
                                            <div>Duration</div>
                                            <div>{value.PROGRAM_LENGTH ?? 'empty'}</div>
                                        </div>
                                        <hr />
                                        <div className="flex card-content-custom-1">
                                            <div>Success prediction</div>
                                            <Button className="btn-custom">Details</Button>
                                        </div>
                                        <div className="flex card-content-custom-1">
                                            <div>Sep 2024</div>
                                            <div>Jan 2025</div>
                                            <div>Sep 2025</div>
                                        </div>
                                        <div className="flex card-content-custom-1">
                                            <div className="priority priority-1">Low</div>
                                            <div className="priority priority-2">Medium</div>
                                            <div className="priority priority-3">High</div>
                                        </div>
                                        {/* <ApplyCourse /> */}
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
