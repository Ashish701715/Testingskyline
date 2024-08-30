import React, { useState, useEffect } from "react";
import { Button, Checkbox, Input, Card, Select, SelectItem } from "@nextui-org/react";
import DefaultLayout from "../../pages/Pages/Offcanva/Default";
// import '../style.css';
import user_add from "../user/user_icon/user_add.svg";
import { generateJWT } from "../../pages/JWT";
import { GetsUserAPI } from "../../APIurl/url";
import { UPDATE } from "../../APIurl/url";
import Swal from 'sweetalert2';
import { APIURL } from "../../APIurl/url";
interface Department {
    ID: any;
    PRODUCT_NAME: string;
    BRAND: string;
    TYPE: string;
    CODE: any;
    PRICE: any;
    QUANTITY: any;
    ASSIGNEE_USER: any;
}

interface Gender {

}

interface userIdProps {
    selectedUserId: any; // Define the type of subtaskData
}

const JWT_SCREET = import.meta.env.VITE_API_CALL_SCREET_KEY;
const Edit_inventory: React.FC<userIdProps> = ({ selectedUserId }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [Genders, setGenders] = useState<Gender[]>([]);
    const [isOpen, onOpen] = useState(true);
    const [getuser, setUserData] = useState([]);

    //get Inventory data
    useEffect(() => {
        const payload = { REQUEST: "Department", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((tokens) => {
            const response = fetch(GetsUserAPI + '?get=Getdepartmentname&isview=true&edit=false', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${tokens}`,
                },
                body: JSON.stringify({
                    'PAGE_REQUEST': 'GET_INVENTORYDATA',
                    'PRODUCT_ID': selectedUserId,
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        setDepartments(data.data);
                    } else {
                        console.error('Failed to fetch departments:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching departments:', error));
        });

    }, [])

    useEffect(() => {
        const payload = { REQUEST: "Department", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((tokens) => {
            const response = fetch(GetsUserAPI + '?get=Getdepartmentname&isview=true&edit=false', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${tokens}`,
                },
                body: JSON.stringify({
                    'PAGE_REQUEST': 'GET_USERDATA',
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === true) {
                        setUserData(data.data);
                    } else {
                        console.error('Failed to fetch departments:', data.message);
                    }
                })
                .catch(error => console.error('Error fetching departments:', error));
        });

    }, [])


    const updateinvantory = (event: any) => {

        event.preventDefault();
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'UPDATEINVENTORY');
        const payload = { REQUEST: "UPDATEINVENTORY", is_Admin: false, isValid: true };
        const secretKey = JWT_SCREET;
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);
        token
            .then((JwtToken) => {
                fetch(UPDATE, {
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


    const [show, setshow] = useState(false);
    setTimeout(() => {
        setshow(true);
    }, 300);




    const Form = () => {
        const [isVisible, setIsVisible] = useState(true);
        const [isloading, setisloading] = useState(false);
        const toggleVisibility = () => {
            setIsVisible(!isVisible);
        };

        function setAddContactModal(arg0: boolean): void {
            throw new Error("Function not implemented.");
        }

        return (
            <>
                <div className="mx-5">

                    <Card className="p-5">
                        <div className="flex gap-4 items-center">
                            <div className="invite-title-icon invite-title-icon-link">
                                <img src={user_add} alt="Add User Icon" />
                            </div>
                            <div className="invite-title-text">Edit  Inventory</div>
                        </div>
                        <hr className="mt-4" />
                        <form onSubmit={updateinvantory}>
                            {departments.map(profile => (
                                <div className="mt-4 flex flex-col gap-4 ">
                                    <input type="hidden" name="prodctid" value={profile['ID']} />
                                    <Input type="text" label="Product Name" placeholder="Product Name" name="productname" value={profile['PRODUCT_NAME']} required />
                                    <Input type="text" label="Brand" placeholder="Enter Brand Name" name="brand" value={profile['BRAND']} required />
                                    <Input type="text" label="Product Type" placeholder="Product Type" name="type" value={profile['TYPE']} required />
                                    <Input type="text" label="Code" placeholder="Enter Code Detail" name="code" value={profile['CODE']} required />
                                    <Input type="number" label="Price" placeholder="Enter Price" name="price" value={profile['PRICE']} required />

                                    <Input type="number" label="Quantity" name="quantity" value={profile['QUANTITY']} required />

                                    <Select
                                        label="ASSIGNEE"
                                        className=""
                                        name="assignee_user"
                                        defaultSelectedKeys={`${profile['ASSIGNEE_USER']}`}
                                    >
                                        {getuser.map((USER: any) => (
                                            <SelectItem key={USER.ID}>
                                                {USER.CLIENT_NAME}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {/* <Checkbox defaultSelected name="acountstatus" value="N">Edit Item</Checkbox> */}

                                    <div className="flex justify-center gap-4 mt-4">
                                        <Button type="submit" className="gap-4 text-white font-extrabold" color="success" isLoading={isloading}>
                                            {isloading ? 'Processing...' : 'UPDATE'}
                                        </Button>
                                        {/* <Button type="button" className="" color="danger" onClick={() => setAddContactModal(false)}>
                                            Cancel
                                        </Button> */}
                                    </div>
                                </div>
                            ))}
                        </form>
                    </Card>

                </div>


            </>
        );
    }

    return (
        <>
            {show ? <Form /> : <DefaultLayout />}
        </>

    );
}

export default Edit_inventory;