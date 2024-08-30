import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Select, SelectItem, Textarea, Tabs, Tab, Card, CardBody, } from "@nextui-org/react";
import DefaultLayout from "../pages/Pages/Offcanva/Default";
import './user/style.css';
import user_add from "./user/user_icon/user_add.svg";
import { generateJWT } from "../pages/JWT";
import { v1GETDATA } from "../APIurl/url";
import { GetsUserAPI } from "../APIurl/url";
import { RadioGroup } from "@mui/material";
import Swal from 'sweetalert2';
import { APIURL } from "../APIurl/url";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Token from '../getLoggedUser/GetUserInfomation';
import debounce from 'lodash.debounce';
const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
interface Department {
    ID: number;
    COUNTRY_NAME: string;
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
    BRANCH: any;
}

interface userIdProps {
    selectedUserId: any; // Define the type of subtaskData
}

const Userprofile: React.FC<userIdProps> = ({ selectedUserId }) => {
    const token = Token('jwt');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [Profile, setprofile] = useState<Profiledata[]>([]);
    const [isOpen, onOpen] = useState(true);
    const [selectedRole, setSelected]: any = useState();

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


    function onOpenChange(unusedArg: any) {
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

    //get department data
    const debouncedUserFetch = debounce(async () => {
        try {
            const responseData: any = await fetch(v1GETDATA, {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': 'true',
                },
                body: JSON.stringify({ PAGE_REQUEST: 'Get.Country.data' }),
            });
            const data = await responseData.json();
            setDepartments(data.data);
        } catch (err) {

        }
    }, 300);


    useEffect(() => {
        debouncedUserFetch();
    }, []);

    useEffect(() => {
        const payload = { REQUEST: "PROFILEDATA", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
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
                        setprofile(data.data);
                        setSelected(data.data[0].IS_ADMIN);
                    } else {
                        console.error('Failed to fetch departments:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching departments:', error));
        });

    }, [])

    const updateprofile = (event: any) => {

        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'UPDATEprofile');
        const payload = { REQUEST: "UPDATEprofile", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);
        token
            .then((JwtToken) => {
                fetch(APIURL, {
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
                            onOpen(false)
                            Swal.fire({
                                icon: 'success',
                                title: data.message,
                                padding: '2em',
                                customClass: 'sweet-alerts',
                            }).then((result) => {
                                if (result && result.isConfirmed) {
                                    // const form = document.getElementById("FomrId") as HTMLFormElement;
                                    // if (form) {
                                    window.location.reload();
                                    // }
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
    }


    const Form = () => {
        const [isVisible, setIsVisible] = useState(true);
        const [isloading, setisloading] = useState(false);
        const toggleVisibility = () => {
            setIsVisible(!isVisible);
        };
        // console.log(Profiles[0].CLIENT_NAME)
        //insert data
        return (
            <>
                {Profile.map(profile => (
                    <div className="mx-5">
                        <form onSubmit={updateprofile}>
                            <Card className=" p-5 ">
                                <div className="flex gap-4 items-center">
                                    {/* <div className="invite-title-icon invite-title-icon-link"> <img src={profile.PROFILE_URL} width={'30px'} /></div> */}
                                    <div className="invite-title-text"><b>Update User</b></div>
                                </div>
                                <hr className="mt-4" />

                                <div className="mt-4 flex flex-col gap-6">
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Input type="text" label="Full Name" defaultValue={profile.CLIENT_NAME} placeholder="Full Name" name="fullname" required />
                                        <input type="hidden" name="Client_ID" value={profile.CLIENT_ID} />
                                        <input type="hidden" name="ID" value={profile.ID} />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Input type="email" label="E-mail" placeholder="Enter E-mail" defaultValue={profile.CLIENT_EMAIL} name="email" required />
                                        <Input type="number" label="User Number" placeholder="Enter User Number" defaultValue={profile.CONTACT_NUMBER} name="number" required />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Input type="date" label="DOB" placeholder="Enter Date of birth" name="DOB" defaultValue={profile.DOB} required />
                                        <Input type="date" label="Hiring Date" placeholder="Enter Hiring Date" name="hiringdate" defaultValue={profile.HIRING_DATE} required />
                                    </div>
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <Select className="max-w-xs" label="Sex" name="sex" defaultSelectedKeys={`${profile.SEX}`}>
                                            <SelectItem key="1">
                                                Male
                                            </SelectItem>
                                            <SelectItem key="2">
                                                Female
                                            </SelectItem>
                                        </Select>

                                        <Select
                                            label="Role"
                                            defaultSelectedKeys={[`${selectedRole}`]}
                                            className="max-w-xl"
                                            name="role"
                                            onChange={(e) => setSelected(e.target.value)}
                                        >
                                            <SelectItem key="1">Admin</SelectItem>
                                            {/* <SelectItem key="2" value="2">Super Admin</SelectItem> */}
                                            <SelectItem key="3" >STAFF</SelectItem>
                                            <SelectItem key="4" >AGENT</SelectItem>
                                        </Select>

                                        {selectedRole == 3 ? (
                                            <Select
                                                items={departments}
                                                label="Department"
                                                placeholder="Select Department"
                                                name="department"
                                                defaultSelectedKeys={`${profile.BRANCH}`}
                                                required
                                            >
                                                {departments.map((department) => (
                                                    <SelectItem key={department.ID} value={department.ID}>
                                                        {department.COUNTRY_NAME}
                                                    </SelectItem>
                                                ))}
                                            </Select>

                                        ) : ''}


                                    </div>

                                    <Input type="text" label="Address" variant="bordered" defaultValue={profile.ADDRESS} name="Address" />

                                </div>
                            </Card>
                            <div className=""></div>
                            <div className="absolute bottom-0 bg-white w-full flex justify-center gap-4">
                                <Button type="submit" className="mt-4 btn btn-primary" isLoading={isloading}> {isloading ? 'Processing...' : 'UPDATE'}</Button>
                                {/* <Button className="mt-4" color="danger" onClick={() => onOpenChange(false)}> cancel </Button> */}
                            </div>
                        </form>
                    </div>
                ))}
            </>
        );
    }

    return (
        <>
            {show ? <Form /> : <DefaultLayout />}
        </>

    );
}

export default Userprofile;