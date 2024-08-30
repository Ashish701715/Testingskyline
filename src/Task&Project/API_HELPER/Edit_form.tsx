import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import '../../pages/Pages/Offcanva/task.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Autocomplete from '@mui/joy/Autocomplete';
import { GETDATA } from "../../APIurl/url";
import { TASKAPI } from "../../APIurl/url";
import { UPDATETASK } from "../../APIurl/url";
import { generateJWT } from "../../pages/JWT";
import Avatar from '@mui/joy/Avatar';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
// import Select, { ActionMeta, MultiValue } from 'react-select';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { HTMLAttributes } from 'react';
const authTokenLocalStorage = localStorage.getItem('auth_token');
// Define interfaces
interface User {
    CLIENT_NAME: string;
    CLIENT_ID: string;
    USER_RECORD: string;
    CLIENT_EMAIL: string;
    ID: number;
}
interface Tag {
    ID: number;
    NAME: string;
}

interface TagData extends Tag {
    USER_ID: string;
    USER_NAME: string;
    PROFILE_URL: string;
    IS_VIEW: string;
    IS_DELETE: string;
}


interface TaskDataProp {
    Taskdata: any[]; // Define the type of subtaskData
}

function Edittask({ Taskdata }: TaskDataProp) {
    const editdata = Taskdata[0];
    const assigned_user = JSON.parse(editdata['assigned']);
    const TAG = JSON.parse(editdata['TAG']);
    const PRIORITY = editdata['PRIORITY'];

    const [description, setDescription] = useState<string>(editdata['DESCRIPTION']);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []) as File[];
        setSelectedFiles(files);
    };

    const { SerialId, EncryptId } = useParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    React.useEffect(() => {
        onOpen();
    }, []);
    // State for user data
    const [user, setUser] = useState<User[]>([]);
    useEffect(() => {
        let url = `view=comment&edit=true$delete=true&auth=true`;
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((JwtToken) => {
            fetch(GETDATA + '?action=view-user&auth=true&view=true&edit=false', {
                method: "POST",
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'GET_USER_DATA_LIST'
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status == true) {
                    setUser(data.data);
                }
            })
        }).catch((err) => {
            console.warn(err);
        })
    }, []);

    // State for tag data
    const [Tag, setTags] = useState([]);


    useEffect(() => {
        const fetchTagData = async () => {
            try {
                const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
                const secretKey = "JwtSecret";
                const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
                const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
                const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
                const token = await generateJWT(payload, secretKey, expiresIn);

                const response = await fetch(GETDATA + '?action=get-tag-list&auth=true&view=true&edit=false', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authenticate: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'GET_TAG_LIST'
                    })
                });
                const data = await response.json();
                if (data.status === true) {
                    const formattedTags = data.data.map((tag: any) => ({
                        value: tag.NAME,
                        label: tag.NAME,
                        ID: tag.ID,
                        NAME: tag.NAME
                    }));
                    setTags(formattedTags);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTagData();
    }, []);


    // Loader state
    const [loader, setLoader] = useState(false);

    const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const authTokenLocalStorage = localStorage.getItem('auth_token');
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'UPDATETASK');
        formData.append('DESCRIPTION', description);
        formData.append('AUTH_ID', authTokenLocalStorage || '');
        const payload = { REQUEST: "TASK_PAGE", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);
        token
            .then((JwtToken) => {
                fetch(UPDATETASK, {
                    method: "POST",
                    headers: {

                        Authenticate: `Bearer ${JwtToken}`,
                    },
                    body: formData
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        if (data.status == true) {
                            Swal.fire({
                                icon: 'success',
                                title: data.message,
                                padding: '2em',
                                customClass: 'sweet-alerts',
                            }).then((result) => {
                                if (result && result.isConfirmed) {
                                    location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: data.message,
                                padding: '2em',
                                customClass: 'sweet-alerts',
                            });
                        }
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            title: err,
                            padding: '2em',
                            customClass: 'sweet-alerts',
                        });
                    });
            })
            .catch((err) => {
                Swal.fire({
                    icon: 'error',
                    title: err,
                    padding: '2em',
                    customClass: 'sweet-alerts',
                });
            });
    };
    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    };

    return (
        <>
            <Modal isOpen={isOpen} backdrop="blur" size="full" isDismissable={true} hideCloseButton={true} style={{ marginLeft: '40%', background: '#eef2f4' }} className="light-background-white" >
                <form onSubmit={handleSubmit}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalBody style={{ overflow: 'auto' }}>
                                    <div className="Task-Body task-body">
                                        <input
                                            type="text"
                                            name="TASK_TITLE"
                                            placeholder="Some Text..."
                                            className="form-input border-none font-thin text-xl"
                                            defaultValue={editdata['TITLE']}
                                        />

                                        <input type="hidden" name="TASK_ID" value={editdata['TASKID']} />
                                        <input type="hidden" name="TASK_TOKEN" value={editdata['TASKTOKEN']} />
                                        <ReactQuill
                                            theme="snow"
                                            defaultValue={editdata['DESCRIPTION']}
                                            placeholder="type message..."
                                            onChange={handleDescriptionChange}

                                        />
                                        <div className="assign-card">
                                            <div className="flex">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Assignee
                                                </label>
                                                <Select label="To :" selectionMode="single" name="task_assignee" defaultSelectedKeys={`${assigned_user.ID}`}>
                                                    {user.map((user: any) => (
                                                        <SelectItem key={user.ID} textValue={user.CLIENT_NAME} >
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar alt={user.CLIENT_NAME} className="flex-shrink-0" size="sm" src={user.PROFILE_URL} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{user.CLIENT_NAME}</span>
                                                                    <span className="text-tiny text-default-400">{user.CLIENT_EMAIL}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Participants
                                                </label>
                                                <Select label="To :" selectionMode="multiple" name="Task_participant[]">
                                                    {user.map((user: any) => (
                                                        <SelectItem key={user.ID} textValue={user.CLIENT_NAME}  >
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar alt={user.CLIENT_NAME} className="flex-shrink-0" size="sm" src={user.PROFILE_URL} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small">{user.CLIENT_NAME}</span>
                                                                    <span className="text-tiny text-default-400">{user.CLIENT_EMAIL}</span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Set Deadline Date
                                                </label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'Y-m-d H:i',
                                                        time_24hr: false,
                                                        position: 'auto right',
                                                    }}
                                                    className="form-input h-[60px] w-[100%] ml-4 font-thin"
                                                    value={new Date(editdata['DEADLINE'])}
                                                    name="Deadline"
                                                />

                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Tags
                                                </label>
                                                <Select name="Task_Tags[]" selectionMode="multiple" placeholder="Select Tags" defaultSelectedKeys={TAG}>
                                                    {Tag.map((Tags: any) => (
                                                        <SelectItem key={Tags.NAME} textValue={Tags.NAME}>
                                                            <div className="flex gap-2 items-center">
                                                                {Tags.NAME}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Task Priority
                                                </label>
                                                <Select selectionMode="single" name="Task_priority" placeholder="Select a Priority" defaultSelectedKeys={[PRIORITY]}>
                                                    {priorityOptions.map((priority: any) => (
                                                        <SelectItem key={priority.value} textValue={priority.value}>
                                                            <div className="flex gap-2 items-center">
                                                                {priority.value}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </Select>

                                            </div>


                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    File Upload
                                                </label>
                                                <input type="file" onChange={handleFileChange} multiple name="TASK_FILES[]" />
                                                {selectedFiles.length > 0 && (
                                                    <div>
                                                        <p>Selected Files:</p>
                                                        <ul>
                                                            {selectedFiles.map((file: any, index) => (
                                                                <li key={index}>{file.name}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="bg-white justify-center">

                                    {(loader) ? (
                                        <Button color="primary" isLoading>
                                            processing
                                        </Button>
                                    ) : (
                                        <Button color="primary" type="submit" >
                                            Update
                                        </Button>
                                    )}
                                    <Button color="danger" onPress={onClose}>
                                        CANCEL
                                    </Button>
                                </ModalFooter>

                            </>
                        )}
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
}

export default Edittask;
const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM LOW', label: 'Medium Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'MEDIUM HIGH', label: 'Medium High' },
    { value: 'HIGH', label: 'High' }
];
