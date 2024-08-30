import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Token from '../../../../getLoggedUser/GetUserInfomation';
import { v1Dashboard } from '../../../../APIurl/url';
import { INSERTDATA } from '../../../../APIurl/url';
import { debounce } from 'lodash';
import { Select, SelectItem } from "@nextui-org/react";

export default function App({ Clientdata, setrefreshquery }: any) {
    const JwtToken = Token('jwt');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [countryOptions, setCountryOptions] = useState([]);
    const [Loader, setLoader] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    const handleCountryChange = (selection: Set<string>) => {
        setSelectedCountries(Array.from(selection));
    };


    const getStaffAnnouncement = async () => {
        try {
            const response = await fetch(`${v1Dashboard}`, {
                method: 'POST',
                headers: {
                    'Authenticate': `Bearer ${JwtToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'GET.COUNTRY.DATA',
                }),
            });
            const data = await response.json();
            setCountryOptions(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const debouncedGetStaffAnnouncement = debounce(getStaffAnnouncement, 300);

    useEffect(() => {
        debouncedGetStaffAnnouncement();
    }, []);



    const handleCountrySubmit = async (event: any) => {
        event.preventDefault();
        setLoader(true);
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'ADD.COUNTRY.DATA');
        formData.append('CLIENT_ID', Clientdata[0]?.UUID || '');


        try {
            const response = await fetch(`${INSERTDATA}`, {
                method: 'POST',
                headers: {
                    'Authenticate': `Bearer ${JwtToken}`,
                    'x-token-access': `true`,
                },
                body: formData,
            });
            const data = await response.json();
            if (data.status == true) {
                setLoader(false);
                // setrefreshquery();
                onClose();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Button className="btn btn-primary" onClick={onOpen}>Add Country</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Add Country</ModalHeader>
                        <ModalBody>
                            {/* <p>{Clientdata[0]?.COUNTRY_NAME}</p> */}
                            <form onSubmit={handleCountrySubmit}>
                                <Select
                                    label="Country"
                                    selectionMode="multiple"
                                    name="Country[]"

                                    disabledKeys={JSON.parse(Clientdata[0]?.COUNTRY_NAME)}
                                >
                                    {countryOptions.map((country: any) => (
                                        <SelectItem key={country.COUNTRY_NAME} value={country.COUNTRY_NAME}>
                                            {country.COUNTRY_NAME}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <ModalFooter>
                                    <Button color="primary" type="submit" isDisabled={Loader ? true : false}>
                                        {Loader ? "Wait..." : "Add"}
                                    </Button>
                                    <Button color="primary" onClick={onClose}>
                                        Cancel
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalBody>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
}
