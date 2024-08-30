import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Select, SelectItem, Textarea, Tabs, Tab, Card, CardBody, } from "@nextui-org/react";
import DefaultLayout from "../pages/Pages/Offcanva/Default";
import './user/style.css';
import user_add from "./user/user_icon/user_add.svg";
import { generateJWT } from "../pages/JWT";
import { GetUserAPI } from "../APIurl/url";
import { GetsUserAPI } from "../APIurl/url";
import { RadioGroup } from "@mui/material";
import Swal from 'sweetalert2';
import { APIURL } from "../APIurl/url";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
interface Department {
    ID: number;
    DEPARTMENT_NAME: string;
    SUB_DEPARTMENT: string;
}

interface Profiledata {
    ID: any;
    CLIENT_NAME: any;
    CONTACT_NUMBER: any;
    CLIENT_EMAIL: any;
    DOB: any;
    HIRING_DATE: any;
    SEX: any;
    ADDRESS: any;
    PROFILE_URL: any;
    IS_ADMIN: any;
    CLIENT_ID: any;
}

interface userIdProps {
    selectedUserId: any; // Define the type of subtaskData
}

const Userprofile: React.FC<userIdProps> = ({ selectedUserId }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [Profile, setprofile] = useState<Profiledata[]>([]);
    const [isOpen, onOpen] = useState(true);
    const [selectedRole, setSelected] = useState(false);

    const handleRoleChange = (event: any) => {
        const selected = event.target.value;
        if (selected == 'Manager') {
            setSelected(true);
        } else if (selected == 'Employee') {
            setSelected(true);
        } else {
            setSelected(false);
        }
    };


    function onOpenChange() {
        if (isOpen == true) {
            onOpen(false)
        } else {
            onOpen(true)
        }
    }
    const [show, setshow] = useState(false);
    setTimeout(() => {
        setshow(true);
    }, 300);




    const Profiles = Profile;
    function countStars(singleObject: any, array: any) {
        let sub_id = singleObject.SUB_DEPARTMENTID;
        let stars = '';

        if (sub_id === null) {
            return '*';
        } else {
            let parent = array.find((dept: any) => dept.ID === parseInt(sub_id));
            let parent_stars = countStars(parent, array);
            stars = parent_stars + '*';
        }

        return stars;
    }

    function addDots(singleObject: any, array: any) {
        let sub_id = singleObject.SUB_DEPARTMENTID;
        let separator = '';

        if (sub_id === null) {
            separator = '*';
        } else {
            let parent = array.find((dept: any) => dept.ID === parseInt(sub_id));
            let parent_subid = parent.SUB_DEPARTMENTID;

            if (parent_subid === null) {
                separator = countStars(singleObject, array);
            } else {
                separator = countStars(parent, array) + '*';
            }
        }

        return `${separator} ${singleObject.DEPARTMENT_NAME}`;
    }

    useEffect(() => {
        const payload = { REQUEST: "PROFILEDATA", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 50;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((tokens) => {
            const response = fetch(GetsUserAPI + '?get=GETUSERPROFILE&isview=true&edit=false', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${tokens}`,
                },
                body: JSON.stringify({
                    'PAGE_REQUEST': 'GETUSERPROFILEDATA',
                    'USER_ID': selectedUserId,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        // console.log(data.data);
                        setprofile(data.data); // Assuming 'departments' exists in the response
                    } else {
                        console.error('Failed to fetch departments:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching departments:', error));
        });

    }, [])

    return (
        <div className="demos">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" placement="top-center" className="modalclose inviteuser" isDismissable={false} isKeyboardDismissDisabled={true} >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Invite User</ModalHeader>
                    {Profile.map(profile => (
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 mb-5">
                                <div className="panel h-72">
                                    <div className="flex items-center justify-between mb-5">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                                    </div>
                                    <div className="">
                                        <div className="flex flex-col justify-center items-center">
                                            <img src={profile.PROFILE_URL} alt="img" className="w-40 h-40 rounded-full object-cover  mb-5" />

                                        </div>


                                    </div>
                                </div>
                                <div className="panel lg:col-span-2 xl:col-span-2">
                                    <div className="">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Contact Information</h5>
                                        <hr></hr>
                                        <div className="mb-5">

                                        </div>
                                        <div className="">
                                            <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                                <table className="whitespace-nowrap">

                                                    <tbody className="dark:text-white-dark">
                                                        <tr>
                                                            <td>Name:</td>

                                                            <td className="text font-normal">{profile.CLIENT_NAME}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Contact Email:</td>

                                                            <td className="text font-normal">{profile.CLIENT_EMAIL}</td>

                                                        </tr>
                                                        <tr>
                                                            <td>Department:</td>
                                                            <td className="text font-normal">{profile.CLIENT_EMAIL}</td>
                                                            <td className="text-center"></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Notification Language:</td>

                                                            <td className="text font-normal">English</td>

                                                        </tr>

                                                        <tr>
                                                            <td>Sex:</td>
                                                            <td className="text font-normal">{profile.SEX}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Date of Birth:</td>

                                                            <td className="text font-normal">05/04/2004</td>

                                                        </tr>
                                                        <tr>
                                                            <td>Mobile Number:</td>

                                                            <td className="text font-normal">{profile.CONTACT_NUMBER}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="mb-5">
                                        <div className="table-responsive text-[#515365] dark:text-white-light font-semibold">
                                            <table className="whitespace-nowrap">
                                                <thead>

                                                </thead>
                                                <tbody className="dark:text-white-dark">
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className=" h-40" style={{ marginTop: -130 }}>

                                </div>


                                <div className="lg:col-span-1 xl:col-span-1">
                                </div>
                            </div>
                        </div>
                    ))}
                </ModalContent>

            </Modal>
        </div >
    );
}

export default Userprofile;