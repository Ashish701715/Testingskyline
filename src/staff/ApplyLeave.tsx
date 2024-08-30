import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Select, SelectItem, Textarea, Tabs, Tab, Card, CardBody, } from "@nextui-org/react";
import DefaultLayout from "../pages/Pages/Offcanva/Default";
// import './style.css';
// import user_add from "./user_icon/user_add.svg";
import { generateJWT } from "../pages/JWT";
import { INSERTDATA } from "../APIurl/url";
import Swal from 'sweetalert2';
import Token from '../getLoggedUser/GetUserInfomation';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
interface Department {
    ID: number;
    DEPARTMENT_NAME: string;
    SUB_DEPARTMENT: string;
}
const authTokenLocalStorage = localStorage.getItem('auth_token');
const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
export default function App() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const token = Token('jwt');
    const [departments, setDepartments] = useState<Department[]>([]);

    const [isloading, setisloading] = useState(false);

    const [show, setshow] = useState(false);
    setTimeout(() => {
        setshow(true);
    }, 300);

    //get department data
    const handallevae = (event: any) => {
        setisloading(true);
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'Leavesrequest');
        formData.append('AUTH_ID', authTokenLocalStorage || '');
        fetch(INSERTDATA, {
            method: "POST",
            headers: {
                Authenticate: `Bearer ${token}`,
            },
            body: formData
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setisloading(false)
                if (data.status == true) {
                    MySwal.fire({
                        title: data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        showCloseButton: true,
                        customClass: {
                            popup: `color-default`,
                        },
                    });

                } else {
                    MySwal.fire({
                        title: data.message,
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000,
                        showCloseButton: true,
                        customClass: {
                            popup: `color-danger`,
                        },
                    });
                }
            })
            .catch((err) => {
                setisloading(false)
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

        const toggleVisibility = () => {
            setIsVisible(!isVisible);
        };


        return (
            <>
                <div className="m-5">
                    <form onSubmit={handallevae}>
                        <Card className=" p-5 ">

                            <div className="mt-4 flex flex-col gap-4">
                                <Input type="date" label="Starting date" name="startdate" isRequired />
                                <Input type="date" label="Ending date" name="enddate" isRequired />
                                <Input type="Text" label="Leave type" name="leavetype" isRequired />
                                <Textarea label="Leave Reason" name="leavereason"></Textarea>

                            </div>
                            <div className=" bg-white w-full flex justify-center gap-4">
                                <Button type="submit" className="btn-primary"  isLoading={isloading}> {isloading ? 'Processing...' : 'Send Request'}</Button>

                            </div>
                        </Card>


                    </form>
                </div>
            </>
        );
    }

    return (
        <div className="demos">
            <Button onPress={onOpen} color="primary" className="font-bold">CREATE LEAVE</Button>
            <Modal size="xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" className="modalclose inviteuser" isDismissable={false} isKeyboardDismissDisabled={true} >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Leave Request</ModalHeader>
                    {show ? <Form /> : <DefaultLayout />}

                </ModalContent>

            </Modal>
        </div >
    );
}