import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

function YourComponent() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Open the modal by default when the component mounts
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    console.log("Delete button clicked");
    handleClose(); // Close the modal after deletion
  };

  return (
    <div className="flex flex-col gap-2 end-modal">
      <Modal backdrop="blur" style={{ justifyContent: 'end' }} isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this comment?</p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button color="default" variant="bordered" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onPress={handleDelete}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default YourComponent;
