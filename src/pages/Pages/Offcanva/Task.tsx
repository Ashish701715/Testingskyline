import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from 'react';
import './task.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Autocomplete from '@mui/joy/Autocomplete';
import { GETDATA } from "../../../APIurl/url";
import { TASKAPI } from "../../../APIurl/url";
import { generateJWT } from "../../JWT";
import Avatar from '@mui/joy/Avatar';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { HTMLAttributes } from 'react';

// Define interfaces
interface User {
    CLIENT_NAME: string;
    CLIENT_ID: string;
    USER_RECORD: string;
    CLIENT_EMAIL: string;
    ID: number;
}

type OptionType = { value: string; label: string; };

// Define ValueType
type ValueType<OptionType> = OptionType | OptionType[] | null;

interface DivProps extends HTMLAttributes<HTMLDivElement> {
    key: string;
    className?: string;
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
  
interface TaskFormData {
    assignees: User[];
    participants: User[];
    observers: User[];
    type: string;
    CREATEDBY: string;
    DEADLINE: string;
    tags: string[];
    priority: string;
    LeadId: string;
    LeadForm: string;
    PAGE_REQUEST: string;
    DESCRIPTION: string;
    TASK_NAME: string;
}

export default function Task() {


    const USERID_TOKEN = localStorage.getItem('auth_token') ?? '0';
    const { SerialId, EncryptId } = useParams();
    const { isOpen , onOpen, onClose } = useDisclosure();
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
        const expirationTimestampInSeconds = currentTimestampInSeconds + 50;
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
                    const formattedTags = data.data.map((tag:any) => ({
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

    // State for form data
    const [taskName, setTaskName] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(event.target.value);
    };

    const [selectedPriority, setSelectedPriority] = useState(priorityOptions[0]);


    const handlePriorityChange = (selectedOption: any) => {
        setSelectedPriority(selectedOption);
    };

    const [selectedTags, setSelectedTags] = useState<{ value: string, label: string }[]>([]);

    // Handle tag change
    const handleTagChange = (newValue: MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => {
        if (actionMeta.action === 'select-option' || actionMeta.action === 'remove-value') {
            setSelectedTags(newValue as OptionType[]);
        }
    };

    const [value1, setValue1] = useState<string>('');
    const [date2, setDate2] = useState<Date | null>(null);
    const [formData, setFormData] = useState<TaskFormData>({
        TASK_NAME: taskName,
        assignees: [],
        participants: [],
        observers: [],
        DEADLINE: date2 !== null ? date2.toISOString() : '',
        tags: selectedTags.map((tag) => tag.value), 
        type: 'lead',
        CREATEDBY : USERID_TOKEN,
        priority: selectedPriority.value,
        LeadId: SerialId ?? '',
        LeadForm: EncryptId ?? '',
        PAGE_REQUEST: 'LeadTaskRequest',
        DESCRIPTION: ''
    });

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            TASK_NAME: taskName
        }));
    }, [taskName]);

    useEffect(() => {
        const tagValues = selectedTags.map(tag => tag.value);
        setFormData(prevState => ({
            ...prevState,
            tags: tagValues
        }));
    }, [selectedTags]);

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            priority: selectedPriority.value
        }));
    }, [selectedPriority]);

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            DESCRIPTION: value1
        }));
    }, [value1]);

    useEffect(() => {
        setFormData(prevState => ({
            ...prevState,
            DEADLINE: date2 ? date2.toISOString() : ''
        }));
    }, [date2]);


    const StoreTask = (e: React.FormEvent<HTMLFormElement>) => {
        setLoader(true);
        e.preventDefault();
        let url = `view=comment&edit=true$delete=true&auth=true`;
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((JwtToken) => {
            fetch(TASKAPI + '?action=insert-task&auth=true&view=true&edit=false', {
                method: "POST",
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                },
                body: JSON.stringify(formData),
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.status == true) {
                    setLoader(false);
                    Swal.fire({
                        icon: 'success',
                        title: data.message,
                        padding: '2em',
                        customClass: 'sweet-alerts',
                    }).then((result) => {
                              if (result && result.isConfirmed) {
                                const form = document.getElementById("FomrId") as HTMLFormElement;
                                if (form) {
                                    form.reset();
                                    // Also reset the form data state
                                    setTaskName('');
                                    setSelectedTags([]);
                                    setSelectedPriority(priorityOptions[0]);
                                    setValue1('');
                                    setDate2(null);
                                    setFormData({
                                        ...formData,
                                        assignees: [],
                                        participants: [],
                                        observers: [],
                                        DEADLINE: '',
                                        tags: [],
                                        priority: priorityOptions[0].value,
                                    });
                                }
                            }
                    });
                } else {
                    setLoader(false);
                    Swal.fire({
                        icon: 'error',
                        title: data.message,
                        padding: '2em',
                        customClass: 'sweet-alerts',
                    });
                }
            })
        }).catch((err) => {
            setLoader(false);
            console.warn(err);
        })
    };

    return (
        <>
            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose} size="full" style={{ marginLeft: '15%' }} className="bg-dark-light " isDismissable={false} >
                <ModalContent className="overflow-auto">
                    {(onClose) => (
                        <>
                            <form onSubmit={StoreTask} id="FomrId">
                                <ModalHeader className="flex flex-col gap-1 text-4xl font-thin text-heading">New task</ModalHeader>
                                <ModalBody>
                                    <div className="Task-Body task-body">
                                        <input
                                            type="text"
                                            name="TASK_NAME"
                                            placeholder="Title..."
                                            className="form-input border-none font-thin text-xl"
                                            required
                                            value={taskName}
                                            onChange={handleChange}
                                        />
                                        <ReactQuill
                                            theme="snow"
                                            value={value1}
                                            placeholder="type message..."
                                            onChange={setValue1}
                                        />
                                        <div className="assign-card">
                                            <div className="flex">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Assignee
                                                </label>
                                                <Autocomplete
                                                    id="tags-default"
                                                    multiple
                                                    placeholder="Assigned To"
                                                    className="h-[60px] w-[100%] ml-4"
                                                    options={user}
                                                    getOptionLabel={(user) => user.CLIENT_NAME}
                                                    onChange={(event, selectedUsers) => {
                                                        setFormData({
                                                            ...formData,
                                                            assignees: selectedUsers
                                                        });
                                                    }}
                                                    renderOption={(props, user: User) => (
                                                        <div {...props as DivProps} key={user.ID} className={`flex items-center gap-2 ${props.className}`}>
                                                            <Avatar
                                                                alt={user.CLIENT_NAME}
                                                                className="flex-shrink-0"
                                                                size="sm"
                                                                src={user.USER_RECORD}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span>{user.CLIENT_NAME}</span>
                                                                <span className="text-default-500 text-tiny">({user.CLIENT_EMAIL})</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Participants 
                                                </label>
                                                <Autocomplete
                                                    id="tags-default"
                                                    multiple
                                                    placeholder="Participants"
                                                    className="h-[60px] w-[100%] ml-4"
                                                    options={user}
                                                    getOptionLabel={(user) => user.CLIENT_NAME}
                                                    onChange={(event, selectedUsers) => {
                                                        setFormData({
                                                            ...formData,
                                                            participants: selectedUsers
                                                        });
                                                    }}
                                                    renderOption={(props, user: User) => (
                                                        <div {...props as DivProps} key={user.ID} className={`flex items-center gap-2 ${props.className}`}>
                                                            <Avatar
                                                                alt={user.CLIENT_NAME}
                                                                className="flex-shrink-0"
                                                                size="sm"
                                                                src={user.USER_RECORD}
                                                            />
                                                            <div className="flex flex-col">
                                                                <span>{user.CLIENT_NAME}</span>
                                                                <span className="text-default-500 text-tiny">({user.CLIENT_EMAIL})</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Set Deadline Date
                                                </label>
                                                <Flatpickr
                                                    data-enable-time
                                                    options={{
                                                        enableTime: true,
                                                        dateFormat: 'M-d-Y h:i K',
                                                        time_24hr: false,
                                                        position: 'auto right',
                                                    }}
                                                    className="form-input h-[60px] w-[100%] ml-4 font-thin"
                                                    placeholder="End Date"
                                                    onChange={(dates) => {
                                                        if (Array.isArray(dates)) {
                                                            setDate2(dates[0]);
                                                        } else {
                                                            setDate2(dates);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Tags
                                                </label>
                                                <Select
                                                    placeholder="Add Tags"
                                                    className="h-[60px] w-[100%]  select_style ml-4 font-thin"
                                                    options={Tag}
                                                    isMulti
                                                    isSearchable={false}
                                                    value={selectedTags}
                                                    onChange={handleTagChange}
                                                />
                                            </div>
                                            <div className="flex sm:flex-row flex-col mt-4">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2 mt-4 font-thin text-neutral-600 text-sm ">
                                                    Task Priority
                                                </label>
                                                <Select
                                                    defaultValue={priorityOptions[0]}
                                                    options={priorityOptions}
                                                    isSearchable={false}
                                                    className="select_style  w-[100%] ml-4 font-thin text-neutral-600 text-sm"
                                                    value={selectedPriority}
                                                    onChange={handlePriorityChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter className="bg-white">
                                    <Button color="danger" onPress={onClose}>
                                        CANCEL
                                    </Button>
                                    {(loader) ? (
                                        <Button color="primary" isLoading>
                                            processing
                                        </Button>
                                    ) : (
                                        <Button color="primary" type="submit" >
                                            SAVE
                                        </Button>
                                    )}
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM LOW', label: 'Medium Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'MEDIUM HIGH', label: 'Medium High' },
    { value: 'HIGH', label: 'High' }
];
