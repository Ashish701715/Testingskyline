import React, { useState ,FormEvent } from 'react';
import { Col, DatePicker, Drawer, Form, Row,  Space } from 'antd';
import {Tabs, Tab, Input ,Card, CardBody , Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure ,Select, SelectItem , Avatar, SelectedItems} from "@nextui-org/react";
import {PlusIcon} from "./PlusIcon";

const Branchs = [
    {label: "USA", value: "USA"},
    {label: "Canada", value: "Canada"},
    {label: "Ausatralia", value: "Ausatralia"},
    {label: "US", value: "US"},
  ];
  const Prioritys = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
    { label: "Urgent", value: "Urgent" },
    { label: "Critical", value: "Critical" }
  ];
  
  const Sources = [
    { label: "Referral", value: "Referral" },
    { label: "Website", value: "Website" },
    { label: "Social Media", value: "Social Media" },
    { label: "Advertisement", value: "Advertisement" },
    { label: "Event", value: "Event" },
    { label: "Form", value: "Form" },
    { label: "Google", value: "Google" },
  ];
  

  type User = {
    id: number;
    name: string;
    role: string;
    team: string;
    status: string;
    age: string;
    avatar: string;
    email: string;
  };

  const users = [
    {
      id: 1,
      name: "Tony Reichert",
      role: "CEO",
      team: "Management",
      status: "active",
      age: "29",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/1.png",
      email: "tony.reichert@example.com",
    },
    {
      id: 2,
      name: "Zoey Lang",
      role: "Tech Lead",
      team: "Development",
      status: "paused",
      age: "25",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/1.png",
      email: "zoey.lang@example.com",
    },
    {
      id: 3,
      name: "Jane Fisher",
      role: "Sr. Dev",
      team: "Development",
      status: "active",
      age: "22",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/2.png",
      email: "jane.fisher@example.com",
    },
    {
      id: 4,
      name: "William Howard",
      role: "C.M.",
      team: "Marketing",
      status: "vacation",
      age: "28",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/2.png",
      email: "william.howard@example.com",
    },
    {
      id: 5,
      name: "Kristen Copper",
      role: "S. Manager",
      team: "Sales",
      status: "active",
      age: "24",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/3.png",
      email: "kristen.cooper@example.com",
    },
    {
      id: 6,
      name: "Brian Kim",
      role: "P. Manager",
      team: "Management",
      age: "29",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/3.png",
      email: "brian.kim@example.com",
      status: "Active",
    },
    {
      id: 7,
      name: "Michael Hunt",
      role: "Designer",
      team: "Design",
      status: "paused",
      age: "27",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/4.png",
      email: "michael.hunt@example.com",
    },
    {
      id: 8,
      name: "Samantha Brooks",
      role: "HR Manager",
      team: "HR",
      status: "active",
      age: "31",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/4.png",
      email: "samantha.brooks@example.com",
    },
    {
      id: 9,
      name: "Frank Harrison",
      role: "F. Manager",
      team: "Finance",
      status: "vacation",
      age: "33",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/5.png",
      email: "frank.harrison@example.com",
    },
    {
      id: 10,
      name: "Emma Adams",
      role: "Ops Manager",
      team: "Operations",
      status: "active",
      age: "35",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/5.png",
      email: "emma.adams@example.com",
    },
    {
      id: 11,
      name: "Brandon Stevens",
      role: "Jr. Dev",
      team: "Development",
      status: "active",
      age: "22",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/7.png",
      email: "brandon.stevens@example.com",
    },
    {
      id: 12,
      name: "Megan Richards",
      role: "P. Manager",
      team: "Product",
      status: "paused",
      age: "28",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/7.png",
      email: "megan.richards@example.com",
    },
    {
      id: 13,
      name: "Oliver Scott",
      role: "S. Manager",
      team: "Security",
      status: "active",
      age: "37",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/8.png",
      email: "oliver.scott@example.com",
    },
    {
      id: 14,
      name: "Grace Allen",
      role: "M. Specialist",
      team: "Marketing",
      status: "active",
      age: "30",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/8.png",
      email: "grace.allen@example.com",
    },
    {
      id: 15,
      name: "Noah Carter",
      role: "IT Specialist",
      team: "I. Technology",
      status: "paused",
      age: "31",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/9.png",
      email: "noah.carter@example.com",
    },
    {
      id: 16,
      name: "Ava Perez",
      role: "Manager",
      team: "Sales",
      status: "active",
      age: "29",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/9.png",
      email: "ava.perez@example.com",
    },
    {
      id: 17,
      name: "Liam Johnson",
      role: "Data Analyst",
      team: "Analysis",
      status: "active",
      age: "28",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/11.png",
      email: "liam.johnson@example.com",
    },
    {
      id: 18,
      name: "Sophia Taylor",
      role: "QA Analyst",
      team: "Testing",
      status: "active",
      age: "27",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/11.png",
      email: "sophia.taylor@example.com",
    },
    {
      id: 19,
      name: "Lucas Harris",
      role: "Administrator",
      team: "Information Technology",
      status: "paused",
      age: "32",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/male/12.png",
      email: "lucas.harris@example.com",
    },
    {
      id: 20,
      name: "Mia Robinson",
      role: "Coordinator",
      team: "Operations",
      status: "active",
      age: "26",
      avatar: "https://d2u8k2ocievbld.cloudfront.net/memojis/female/12.png",
      email: "mia.robinson@example.com",
    },
  ];
  const stage = [
    {label: "New Client", value: "New Client"},
    {label: "Pending Document", value: "Pending Document"},
    {label: "Calling", value: "Calling"},
    {label: "Visiting", value: "Visiting"},
  ]
function SubmitVisaLead()
{

}
const VisaLeadForm = () => {
  return (
  
    <form onSubmit={ SubmitVisaLead } data-submit="VisaLeadSave">
        <div className="w-full flex flex-col gap-4">
          <div key='sm' className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 text-black">
              <Input size='sm'  variant="bordered" type="text" label="Client First Name" isRequired/>
              <Input size='sm' type="text"   variant="bordered" label="last Name"  />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
        <div key='sm' className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input size='sm' type="number"  variant="bordered" label="Contact Number" isRequired/>
            <Input size='sm' type="email"   variant="bordered" label="Client Email"  isRequired/>
        </div>
        </div>

        <div className="w-full flex flex-col gap-4 mt-2">
        <div key='sm' className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input size='sm' type="email"   variant="bordered" label="Client Name" />
            <Input size='sm' type="email"   variant="bordered" label="Client Email"  />
        </div>
        </div>

        <div key='sm' className="flex w-full mt-3 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Select 
            label="prefrred Country" 
            className="" 
            variant="bordered"
            size='sm'
        >
            {Branchs.map((Branch) => (
            <SelectItem key={Branch.value} value={Branch.value}>
                {Branch.label}
            </SelectItem>
            ))}
        </Select>
        <Select
            size='sm'
            variant="bordered"
            label="Second prefrred Country"
            className=""
        >
            {Branchs.map((Branch) => (
            <SelectItem key={Branch.value} value={Branch.value}>
                {Branch.label}
            </SelectItem>
            ))}
        </Select>
        </div>

        <div key='sm' className="flex w-full mt-3 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Select 
            label="Client Priority " 
            className="" 
            variant="bordered"
            size='sm'
            isRequired
        >
            {Prioritys.map((Priority) => (
            <SelectItem key={Priority.value} value={Priority.value}>
                {Priority.label}
            </SelectItem>
            ))}
        </Select>
        <Select
            size='sm'
            variant="bordered"
            label="Visa Type"
            className=""
        >
            {Branchs.map((Branch) => (
            <SelectItem key={Branch.value} value={Branch.value}>
                {Branch.label}
            </SelectItem>
            ))}
        </Select>
        </div>

        <div key='sm' className="flex w-full mt-3 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Select 
            isRequired
            label="Select Branch" 
            className="" 
            variant="bordered"
            size='sm'
        >
            {Branchs.map((Branch) => (
            <SelectItem key={Branch.value} value={Branch.value}>
                {Branch.label}
            </SelectItem>
            ))}
        </Select>
        
        

        <Select 
            isRequired
            label="Lead Manager " 
            className="" 
            variant="bordered"
            size='sm'
        >
            {users.map((user) => (
            <SelectItem key={user.name} value={user.name}>
                {user.name}
            </SelectItem>
            ))}
        </Select>
        </div>

        <div key='sm' className="flex w-full mt-3 flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
        <Select 
            isRequired
            label="Lead Source" 
            className="" 
            variant="bordered"
            size='sm'
        >
            {Sources.map((Source) => (
            <SelectItem key={Source.value} value={Source.value}>
                {Source.label}
            </SelectItem>
            ))}
        </Select>
        
        

        <Select 
            isRequired
            label="Current Stage" 
            className="" 
            variant="bordered"
            size='sm'
        >
            {stage.map((stages) => (
            <SelectItem key={stages.label} value={stages.value}>
                {stages.label}
            </SelectItem>
            ))}
        </Select>
        </div>
</form>

  );
}

export default VisaLeadForm;


