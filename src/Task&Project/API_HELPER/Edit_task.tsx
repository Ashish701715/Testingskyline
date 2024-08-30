import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Chip } from "@nextui-org/react";
import Button from '@mui/material/Button';
import { NavLink, useParams } from "react-router-dom";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import { Card, CardBody, Divider, User } from "@nextui-org/react";
import '../Task_style.css';
import Subtask from './Subtask';
import TaskHistory from './Task_history';
import Editform from './Edit_form';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { generateJWT } from '../../pages/JWT';
import { TASKAPI } from '../../APIurl/url';
import { DELETE } from '../../APIurl/url';
import { color } from "framer-motion";
import Swal from 'sweetalert2';
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export default function App() {
    const [Startbtn, setstartbtn] = useState(true);
    const [FINISHbtn, setfinishbtn] = useState(true);
    const [Taskdata, settaskdata] = useState([]);
    const [Subtaskdata, setsubtaskdata] = useState([]);
    const [History, sethistory] = useState([]);
    const [Comment, setcomment] = useState([]);
    const { TASKTOKEN, EncryptId } = useParams();
    const authTokenLocalStorage = localStorage.getItem('auth_token');
    const USERID = localStorage.getItem('SID');
    const [view, setView] = useState(false);

    const handleCreateClick = () => {

        if (view == false) {
            setView(true);
        } else {
            setView(false);
            setTimeout(() => {
                setView(true);
            }, 10);
        }
    };
    // this default load page 
    useEffect(() => {

        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token
            .then((JwtToken) => {

                fetch(TASKAPI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: "GettaskData",
                        AUTH_ID: authTokenLocalStorage,
                        TASKTOKEN: TASKTOKEN,
                        EncryptId: EncryptId
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {

                        const newData = data.task;
                        const status = newData[0]['STATUS'];
                        settaskdata(newData);
                        setsubtaskdata(data.SubTask);
                        sethistory(data.History);
                        setcomment(data.Comment);


                        if (status == 2) {
                            setstartbtn(false);
                        }

                        if (status == 1) {
                            setfinishbtn(false);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const { onOpenChange } = useDisclosure();
    const [isOpen, setisOpen] = useState(true);
    function CloseModal() {
        setisOpen(false)
        window.history.back();
    }
    const svgArray = Array.from({ length: 5 });

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [values, setValues] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValues(newValue);
    };
    const [tabValue, setTabValue] = useState(0);


    const formatDate = (datetimeString: any) => {
        if (!datetimeString) {
            return "No Deadline";
        }

        const date = new Date(datetimeString);
        const monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
        const minutes = date.getMinutes();
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${month} ${day}, ${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };
    //handel status update

    const handeltaskstatus = (value: any) => {
        if (value == 'Start') {
            setstartbtn(false);
        } else if (value == 'Pause') {
            setstartbtn(true);
        }

        const payload = { REQUEST: "TASK_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token
            .then((JwtToken) => {

                fetch(TASKAPI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: "TASKSTATUSCHANGE",
                        AUTH_ID: authTokenLocalStorage,
                        TASKTOKEN: TASKTOKEN,
                        EncryptId: EncryptId,
                        value: value
                    }),
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {


                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });


    }

    //delete task query
    const handledeletetask = async (taskId: any, tasktoken: any) => {
        try {
            // Show SweetAlert confirmation dialog
            const confirmDelete = await Swal.fire({
                title: 'Confirm Delete',
                text: 'Are you sure you want to delete this task?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
            });

            // Check if the user confirmed the delete action
            if (confirmDelete.isConfirmed) {
                const payload = { REQUEST: 'LEAD_PAGE', is_Admin: false, isValid: true };
                const secretKey = 'JwtSecret';
                const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
                const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
                const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
                const token = await generateJWT(payload, secretKey, expiresIn);

                const response = await fetch(DELETE, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'DELETETASK',
                        AUTH_ID: authTokenLocalStorage,
                        TASKTOKEN: tasktoken,
                        EncryptId: taskId,
                    }),
                });

                if (response.ok) {
                    const responseData = await response.json();

                    if (responseData.status === true) {
                        Swal.fire('Success', 'Task deleted successfully', 'success');
                        window.location.reload();
                    } else {
                        Swal.fire('Error', 'Failed to delete task', 'error');
                    }
                    // Swal.fire('Success', 'Task deleted successfully', 'success');
                } else {
                    Swal.fire('Error', 'Failed to delete task', 'error');

                }
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            Swal.fire('Error', 'An error occurred while deleting the task', 'error');
            // Handle the error if needed
        }
    };


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="full" isDismissable={true} hideCloseButton={true} style={{ marginLeft: '10%', background: '#eef2f4' }} className="light-background-white" >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody style={{ overflow: 'auto' }}>

                                {/* Modal Body */}
                                {Taskdata.map((task: any) => (


                                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                        <Grid item xs={9}>
                                            <Card className="border-radius-none">
                                                <CardBody className="m-2">
                                                    <ul className="mb-2 ml-0 grid gap-5">
                                                        <li className="uppercase font-normal text-2xl mt-5">

                                                            {task.TITLE}

                                                        </li>
                                                        <Divider />
                                                        <li className="uppercase font-normal text-xl mt-5" dangerouslySetInnerHTML={{ __html: task.DESCRIPTION }}>
                                                        </li>
                                                        <Divider />
                                                        <li className="uppercase font-normal text-2xl mt-5">
                                                            <div className="flex gap-4">
                                                                {FINISHbtn ? (
                                                                    <>
                                                                        {Startbtn ? (
                                                                            <Button variant="contained" onClick={() => handeltaskstatus("Start")} style={{ background: '#bbed21', color: 'black' }}>
                                                                                Start
                                                                            </Button>
                                                                        ) : (
                                                                            <Button variant="contained" onClick={() => handeltaskstatus("Pause")} style={{ background: '#bbed21', color: 'black' }}>
                                                                                Pause
                                                                            </Button>
                                                                        )}
                                                                        <Button variant="contained" onClick={() => handeltaskstatus("Finish")} style={{ background: '#bbed21', color: 'black' }}>
                                                                            Finish
                                                                        </Button>
                                                                    </>
                                                                ) : ("")}
                                                                {JSON.parse(task.create_user).ID != USERID ? null : (
                                                                    <Dropdown>
                                                                        <DropdownTrigger>
                                                                            <Button
                                                                                variant="outlined"
                                                                                style={{ borderColor: '#808080a6', color: '#4e4c4c' }}
                                                                                endIcon={<KeyboardArrowDownIcon />}
                                                                            >
                                                                                More
                                                                            </Button>
                                                                        </DropdownTrigger>
                                                                        <DropdownMenu aria-label="Static Actions">
                                                                            <DropdownItem key="edit" onClick={handleCreateClick}>Edit file</DropdownItem>
                                                                            <DropdownItem key="delete" className="text-danger" onClick={() => handledeletetask(task.TASKID, task.TASKTOKEN)} color="danger">
                                                                                Delete file
                                                                            </DropdownItem>
                                                                        </DropdownMenu>
                                                                    </Dropdown>
                                                                )}
                                                            </div>
                                                        </li>
                                                    </ul>



                                                </CardBody>
                                            </Card>

                                            {Subtaskdata.length === 0 ? null : (
                                                <div className="mt-4">
                                                    {/* Render the Subtask component */}
                                                    <Subtask subtaskData={Subtaskdata} />
                                                </div>
                                            )}


                                            <div className="mt-4">
                                                {/* Render the Subtask component */}
                                                <TaskHistory History={History} Comment={Comment} Taskdata={Taskdata} />
                                            </div>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <Card className="border-radius-none">
                                                <CardBody className="m-2">
                                                    <ul className="mb-2 ml-0">
                                                        <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Deadline : </span>
                                                                <span> {task.DEADLINE ? `${formatDate(task.DEADLINE)}` : 'No Deadline'}</span>
                                                            </div>
                                                            <Divider />
                                                        </li>
                                                        <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Created on : </span>
                                                                <span>{task.CREATEDON ? `${formatDate(task.CREATEDON)}` : 'No Deadline'}</span>
                                                            </div>
                                                            <Divider />
                                                        </li>
                                                        <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Created by</span>
                                                            </div>
                                                            <div>
                                                                <ul className="mb-2 ml-0">
                                                                    {/* {JSON.parse(task.create_user) && task.create_user.map((User_create: any, index: any) => ( */}
                                                                    <li className="uppercase font-normal text-xs mt-5">
                                                                        <User
                                                                            name={JSON.parse(task.create_user).CLIENT_NAME}
                                                                            description="Task created"
                                                                            avatarProps={{
                                                                                src: (JSON.parse(task.create_user).PROFILE_URL)
                                                                            }}
                                                                        />
                                                                    </li>
                                                                    {/* ))} */}
                                                                </ul>
                                                            </div>
                                                            <Divider />
                                                        </li>

                                                        <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Assignee</span>
                                                            </div>
                                                            <div>
                                                                <ul className="mb-2 ml-0">
                                                                    <li className="uppercase font-normal text-xs mt-5">
                                                                        <User
                                                                            name={JSON.parse(task.assigned).CLIENT_NAME}
                                                                            description="Product Designer"
                                                                            avatarProps={{
                                                                                src: (JSON.parse(task.assigned).PROFILE_URL)
                                                                            }}
                                                                        />

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <Divider />
                                                        </li>

                                                        {/* <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Participants</span>
                                                            </div>
                                                            <div>
                                                                <ul className="mb-2 ml-0">
                                                                    <li className="uppercase font-normal text-xs mt-5">
                                                                        <User
                                                                            name="Jane Doe"
                                                                            description="Product Designer"
                                                                            avatarProps={{
                                                                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                                                                            }}
                                                                        />

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <Divider />
                                                        </li>

                                                        <li className="uppercase font-normal text-xs mt-5">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Observers</span>
                                                            </div>
                                                            <div>
                                                                <ul className="mb-2 ml-0">
                                                                    <li className="uppercase font-normal text-xs mt-5">
                                                                        <User
                                                                            name="Jane Doe"
                                                                            description="Product Designer"
                                                                            avatarProps={{
                                                                                src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                                                                            }}
                                                                        />

                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <Divider />
                                                        </li> */}

                                                        <li className="uppercase font-normal text-xs mt-5 grid gap-4">
                                                            <div className="flex justify-between p-3 font-bold">
                                                                <span>Tags</span>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                {JSON.parse(task.TAG).map((Tags: any) => (
                                                                    <Chip radius="sm">{Tags}</Chip>
                                                                ))}
                                                            </div>
                                                            <Divider />
                                                        </li>
                                                    </ul>

                                                </CardBody>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                ))}
                            </ModalBody>

                            <ModalFooter className="bg-white justify-center">
                                <div className="flex gap-4">
                                    <Button variant="contained" color="error" onClick={CloseModal}>
                                        CANCEL
                                    </Button>
                                </div> 
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>


            {view && <Editform Taskdata={Taskdata} />}
        </>
    );
}
