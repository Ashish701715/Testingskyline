import React, { useState } from "react";
import { useParams, NavLink } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { INSERTDATA } from '../../../APIurl/url';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jwt from '../../../getLoggedUser/GetUserInfomation';
export default function App({ Refresh }: any) {
    const token = jwt('jwt');
    const { client_id } = useParams();
    const { file_id } = useParams();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [Buttonload, Setbtnload] = useState(false);

    const MySwal = withReactContent(Swal);

    const Handalsubmittask = async (event: any) => {
        event.preventDefault();
        Setbtnload(true);
        const formData = new FormData(event.target);
        formData.append('PAGE_REQUEST', 'CREATE.TASKS.DEAL.LEAD.STAFF');
        formData.append('client_id', client_id || '');
        formData.append('Deal_id', file_id || '');
        try {
            const res = await fetch(INSERTDATA + '?action=insertComment', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'x-token-access': `true`,
                },
                body: formData,
            });

            const response = await res.json();
            if (response.status == true) {
                Refresh(true);
                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                }).then(() => {
                    event.target.reset();
                });
            } else {
                MySwal.fire({
                    title: response.message,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                });
            }
        } catch (err) {
            MySwal.fire({
                title: 'Error your form and form components please refresh page and try again',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-success`,
                },
            });
        }
        Setbtnload(false);

    }

    return (
        <>

            <Button onPress={onOpen} className="btn btn-primary">Create Task</Button>
            <Modal size={'xl'} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Task</ModalHeader>
                            <ModalBody>
                                <form onSubmit={Handalsubmittask}>
                                    <div className="grid gap-4">
                                        <Textarea
                                            label="Task Title"
                                            placeholder="Enter your description"
                                            className=""
                                            name="task_title"
                                        />
                                        <Textarea
                                            label="Description"
                                            variant="bordered"
                                            placeholder="Enter your description"
                                            disableAnimation
                                            disableAutosize
                                            classNames={{

                                                input: "resize-y min-h-[80px]",
                                            }}
                                            name="task_Description"
                                        />

                                        <Flatpickr
                                            name="Deadline"
                                            className="design_input"
                                            placeholder="Select Deadline"
                                        />

                                        <Select
                                            label="Select Task Priority"
                                            name="task_priority"
                                        >
                                            <SelectItem key="Low"> Low</SelectItem>
                                            <SelectItem key="Medium"> Medium</SelectItem>
                                            <SelectItem key="High"> High</SelectItem>
                                        </Select>

                                        <div>
                                            <ModalFooter>
                                                <Button type="submit" color="primary" disabled={Buttonload ? true : false}>
                                                    {Buttonload ? 'Wait...' : 'Create'}
                                                </Button>
                                                <Button className="btn-primary" variant="light" onPress={onClose}>
                                                    Close
                                                </Button>

                                            </ModalFooter>
                                        </div>
                                    </div>
                                </form>
                            </ModalBody>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
