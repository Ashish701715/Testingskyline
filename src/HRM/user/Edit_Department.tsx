import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

export default function App() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [departmentName, setDepartmentName] = useState("");
    const [subDepartment, setSubDepartment] = useState("");

    // Function to handle changes in department name input field
    const handleDepartmentNameChange = (e: any) => {
        setDepartmentName(e.target.value);
    };

    // Function to handle changes in sub-department input field
    const handleSubDepartmentChange = (e: any) => {
        setSubDepartment(e.target.value);
    };

    // Function to save changes and close the modal
    const handleSaveChanges = () => {
        // Perform actions to save changes (e.g., update database)
        // Close the modal
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit Department</ModalHeader>
                        <ModalBody>
                            {/* Input field for department name */}
                            <input
                                type="text"
                                value={departmentName}
                                onChange={handleDepartmentNameChange}
                                placeholder="Department Name"
                            />
                            {/* Input field for sub-department */}
                            <input
                                type="text"
                                value={subDepartment}
                                onChange={handleSubDepartmentChange}
                                placeholder="Sub-Department"
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onClick={onClose}>
                                Close
                            </Button>
                            <Button color="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
            {/* Button to open the modal */}
            <Button color="primary" onClick={onOpen}>
                Edit Department
            </Button>
        </>
    );
}
