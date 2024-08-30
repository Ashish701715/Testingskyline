import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

import Commenthistory from "./Application/Commenthistory";
import Applicationthistory from "./Application/Applicationhistory";
import Applicationttask from "./Application/Applicationtask";
import Addcommite from "./Application/Addcomment";
import Offerletter from './Application/Offerletter';

const ViewApplication = ({ isOpen, onClose, application }: any) => {
    return (
        <Modal isOpen={true} onClose={onClose} size="full" style={{ marginLeft: '40%' }}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Application Details</ModalHeader>
                <ModalBody>
                    <div className="grid gap-4">

                        <Tabs size={'lg'} aria-label="Tabs sizes">
                            <Tab key="Comment" title="Comment" >
                                <div className='grid gap-3'>
                                    <div className='flex justify-end '>
                                        <Addcommite FileID={application?.ID} />
                                    </div>
                                    <Commenthistory FileID={application?.ID} />
                                </div>

                            </Tab>
                            <Tab key="Application" title="Application History">
                                <Applicationthistory FileID={application?.ID} />
                            </Tab>
                            <Tab key="Task" title="Application Task">
                                <Applicationttask FileID={application?.ID} />
                            </Tab>
                            <Tab key="Offer Letter" title="Offer Letter" >
                                <Offerletter FileID={application?.ID} />
                            </Tab>
                        </Tabs>

                    </div>

                    {/* Render application details here */}
                    {/* <div>
                        <p><strong>Application ID:</strong> {application?.ID}</p>
                        <p><strong>Transfer Date:</strong> {application?.SENDING_DATE_TIME}</p>
                        <p><strong>Client Name:</strong> {application?.CLIENT_NAME}</p>
                        <p><strong>Country Name:</strong> {application?.COUNTRY_NAME}</p>
                        <p><strong>Status:</strong> {application?.CURRENT_STATUTS}</p>
                    </div> */}
                </ModalBody>

            </ModalContent>
        </Modal>
    );
};

export default ViewApplication;
