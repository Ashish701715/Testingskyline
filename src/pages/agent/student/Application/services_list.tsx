import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner } from "@nextui-org/react";
import { v1GETDATA } from '../../../../APIurl/url';
import { INSERTDATA } from '../../../../APIurl/url';
import jwt from '../../../../getLoggedUser/GetUserInfomation';
import { useParams, NavLink } from 'react-router-dom';
import Blank from '../../../../staff/LeadApplication/tab/blank';
import debounce from 'lodash.debounce';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Editor } from "primereact/editor";
import { Select, SelectItem } from "@nextui-org/react";
import "./services.css";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
    EyeOutlined
} from '@ant-design/icons';
export default function App({ FileID }: any) {
    const globalVar = window.globalVariable;
    const MySwal = withReactContent(Swal);
    const [text, setText]: any = useState('');

    const [loader, setloader] = useState(false);
    const [Refresh, SetRefresh] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const token = jwt('jwt');
    const { client_id } = useParams();
    const [loaddata, setloaddata] = useState(true);
    const [ApplicationTotal, setApplicaton] = useState([]);
    const [page, setpage] = useState(1);
    const [Totalpage, Settotalpage] = useState(1);


    const debouncedTotalapplication = debounce(async () => {
        setloaddata(true);
        SetRefresh(false);
        try {
            const res = await fetch(v1GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'Total.Services.Addition.History',
                    ClientId: client_id,
                    FileID: FileID,
                    page: page,
                }),
            });
            const data = await res.json();
            setApplicaton(data.data);
            Settotalpage(data.total_pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setloaddata(false);
        }
    }, 300);

    useEffect(() => {
        debouncedTotalapplication();
    }, [page, Refresh]);




    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // HANDAL ADDITION SERVICES ONLY

    const [activeTab, setActiveTab]: any = useState('Loan');
    const [editorData, setEditorData]: any = useState({
        Loan: '',
        Accomodation: '',
        Insurance: '',
        Ticket: ''
    });

    const handleTabChange = (key: any) => {
        setActiveTab(key);
    };

    const handleEditorChange = (value: any) => {
        setEditorData({
            ...editorData,
            [activeTab]: value.htmlValue
        });
    };

    const handleAddServices = async () => {

        if (editorData[activeTab] == null) {
            Swal.fire({
                title: 'Addition services details section is required',
                // text: 'Please fill out the form before submitting.',
                icon: 'warning',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
                customClass: {
                    popup: 'color-danger',
                },
            });
        } else {
            setloader(true);
            try {
                const res = await fetch(`${v1GETDATA}?action=Fileupdateadd&fileTransfer=true&isAgree=true`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${token}`,
                        'x-crros-access': 'true',
                    },

                    body: JSON.stringify({
                        PAGE_REQUEST: 'ADD.ADDITIONS.FILE.ADD',
                        Tab: activeTab,
                        Details: editorData[activeTab],
                        client_id: client_id,
                    }),
                });

                const data = await res.json();

                if (data.status === true) {
                    SetRefresh(true);
                    Swal.fire({
                        title: 'Profile updated successfully',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        showCloseButton: true,
                        customClass: {
                            popup: 'color-success',
                        },
                    })

                    setEditorData('');

                } else if (data.status === false) {

                    Swal.fire({
                        text: data.message,
                        icon: 'error',
                    });
                } else {
                    Swal.fire({
                        text: 'Error Query. Please Refresh Page And Try Again',
                        icon: 'error',
                    });
                }
            } catch (error) {

                console.error('Error:', error);
                Swal.fire({
                    text: 'Failed to submit data. Please try again later.',
                    icon: 'error',
                });
            }
            setloader(false);
        }
        // Your logic to store data
    };

    const [Upadteservice, Setsevicesup]: any = useState('');
    const [Updateservicedetails, Setservicedetails]: any = useState('');
    const [Editmodal, SetEditmodal] = useState(false);
    const editmodal = (service_name: any, servicedetails: any) => {
        Setsevicesup(service_name);
        Setservicedetails(servicedetails);
        SetEditmodal(true);
    }

    //updateservicedetails
    const UpdateEditorChange = (value: any) => {
        Setservicedetails(value.htmlValue);
    };
    const Updateservices = async () => {
        // console.log(Updateservicedetails);
        // console.log(Upadteservice);
        if (Updateservicedetails == null) {
            Swal.fire({
                title: 'Addition services details section is required',
                // text: 'Please fill out the form before submitting.',
                icon: 'warning',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
                customClass: {
                    popup: 'color-danger',
                },
            });
        }
        else {
            setloader(true);
            try {
                const res = await fetch(`${v1GETDATA}?action=Fileupdateadd&fileTransfer=true&isAgree=true`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${token}`,
                        'x-crros-access': 'true',
                    },

                    body: JSON.stringify({
                        PAGE_REQUEST: 'UPDATE.ADDITIONS.FILE.SERVICES',
                        Tab: Upadteservice,
                        Details: Updateservicedetails,
                        client_id: client_id,
                    }),
                });

                const data = await res.json();

                if (data.status === true) {

                    Swal.fire({
                        title: 'Profile updated successfully',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        showCloseButton: true,
                        customClass: {
                            popup: 'color-success',
                        },
                    })

                    setEditorData('');

                } else if (data.status === false) {

                    Swal.fire({
                        text: data.message,
                        icon: 'error',
                    });
                } else {
                    Swal.fire({
                        text: 'Error Query. Please Refresh Page And Try Again',
                        icon: 'error',
                    });
                }
            } catch (error) {

                console.error('Error:', error);
                Swal.fire({
                    text: 'Failed to submit data. Please try again later.',
                    icon: 'error',
                });
            }
            setloader(false);
        }

    }

    return (
        <div className="grid gap-3 ">
            <div className="flex justify-end set_services" >

                <div className="flex gap-3">
                    {globalVar.ROLE == 'agent' ?
                        <Button onPress={onOpen} className="btn btn-primary" >Add Services</Button>

                        : ''}
                    <Button className="btn btn-primary" onClick={() => SetRefresh(true)}>Refresh</Button>
                </div>
            </div>
            <Modal size={'2xl'} isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Additional Server</ModalHeader>
                            <ModalBody>
                                <div className="flex w-full flex-col">
                                    <Tabs aria-label="Options" selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key)}>
                                        {['Loan', 'Accomodation', 'Insurance', 'Ticket'].map((tab) => (
                                            <Tab key={tab} title={tab}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="card">
                                                            <Editor
                                                                value={editorData[tab]}
                                                                onTextChange={handleEditorChange}
                                                                style={{ height: '320px' }}
                                                            />
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                    <ModalFooter>
                                        <Button color="primary" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" onClick={handleAddServices} disabled={loader ? true : false}>
                                            {loader ? 'Wait..' : 'Add Services'}
                                        </Button>
                                    </ModalFooter>
                                </div>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>

            <Table isStriped aria-label="Example static collection table " className="table3"
                bottomContent={
                    <div className="flex w-full justify-center ">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={Totalpage}
                            onChange={(page) => setpage(page)}
                        />
                    </div>
                }
            >
                <TableHeader>
                    <TableColumn>#</TableColumn>
                    <TableColumn>Services Name</TableColumn>
                    <TableColumn style={{ width: '50%' }}>Services Details</TableColumn>
                    <TableColumn>Action</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No Application history."}
                    loadingContent={<Spinner size="lg" />}
                    loadingState={loaddata ? 'loading' : 'idle'}
                >
                    {ApplicationTotal.map((Applicat: any, index: any) => (
                        <TableRow key={index}>
                            <TableCell data-column="#">{index + 1}</TableCell>
                            <TableCell data-column="Services Name">{Applicat.SERVICES_NAME}</TableCell>
                            <TableCell data-column="Services Details">
                                <div dangerouslySetInnerHTML={{ __html: Applicat.SERVICES_DETAILS }} />
                            </TableCell>
                            <TableCell data-column="Action" onClick={() => editmodal(Applicat.SERVICES_NAME, Applicat.SERVICES_DETAILS)}><EyeOutlined /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal size={'2xl'} isOpen={Editmodal ? true : false} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Update Services</ModalHeader>
                        <ModalBody>
                            <div className="grid gap-4">
                                <Select
                                    label="Select Services"
                                    defaultSelectedKeys={[Upadteservice]}
                                    onChange={(event) => Setsevicesup(event.target.value)}
                                    isDisabled={globalVar.ROLE == 'agent' ? false : true}
                                >
                                    <SelectItem key="Loan">
                                        Loan
                                    </SelectItem>
                                    <SelectItem key="Accomodation">
                                        Accomodation
                                    </SelectItem>
                                    <SelectItem key="Insurance">
                                        Insurance
                                    </SelectItem>
                                    <SelectItem key="Ticket">
                                        Ticket
                                    </SelectItem>
                                </Select>

                                <div className="card">
                                    <Editor
                                        readOnly={globalVar.ROLE == 'agent' ? false : true}
                                        value={Updateservicedetails}
                                        onTextChange={UpdateEditorChange}
                                        style={{ height: '320px' }}
                                    />
                                </div>

                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="light" onClick={() => SetEditmodal(false)}>
                                Close
                            </Button>
                            <Button color="primary" onClick={() => Updateservices()} disabled={loader ? true : false}>
                                {loader ? 'Wait...' : 'Update'}
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>


        </div >
    );
}
