import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Editor } from "primereact/editor";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import userInfo from '../../getLoggedUser/GetUserInfomation';
import { ClockAPI } from '../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
export default function App() {
    const token = userInfo('jwt');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loader, setLoader] = useState(false);
    const [title, setTitle] = useState('');
    const [editorData, setEditorData] = useState('');
    const [deadline, setDeadline] = useState('');
    const [Selectuser, setselectuser] = useState('All');


    const MySwal = withReactContent(Swal);

    const handleEditorChange = (value: any) => {
        setEditorData(value.htmlValue);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDeadlineChange = (date: Date[]) => {
        setDeadline(date[0].toISOString());
    };





    const handleAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation checks
        if (!title || !editorData || !deadline) {
            alert('All fields are required');
            return;
        }

        setLoader(true);
        try {
            const response = await fetch(ClockAPI + '?action=view.client.record&limit=', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'INSERT.Announcement.DATA',
                    title,
                    content: editorData,
                    deadline,
                    Selectuser,
                }),
            });

            const data = await response.json();
            if (data.status) {
                setTitle('');
                setEditorData('');
                setDeadline('');
                MySwal.fire({
                    title: 'Announcement Successfully Posted',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-default`,
                    },
                }).then(() => {

                });

            } else {

                MySwal.fire({
                    title: 'Something went wrong',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    showCloseButton: true,
                    customClass: {
                        popup: `color-danger`,
                    },
                }).then(() => {
                });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to publish announcement');
        } finally {
            setLoader(false);
        }
    };

    return (
        <>
            <Button onPress={onOpen} className="btn-primary">New Announcement</Button>
            <Modal size={'2xl'} isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Publish Announcement</ModalHeader>
                            <ModalBody>
                                <form className="grid gap-3" onSubmit={handleAnnouncement}>
                                    <Input
                                        type="text"
                                        label="Announcement Title"
                                        isRequired
                                        value={title}
                                        onChange={handleTitleChange}
                                    />

                                    <Select
                                        placeholder="Select"
                                        defaultSelectedKeys={['All']}
                                        onChange={(event) => { setselectuser(event.target.value) }}
                                    >
                                        <SelectItem key="All">All</SelectItem>
                                        <SelectItem key="Agent">Agent</SelectItem>
                                        <SelectItem key="Staff">Staff</SelectItem>
                                    </Select>

                                    <Editor
                                        value={editorData}
                                        onTextChange={handleEditorChange}
                                        style={{ height: '320px' }}
                                    />

                                    <Flatpickr
                                        name="Deadline"
                                        className="design_input p-3"
                                        placeholder="Deadline for Posts"
                                        value={deadline}
                                        onChange={handleDeadlineChange}
                                    />

                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                        <Button color="primary" type="submit" disabled={loader}>
                                            {loader ? 'Wait..' : 'Submit'}
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
