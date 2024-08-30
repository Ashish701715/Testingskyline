import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import './style.css';
import DefaultLayout from "./Default";
import Form from "./Form";

export default function App() {
    const [isOpen, onOpen] = useState(true);
    function onOpenChange()
    {
      if(isOpen==true)
        {
            onOpen(false)
        }else{
            onOpen(true)
        }
    }
  const [show ,  setshow] = useState(false);
  setTimeout(() => {
    setshow(true);
  }, 300);

  return (
    <div className="">
      <Modal isOpen={isOpen}   onOpenChange={onOpenChange}  size='full' placement="center" className="modalclose Modal_view_Hide_check" isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {show ? <Form onOpenChange={onOpenChange} /> : <DefaultLayout />} 
        </ModalContent>
      </Modal>
    </div>
  );
}
