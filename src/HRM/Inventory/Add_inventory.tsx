import debounce from 'lodash.debounce';
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Select, SelectItem, Textarea, Tabs, Tab, Card, CardBody, } from "@nextui-org/react";
import DefaultLayout from "../../pages/Pages/Offcanva/Default";
import user_add from "../user/user_icon/user_add.svg";
import Token from '../../getLoggedUser/GetUserInfomation';
import { GetUserAPI, INSERTDATA, GetsUserAPI } from "../../APIurl/url";
import Swal from 'sweetalert2';
import { right } from "@popperjs/core";
import './inventory.css';

interface Department {
    ID: number;
    DEPARTMENT_NAME: string;
    SUB_DEPARTMENT: string;
}

interface Gender {

}

const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
export default function Add_inventory() {
    const token = Token('jwt');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [Genders, setGenders] = useState<Gender[]>([]);

    const [show, setshow] = useState(false);
    setTimeout(() => {
        setshow(true);
    }, 300);

    //get department data
    const debouncedFetchDepartments = debounce(async () => {
        const payload = { REQUEST: "Department", is_Admin: false, isValid: true };
        try {
            const response = await fetch(GetUserAPI + '?get=Getdepartmentname&isview=true&edit=false', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    'PAGE_REQUEST': 'GET_DEPARTMENTDATA',
                })
            });
            const data = await response.json();
            if (data.status === true) {
                setDepartments(data.data); // Assuming 'departments' exists in the response
            } else {
                console.error('Failed to fetch departments:', data.message);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    }, 300);


    useEffect(() => {
        debouncedFetchDepartments();
    }, []);


    const Form = () => {
        const [isVisible, setIsVisible] = useState(true);
        const [isloading, setisloading] = useState(false);
        const toggleVisibility = () => {
            setIsVisible(!isVisible);
        };

        //insert data

        const handleinventory = async (event: any) => {
            event.preventDefault();
            setisloading(true);

            const authTokenLocalStorage = localStorage.getItem('auth_token');
            const formData = new FormData(event.target);
            formData.append('PAGE_REQUEST', 'INVENTORYFORM');
            formData.append('AUTH_ID', authTokenLocalStorage || '');

            try {
                const response = await fetch(INSERTDATA, {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();
                setisloading(false);

                Swal.fire({
                    icon: data.status ? 'success' : 'error',
                    title: data.message,
                    padding: '2em',
                    customClass: 'sweet-alerts',
                }).then((result) => {
                    if (result && result.isConfirmed) {
                        location.reload();
                    }
                });

            } catch (err) {
                setisloading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'error',
                    padding: '2em',
                    customClass: 'sweet-alerts',
                });
            }
        };

        function setAddContactModal(arg0: boolean): void {
            throw new Error("Function not implemented.");
        }

        return (
            <>
                <div className="mx-5">
                    <form onSubmit={handleinventory}>
                        <Card className="p-5 scrollable-form">
                            <div className="flex gap-4 items-center">
                                <div className="invite-title-icon invite-title-icon-link">
                                    <img src={user_add} alt="Add User Icon" />
                                </div>
                                <div className="invite-title-text text-xl">ADD INVENTORY</div>
                            </div>
                            <hr className="mt-4" />

                            <div className="mt-4 flex flex-col gap-4 " >
                                <Input type="text" label="Product Name" placeholder="Product Name" name="productname" isRequired />
                                <Input type="text" label="Brand" placeholder="Enter Brand Name" name="brand" isRequired />
                                <Input type="text" label="Type" placeholder="Product Type" name="type" isRequired />
                                <Input type="text" label="Code" placeholder="Enter Code detail" name="code" isRequired />
                                {/* <Input type="file" id="image" name="image" accept=".png, .svg, .jpeg, .jpg" required /> */}
                                <Input type="number" label="Price" placeholder="Enter Price" name="price" isRequired />
                                {/* <Input type="number" label="Unit" name="unit" required /> */}
                                <Input type="number" label="Quantity" name="quantity" isRequired />



                            </div>
                        </Card>
                        <div className="flex gap-4 mt-4 ">
                            <Button type="submit" className="gap-4 text-white" color="primary" isLoading={isloading}>
                                {isloading ? 'Processing...' : 'Save'}
                            </Button>

                        </div>
                    </form>
                </div>


            </>
        );
    }

    return (
        <div className="demos">
            <Button onPress={onOpen} color="primary" className="font-bold">Create Inventory</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="full" style={{ marginLeft: '55%' }} placement="top-center" className="modalclose inviteuser" isDismissable={false} isKeyboardDismissDisabled={true} >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Inventory Detail</ModalHeader>
                    {show ? <Form /> : <DefaultLayout />}

                </ModalContent>

            </Modal>
        </div >
    );
}