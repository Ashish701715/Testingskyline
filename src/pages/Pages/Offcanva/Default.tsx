import { Skeleton } from "@nextui-org/react";
import "./style.css";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
export default function App() {
  const [isOpen, onOpen] = useState(true);
  function onOpenChange() {
    if (isOpen == true) {
      onOpen(false);
    } else {
      onOpen(true);
    }
  }
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        <Skeleton className="h-[30px] w-[10%] rounded-lg" />{" "}
      </ModalHeader>
      <ModalBody>
        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div>
            <Skeleton className="rounded-full w-12 h-12" />
          </div>
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-10 w-3/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
          </div>

          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-10 w-3/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
            <Skeleton className="h-10 w-4/5 rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[20px] w-[50%] rounded-lg" />
            <Skeleton className="h-[20px] w-[50%] rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[450px] w-[30%] rounded-lg" />
            <Skeleton className="h-[450px] w-[70%] rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[50px] w-[20%] rounded-lg" />
            <Skeleton className="h-[50px] w-[80%] rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[50px] w-[40%] rounded-lg" />
            <Skeleton className="h-[50px] w-[60%] rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[20px] w-[90%] rounded-lg" />
            <Skeleton className="h-[20px] w-[50%] rounded-lg" />
          </div>
        </div>

        <div className="max-w-[100%] w-full flex items-center gap-3">
          <div className="w-full flex-d flex-col gap-2 ">
            <Skeleton className="h-[20px] w-[10%] rounded-lg" />
            <Skeleton className="h-[20px] w-[90%] rounded-lg" />
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Skeleton className="h-[50px] w-[8%] rounded-lg" />
        <Skeleton className="h-[50px] w-[8%] rounded-lg" />
      </ModalFooter>
    </>
  );
}
