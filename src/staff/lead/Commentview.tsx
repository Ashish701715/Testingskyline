import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

const Commentview = ({ isOpen, onClose, Comment, }: any) => {


    return (
        <>
            <Modal

                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior={'inside'}

            >
                <ModalContent>

                    <>
                        <ModalHeader className="flex flex-col gap-1">Comment View mode</ModalHeader>
                        <ModalBody>
                            <div dangerouslySetInnerHTML={{ __html: Comment }} />


                        </ModalBody>
                        <ModalFooter>
                            <Button className="btn-primary" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>

                </ModalContent>
            </Modal>
        </>
    );
};
export default Commentview;