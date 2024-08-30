import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { v1GETDATA } from '../../../APIurl/url';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { useParams, NavLink } from 'react-router-dom';
import Blank from '../../../staff/LeadApplication/tab/blank';
import ViewApplication from './Totalapplicationview';
import debounce from 'lodash.debounce';
import { Chip } from "@nextui-org/react";
import './TotalApplication.css';
import {
    CheckOutlined,
    CloseOutlined,
    EyeOutlined,

} from '@ant-design/icons';
export default function App() {
    const [loader, setloader] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const token = jwt('jwt');
    const { client_id } = useParams();
    const [loaddata, setloaddata] = useState(true);
    const [ApplicationTotal, setApplicaton] = useState([]);

    const debouncedTotalapplication = debounce(async () => {
        setloaddata(true);
        try {
            const res = await fetch(v1GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'Total.applications.json',
                    ClientId: client_id,
                }),
            });
            const data = await res.json();
            setApplicaton(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setloaddata(false);
        }
    }, 300); // Adjust the debounce delay as needed

    useEffect(() => {
        debouncedTotalapplication();
    }, []);


    const handleOpenModal = (application: any) => {
        setSelectedApplication(application);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedApplication(null);
    };

    return (

        loaddata ? (
            <Blank />
        ) : (<>
            <Table removeWrapper aria-label="Example static collection table" className="table2">
                <TableHeader>
                    <TableColumn>Transfer Date</TableColumn>
                    <TableColumn>Application ID</TableColumn>
                    <TableColumn>Responsive Persone</TableColumn>
                    <TableColumn>Application Status</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Application Data."}>
                    {ApplicationTotal.map((Applicat: any, index: any) => (
                        <TableRow key={index}>
                            <TableCell ><span className="design_span_td" data-column="Transfer Date" >{Applicat.SENDING_DATE_TIME}</span></TableCell>
                            <TableCell><span className="design_span_td" data-column="Application Id">#App-{Applicat.ID}</span></TableCell>
                            <TableCell><span className="design_span_td" data-column="Responsive Persone"> {Applicat.CLIENT_NAME} - ({Applicat.COUNTRY_NAME})</span></TableCell>
                            <TableCell className="design_span_td" data-column="Application Status">
                                {Applicat.CURRENT_STATUTS === 'In-Hand' ? (
                                    <Chip
                                        startContent={<CheckOutlined />}
                                        variant="faded"
                                        color="success"
                                        className="design_span_td2" data-column="Application Status"
                                    >
                                        Accepted
                                    </Chip>
                                ) : Applicat.CURRENT_STATUTS === 'Not-accepted' ? (
                                    <Chip

                                        variant="faded"
                                        color="danger"
                                        className="design_span_td2" data-column="Application Status"
                                    >
                                        Not Accepted
                                    </Chip>

                                ) :
                                    <Chip
                                        startContent={<CloseOutlined />}
                                        variant="faded"
                                        color="danger"
                                        className="design_span_td2" data-column="Application Status"
                                    >Rejected
                                    </Chip>
                                }
                            </TableCell>
                            <TableCell>
                                <div className="relative flex items-center gap-2 design_span_td3" data-column="Action">
                                    {/* <Tooltip content="Details"> */}
                                    <EyeOutlined className="text-lg text-default-400 cursor-pointer active:opacity-50 "
                                        onClick={() => handleOpenModal(Applicat)} />
                                    {/* </Tooltip> */}
                                </div>
                            </TableCell>
                        </TableRow>


                    ))}

                </TableBody>
            </Table>

            {openModal && (
                <ViewApplication
                    isOpen={openModal}
                    onClose={handleCloseModal}
                    application={selectedApplication}

                />
            )}
        </>
        )

    );
}
