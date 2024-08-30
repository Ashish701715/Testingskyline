import {  useState , useRef, useCallback} from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider,
Button,
Input,
Select, SelectItem,
Avatar,
CheckboxGroup, Checkbox,
Textarea,
} from "@nextui-org/react";
import {users} from "./data";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
import { generateJWT } from './../Authentication/JWT';
import { DataInsert } from '../../APIurl/url';
import { PlayCircleOutlined , PauseCircleOutlined} from '@ant-design/icons';
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

import './style.css';

export default function App() {
    const [isloading , setloading] = useState(false);
    const assignedUserRef = useRef<HTMLSelectElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isvalue, setCheckedValues] = useState<string[]>([]);

    // Memoize the checkbox change handler
    const handleCheckboxChange = useCallback((value: string) => {
        setCheckedValues(prevValues => {
            if (prevValues.includes(value)) {
                return prevValues.filter(item => item !== value);
            } else {
                return [...prevValues, value];
            }
        });
    }, []);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    function TaskFormHandler(e: React.FormEvent<HTMLFormElement>) {
        setloading(true);
        e.preventDefault();
        const formData = {
            taskName: taskNameRef.current?.value,
            taskLabel: taskLabelRef.current?.value,
            taskPriority: taskPriorityRef.current?.value,
            assignedUser: assignedUserRef.current?.value,
            startDate: startDateRef.current?.value,
            endDate: endDateRef.current?.value,
            taskReminder: taskReminderRef.current?.value,
            deadline: deadlineRef.current?.value,
            description: descriptionRef.current?.value,
            file:selectedFile,
            Task_view:isvalue,
            PAGE_REQUEST:'InsertTask'
        };
        
      const payload = { useremail: 'ashishboostui@gmail.com'};
      const secretKey = 'JwtSecret';
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
  
      const token = generateJWT(payload, secretKey, expiresIn);
      token.then((JwtToken) => {
        const parametter = '?prequest=insertdata&form=task&refresh=false';            
        fetch(DataInsert + parametter, {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
            'Authenticate': `Bearer ${JwtToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
         setloading(false);
         if(data.status==true)
         {
            MySwal.fire({
                title: 'Task successfully created',
                toast: true,
                position:'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-success`,
                },
            });
         }else
         {
            MySwal.fire({
                title: data.message,
                toast: true,
                position:'top-end',
                showConfirmButton: false,
                timer: 3000,
                showCloseButton: true,
                customClass: {
                    popup: `color-danger`,
                },
            });
         }
        })
        .catch(error => {
           setloading(false);
          console.error('Error fetching user data:', error);
        });
      }).catch((err) => {
        setloading(false);
        console.log(err)
      });

    }

    const taskNameRef = useRef<HTMLInputElement>(null);
    const taskLabelRef = useRef<HTMLInputElement>(null);
    const taskPriorityRef = useRef<HTMLSelectElement>(null);
    const startDateRef = useRef<HTMLInputElement>(null);
    const endDateRef = useRef<HTMLInputElement>(null);
    const taskReminderRef = useRef<HTMLSelectElement>(null);
    const deadlineRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    return (
        <Card className="max-w-[100%]">
            <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                    <p className="text-xl font-bold ">CREATE TASK</p>
                </div>
            </CardHeader>
            <Divider/>
            {/* Submit this form help of form handler */}
            <form onSubmit={TaskFormHandler}>
                <CardBody>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Input type="text" isRequired ref={taskNameRef}  variant="bordered" label="TASK NAME" />
                        <Input type="text" isRequired ref={taskLabelRef} variant="bordered" label="TASK LABEL"  />
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Select 
                            label="Task Priority" 
                            variant="bordered"
                            ref={taskPriorityRef}
                            isRequired
                        >
                            
                            <SelectItem key="Low" value="Low">Low</SelectItem>
                            <SelectItem key="Medium" value="Medium">Medium</SelectItem>
                            <SelectItem key="High" value="High">High</SelectItem>
                            <SelectItem key="Urgent" value="Urgent">Urgent</SelectItem>
                            
                        </Select>
                        <Select
                            isRequired
                            label="Assigned User" 
                            items={users}
                            variant="bordered"
                            ref={assignedUserRef}
                            >
                            {(user) => (
                                <SelectItem key={user.id} textValue={user.name}>
                                <div className="flex gap-2 items-center">
                                    <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.avatar} />
                                    <div className="flex flex-col">
                                    <span className="text-small">{user.name}</span>
                                    <span className="text-tiny text-default-400">{user.email}</span>
                                    </div>
                                </div>
                                </SelectItem>
                            )}
                        </Select>
                    </div>


                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Input type="date"  ref={startDateRef} variant="bordered" label="START DATE" />
                        <Input type="date" isRequired  ref={endDateRef} variant="bordered" label="ENDING DATE" />
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Select 
                            label="Task reminder" 
                            variant="bordered"
                            ref={taskReminderRef }
                        >
                            
                            <SelectItem key="5min"    value="60*5">Before 5 min</SelectItem>
                            <SelectItem key="10min"   value="60*10"> Before 10 Min</SelectItem>
                            <SelectItem key="1day"   value="60*60*24">Before 1 day</SelectItem>
                            
                        </Select>
                        <Input type="date"  ref={deadlineRef } variant="bordered" label="Deadling" />
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <CheckboxGroup
                            
                            label="Is View"
                            className="text-black font-semibold mb-2"
                            orientation="horizontal"
                            color="secondary"
                            defaultValue={["buenos-aires", "san-francisco"]}
                            >
                            <Checkbox
                                checked={isvalue.includes('Calender')}
                                onChange={() => handleCheckboxChange('Calender')}
                                value="Calender"
                            >
                                Calender
                            </Checkbox>
                            <Checkbox
                                checked={isvalue.includes('Ganntchart')}
                                onChange={() => handleCheckboxChange('Ganntchart')}
                                value="Ganntchart"
                            >
                                Gannt Chart
                            </Checkbox>
                            <Checkbox
                                checked={isvalue.includes('planout')}
                                onChange={() => handleCheckboxChange('planout')}
                                value="planout"
                            >
                                Plan Out
                            </Checkbox>
                            <Checkbox
                                checked={isvalue.includes('task_calender')}
                                onChange={() => handleCheckboxChange('task_calender')}
                                value="task_calender"
                            >
                                Task Calender
                            </Checkbox>
                        </CheckboxGroup>
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Textarea
                            isRequired
                            label="Description"
                            className=""
                            variant="bordered"
                            ref={descriptionRef }
                        />
                    </div>

                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-2">
                        <Input type="file" name='file'  label=" " />
                    </div>

                
                </CardBody>
                <Divider/>
                <CardFooter>
                    
                <Button type="submit" radius="full" className="font-bold" disabled={isloading}>
                   {(isloading) ? 'process...':'SAVE TASK'}
                </Button>

                <Button type='button' radius="full" className="font-bold ml-2" color="danger">
                    CANCEL TASK
                </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
