import React from "react";

import { NavLink, useLocation } from 'react-router-dom';
import {Card, CardHeader, CardBody, CardFooter, Image, Button ,Tabs, Tab ,ScrollShadow,
Divider, Link,Avatar, AvatarGroup ,Tooltip ,Chip,
Skeleton,Input
} from "@nextui-org/react";
import './style.css';
import { Select, Space } from 'antd';
import type { SelectProps } from 'antd';
import SaveTask from './TaskData';
export default function App() {

    const options: SelectProps['options'] = [];

    for (let i = 10; i < 36; i++) {
    options.push({
        label: i.toString(36) + i,
        value: i.toString(36) + i,
    });
    }

    const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
    };

  return (
    <>
        <Card className="mb-2">
            <CardBody className="flex justify-between">
                <div className="flex items-center space-x-4">
                    <h2 className="font-black text-xl heading">TASK</h2>
                    <Select
                        className="h-[55px] roundedborder "
                        mode="multiple"
                        allowClear
                        style={{ width: '30%' }}
                        placeholder="Select User"
                        options={options}
                        onChange={handleChange}
                    />
                    <Input type="email" label="Search Task..." variant="bordered" />
                    <Button color="primary" className="font-semibold text-sm" size="lg">
                      Create Task
                    </Button>
                </div>
        </CardBody>
        </Card>
        <div className="grid grid-cols-12 gap-2">
            <Card className="col-span-4 sm:col-span-4 h-[685px]">
                <CardHeader className="absolute z-10 top-1 flex-col !items-start bg-white">
                    <Tabs key='lg' radius='lg' aria-label="Tabs radius">
                        <Tab key="All" title="All"/>
                        <Tab key="Pending" title="Pending"/>
                        <Tab key="Overdue" title="Overdue"/>
                        <Tab key="Complete" title="Complete"/>
                    </Tabs>
                </CardHeader>
                <ScrollShadow className="mt-20">
                    {Array.from({ length: 100 }, (_, i) => (
                        <Card key={i} className="m-2 cardhover">
                            <CardHeader className="flex gap-3">
                            <NavLink to="task/view/7">
                                <p className="font-bold w-80 truncate">Make beautiful websites regardless of your design experience.</p>
                            </NavLink>
                            </CardHeader>
                            <CardBody>
                            <div className="flex items-center">
                                <div className="ml-2">
                                    <AvatarGroup isBordered isDisabled>
                                        <Tooltip content="I am a tooltip">
                                            <Avatar src='https://images.unsplash.com/broken' size="sm" />
                                        </Tooltip>
                                        <Tooltip content="I am a tooltip">
                                            <Avatar src='https://images.unsplash.com/broken' size="sm" />
                                        </Tooltip>
                                    </AvatarGroup>
                                </div>
                                <div className="ml-auto">
                                    <Chip size="sm" color="danger" variant="flat" className="text-danger-500 font-black">Due On 03-Jun-2024</Chip>
                                </div>
                            </div>
                            
                            <p className="textchange m-2 font-thin" >Created By <NavLink to="/user/1" className='text-indigo-400'> Demo User(You)  </NavLink> at 02 Apr 2024 12:13</p>

                            </CardBody>
                        </Card>
                    ))}
                </ScrollShadow>


            </Card>
            
            <Card className="w-full h-[685px] col-span-8 sm:col-span-8">
                <CardHeader className="absolute z-10 top-1 flex-col items-start bg-white">
                    <div className="w-full flex gap-3">
                        <div>
                            <Skeleton className="flex rounded-full w-12 h-12"/>
                        </div>  
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton className="h-3 w-3/5 rounded-lg"/>
                            <Skeleton className="h-3 w-4/5 rounded-lg"/>
                        </div>
                    </div>
                </CardHeader><br></br>
                <Divider className="border"/>
                <CardBody className="mt-20">
                    <Skeleton className="rounded-lg">
                        <div className="h-24 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <div className="space-y-3 mt-2">
                        <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                        </Skeleton>
                        <Skeleton className="w-2/5 rounded-lg">  
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                        </Skeleton>
                    </div>
                </CardBody>
                <CardFooter className="absolute  bottom-0 z-10 border-t-1 border-default-150 dark:border-default-100">
                    
                    <Skeleton className="w-[100%] h-[50px] rounded-lg mr-2">  
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-[20%] h-[50px] rounded-lg mr-2">  
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                    <Skeleton className="w-[20%] h-[50px] rounded-lg">  
                        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </CardFooter>
            </Card>
        </div>
    </>

  );
}
