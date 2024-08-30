import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { Avatar } from '@nextui-org/avatar';
import { Tabs, Tab, Card, CardBody, Input, Textarea } from '@nextui-org/react';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { GETDATA } from '../../../APIurl/url';
import { NavLink, useParams } from 'react-router-dom';
import { notification, Space } from 'antd';
import { INSERTDATA } from '../../../APIurl/url';
import { Chip } from '@nextui-org/chip';
export default function App({ application_data }: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleOpen = (blur: any) => {
        onOpen();
    };
    const formRef = useRef<HTMLFormElement>(null);
    const [api, contextHolder] = notification.useNotification();
    const token = jwt('jwt');
    const { client_id } = useParams();
    const [loader, setloader] = useState(false);
    const handleComment = async (e: any) => {
        e.preventDefault();
        setloader(true);
        const formData = new FormData(e.target);
        formData.append('PAGE_REQUEST', 'INSERT_OFFER_LETTER_COMMENT');
        formData.append('ClientId', client_id || '');
        formData.append('FileId', application_data.ID || '');
        formData.append('CurrentStage', application_data.CURRENT_STATUS_STAGE || '');
        const res = await fetch(INSERTDATA + '?action=insert-comment-data', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
                'x-token-access': 'true',
            },
            body: formData,
        });

        const data = await res.json();
        if (data.status === true) {
            api['success']({
                message: 'Comment added',
            });
            if (formRef.current) {
                formRef.current.reset();
            }
        } else {
            api['error']({
                message: data.message,
            });
        }
        setloader(false);
    };

    const [CommentDataRecord, setCommentData] = useState([]);
    const CommentData = async () => {
        const res = await fetch(GETDATA + '?action=get-comment-data', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
                'x-token-access': 'true',
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_COMMENT_DATA_OFFER_LETTER',
                FiledID: application_data.ID,
            }),
        });
        const data = await res.json();
        if (data.data.length > 0) {
            setCommentData(data.data);
        } else {
            setCommentData([]);
        }
    };

    useEffect(() => {
        CommentData();
    }, [loader]);

    console.table(application_data);

    return (
        <>
            {contextHolder}
            <div className="flex flex-wrap gap-3">
                <NavLink to={'#'} onClick={() => handleOpen('blur')} className="capitalize">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px]">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </NavLink>
            </div>
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onClose={onClose}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                className="w-[150vh] max-w-full h-[90vh]"
                placement="center"
                hideCloseButton
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">View Offer Letter</ModalHeader>
                            <ModalBody>
                                <div className="flex w-full flex-col">
                                    <Tabs aria-label="Options">
                                        <Tab key="photos" title="Application">
                                            <div className="w-full  mx-auto p-6 md:p-8 lg:p-10">
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="bg-card p-4 rounded-lg shadow">
                                                            <h2 className="text-xl font-bold">Student Details</h2>
                                                            <div className="space-y-2 mt-4">
                                                                <div>
                                                                    <div className="font-medium">Name:</div>
                                                                    <div>
                                                                        {application_data.FIRST_NAME} {application_data.MIDDLE_NAME} {application_data.LAST_NAME}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Email:</div>
                                                                    <div>{application_data.EMAIL}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Phone:</div>
                                                                    <div>{application_data.PHONE_NUMBER}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Gender:</div>
                                                                    <div>{application_data.GENDER}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Address:</div>
                                                                    <div>{application_data.ADDRESS ? application_data.ADDRESS : 'empty'}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Application Comment:</div>
                                                                    <div>{application_data.COMMENT_APPLICATION ? application_data.COMMENT_APPLICATION : 'empty'}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Current Status:</div>
                                                                    <Chip size="sm" color="secondary">
                                                                        {application_data.CURRENT_STATUS_STAGE ? application_data.CURRENT_STATUS_STAGE : 'empty'}
                                                                    </Chip>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="bg-card p-4 rounded-lg shadow">
                                                            <h2 className="text-xl font-bold">Offer Details</h2>
                                                            <div className="space-y-2 mt-4">
                                                                <div>
                                                                    <div className="font-medium">University Name:</div>
                                                                    <div>{application_data.UNIVERSITY_NAME}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Program:</div>
                                                                    <div>{application_data.COURSE_NAME}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Intake:</div>
                                                                    <div>
                                                                        {application_data.INTAKE_MONTH} - {application_data.INTAKE_YEAR}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Program Length:</div>
                                                                    <div>{application_data.PROGRAM_LENGTH}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Cost Of Living:</div>
                                                                    <div>{application_data.COST_OF_LIVING}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Gross Tuition Fees:</div>
                                                                    <div>{application_data.GROSS_TUITION}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium">Application Fees:</div>
                                                                    <div>{application_data.APPLICATION_FEE}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab key="videos" title="Comment & Status Management">
                                            <div className="comments-container">
                                                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 overflow-auto">
                                                    {/* Comment Section */}
                                                    <div className="comment-section col-span-4 grid gap-2 border rounded-xl p-2 h-[70vh] md:h-[70vh] overflow-auto">
                                                        <div className="comment-list grid gap-4">
                                                            {/* Comment 1 */}
                                                            {CommentDataRecord.map((value: any, index) => (
                                                                <div className="comment flex items-start gap-4 border p-2 rounded-xl" key={index}>
                                                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                                                    <div className="comment-details grid gap-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="font-semibold">{value.RESPONSIVE_PERSON_NAME}</h4>
                                                                            <time className="text-xs text-muted-foreground">{value.COMMENT_DATE}</time>
                                                                        </div>
                                                                        <p className="text-muted-foreground">{value.COMMENT_TEXT}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {/* Feedback Section */}
                                                    <div className="col-span-2 border rounded-xl">
                                                        <section className="bg-card p-6 md:p-8 lg:p-10">
                                                            <div className="container mx-auto max-w-2xl">
                                                                <div className="space-y-4">
                                                                    <h2 className="text-2xl font-bold">Comment on Offer Letter</h2>
                                                                    <p className="text-muted-foreground">Please provide any comments on the offer letter.</p>
                                                                </div>
                                                                <form className="mt-6 space-y-4" onSubmit={handleComment} ref={formRef}>
                                                                    <input type="hidden" value={client_id} name="ClientID" />

                                                                    <div className="inline-block relative w-full ">
                                                                       <label htmlFor="status">
                                                                            Current Status <span className="text-danger">*</span>
                                                                        </label>    
                                                                        <select name='FileStatus'  id='status' className="block design_input  appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                                                            <option disabled >select current status</option>
                                                                            <option value={1}>New Application</option>
                                                                            <option value={2}>Pending Approval</option>
                                                                            <option value={3}>Approved</option>
                                                                            <option value={4}>Sent</option>
                                                                            <option value={5}>Accepted</option>
                                                                            <option value={6}>Declined</option>
                                                                            <option value={7}>Expired</option>
                                                                            <option value={8}>Withdrawn</option>
                                                                            <option value={9}>On Hold</option>
                                                                            <option value={10}>Rejected</option>
                                                                            <option value={11}>Revised</option>
                                                                        </select>
                                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-7 text-gray-700">
                                                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label htmlFor="comments">
                                                                            Comments <span className="text-danger">*</span>
                                                                        </label>
                                                                        <Textarea id="comments" placeholder="Enter your comments" className="min-h-[120px] rounded-2xl" name="CommentText" />
                                                                    </div>
                                                                    <Button type="submit" className="w-full rounded-full" color="primary" >
                                                                        Comment
                                                                    </Button>
                                                                </form>
                                                            </div>
                                                        </section>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
