// Import React and other required modules
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import { GETDATA } from "../../../APIurl/url";
import { DELETE } from "../../../APIurl/url";
import { TASKAPI } from "../../../APIurl/url";
import { generateJWT } from "../../JWT";
import { useParams } from "react-router-dom";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem , Chip } from "@nextui-org/react";
import './style.css';
import {Modal, ModalContent,Tooltip, Avatar , ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {Socket} from '../../../server/server';
import { formatDistanceToNow, format } from 'date-fns';

// Define the interface for CommentItem
interface CommentItem {
  ID: number;
  FORM_ID: number;
  SERIAL_ID: number;
  ENCRYPT_ID: string;
  COMMENT_TEXT: string;
  IS_FILE: boolean;
  CRETAE_BY: string;
  CRETAE_AT: string;
  UPDATE_AT: string;
  IS_VIEW: boolean;
  IS_DELETE: boolean;
}

export default function App() {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (now.getTime() - date.getTime() > 5 * 60 * 60 * 1000) {
        return format(date, "MMM d, yyyy hh:mm:aa");
    } else {
        return formatDistanceToNow(date);
    }
}


  const[refresh , setrefresh] = useState(false);
  const { FormID, EncryptId, SerialId } = useParams();
  const [Comment, setComment] = useState<CommentItem[]>([]);
  const MySwal = withReactContent(Swal);
  const[proccess , setProccess] = useState(false);

  useEffect(() => {
    let url = `view=comment&edit=true$delete=true&auth=true`;
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);

    token.then((JwtToken) => {
      fetch(GETDATA + '?action=view-history&auth=true&view=true&edit=false', {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify({
          FormID: FormID,
          EncryptId: EncryptId,
          SerialId: SerialId,
          PAGE_REQUEST: 'GET_FORM_COMMENT_HISTORY'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        setComment(data.data)
      })
    }).catch((err) => {
      console.warn(err);
    })
  setrefresh(false)
  }, [refresh]);
  //Task Data Show History
  const [TaskData, setTaskData] = useState([]);
  useEffect(() => {
    let url = `view=comment&edit=true$delete=true&auth=true`;
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);

    token.then((JwtToken) => {
      fetch(TASKAPI + '?action=view-task&auth=true&view=true&edit=false', {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify({
          FormID: FormID,
          EncryptId: EncryptId,
          SerialId: SerialId,
          PAGE_REQUEST: 'GET_TASK_HISTROY_DATA'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        setTaskData(data.data)
      })
    }).catch((err) => {
      console.warn(err);
    })
  setrefresh(false)
  }, [refresh]); 



  //Histroy Data 
  const [LEAD_HISTORY ,  SETLEAD_HISTROY] = useState([]);
  useEffect(() => {
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);

    token.then((JwtToken) => {
      fetch(GETDATA + '?action=get-lead-history&auth=true&view=true&edit=false', {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify({
          SerialId: SerialId,
          PAGE_REQUEST: 'GET_LEAD_PAGE_HISTORY'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        SETLEAD_HISTROY(data.data)
      })
    }).catch((err) => {
      console.warn(err);
    })
  setrefresh(false)
  }, [refresh]); 


  //modal delete comment 
  const [isOpen, setIsOpen] = useState(false);
  const [deleteData, setdeleteData] = useState(false);
  const [serialData, setserialData] = useState(false);

  function DeleteComment(event:any)
  {
     const deleteData = event.target.getAttribute("data-delete");
     const serialData = event.target.getAttribute("data-serial");
     setdeleteData(deleteData);
     setserialData(serialData);
     setIsOpen(true);
  }
  const handleClose = () => {
    setIsOpen(false);
  };

  
function SuccessDeleteComment(event:any)
{
  setProccess(true)
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);
    token.then((tokenResponse) =>{
      fetch(DELETE+'?action=deleteComment&isdelete=true',{
        method: "DELETE",
        headers: {
          Authenticate: `Bearer ${tokenResponse}`,
        },
        body: JSON.stringify({
          IsDID: deleteData,
          IsSerId: serialData,
          PAGE_REQUEST: 'DELETE_FORM_COMMENT_HISTORY'
        })
      }).then((res)=>{
          return res.json();
        }).then((data)=>{
          setrefresh(true);
          setIsOpen(false);
          if(data.status==true)
            {
              setProccess(false)
              MySwal.fire({
                title: data.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                showCloseButton: true,
                customClass: {
                    popup: `color-default`,
                },
              });
            }else{
              setProccess(false)
              MySwal.fire({
                title: data.message,
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 2000,
                showCloseButton: true,
                customClass: {
                    popup: `color-danger`,
                },
              });
            }
        }).catch((err)=>{
          setProccess(false)
          console.log(err);
        })
    }).catch((errorResponse)=>{
      setProccess(false)
      console.log(errorResponse)
    })
}

//delet task record 
  const [TASK_DELETE_ID , setTASK_ID] = useState('');
  const [taskdeleteconfirm , setconfirm] = useState(false);
  function deleteTaskFunction(event: any) {
    setTASK_ID(event)
    setconfirm(true)
  };

  
  function SuccessDeleteTask()
  {
      
  }
  useEffect(() => {
    let url = `view=comment&edit=true$delete=true&auth=true`;
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);

    token.then((JwtToken) => {
      fetch(GETDATA + '?action=view-history&auth=true&view=true&edit=false', {
        method: "POST",
        headers: {
          Authenticate: `Bearer ${JwtToken}`,
        },
        body: JSON.stringify({
          FormID: FormID,
          EncryptId: EncryptId,
          SerialId: SerialId,
          PAGE_REQUEST: 'GET_FORM_COMMENT_HISTORY'
        })
      }).then((response) => {
        return response.json();
      }).then((data) => {
        setComment(data.data)
      })
    }).catch((err) => {
      console.warn(err);
    })
  setrefresh(false)
  }, [refresh]);

  return (
    <>
    <Timeline position="right" className="margin-none ">
      {/* Task DAta History */}

      {TaskData.map((value:any, index: number) => (
        <TimelineItem key={value.ID} className="margin-none-two ">
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
            </svg>



            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div key={value.TASK_ID}>
              <Card className="max-w-[100%] mt-2 border-radius-none bg-slate-100">
                <CardHeader className="flex gap-3" style={{ justifyContent: "space-between" }}>
                  <span className="font-semibold text-sm font-sans ">Task
                    {value.STATUS == 3 ? (
                        <Chip className="ml-5 text-white" style={{ background: '#f71c1c73', fontSize: '10px' }} size="sm">Pending</Chip>
                    ) : value.STATUS == 2 ? (
                        <Chip className="ml-5 text-black-400" style={{ background: '#ffd402', fontSize: '10px' }} size="sm">In-progress</Chip>
                    ) : value.STATUS == 1 ? (
                        <Chip className="ml-5 text-black-400" style={{ background: '#e2f1b3', fontSize: '10px' }} size="sm">FINISHED</Chip>
                    ) : (
                        <span className="ml-5 font-sans ">Not assigned</span>
                    )}
                  </span>
                  <Tooltip content={value.CREATED_BY_USER_NAME}>
                    <Link to={`/user/profile/${value.CREATED_BY_USER_ID}`}>
                      <Avatar showFallback src={value.CREATED_BY_USER_PROFILE_URL} size="sm" />
                    </Link>
                  </Tooltip>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex">
                    <div className="icon-head">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="currentColor" className="icon-width">
                        <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
                      </svg>

                    </div>
                    <table className="table-task">
                      <thead>
                        <tr>
                          <th className="font-sans " style={{width:'0'}}>Create At</th>
                          <td className="font-sans ">{formatDate(value.CREATE_AT)}</td>
                        </tr>
                        <tr>
                          <th className="font-sans " style={{width:'0'}}>Deadline</th>
                          <td className="font-sans ">{value.DEADLINE || 'Not specified'}</td>
                        </tr>
                        <tr>
                          <th className="font-sans ">Title</th>
                          <td className="w-[30ch] font-sans  truncate">{value.TITLE}</td>
                        </tr>
                        <tr>
                          <th className="font-sans ">Assignee</th>
                          <td>
                            <Link to={`/user/profile/${value.ASSIGNED_USER_ID}`}>
                              <Avatar showFallback src={value.ASSIGNED_USER_PROFILE_URL} size="sm" />
                            </Link>
                          </td>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </CardBody>
                <Divider title="modal" />
                <CardFooter className="footer-modal justify-between">
                  <div>
                    <NavLink to={`/page/company/task/View/`+ value.TASKTOKEN+'/'+value.TASKID} className="ml-2">
                      <Chip variant="bordered" >Open</Chip>
                    </NavLink>
                  </div>

                  <Dropdown>
                    <DropdownTrigger>
                      <NavLink to="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </NavLink>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem
                        key="delete"
                        className="text-danger cursor-not-allowed"
                        color="danger"
                        onClick={()=>{deleteTaskFunction(value.TASK_ID)}}
                        data-delete={value.TASK_ID}
                      >
                        delete item
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardFooter>

                <Modal backdrop="transparent" style={{ justifyContent: "end" }} isOpen={taskdeleteconfirm} onClose={()=>{setconfirm(false)}} key={value.ID}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                        <ModalBody>
                          <p>Are you sure you want to delete this task?</p>
                        </ModalBody>
                        <ModalFooter className="justify-center">
                          <Button color="default" variant="bordered" onPress={onClose}>
                            Close
                          </Button>
                          {proccess ? (
                            <Button color="danger" isLoading={true}>
                              process...
                            </Button>
                          ) : (
                            <Button color="danger" onClick={SuccessDeleteTask}>
                              Delete
                            </Button>
                          )}
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </Card>
              <Divider className="mt-2 mb-2 border-hr" />
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}

        <Divider className="w-[95%] m-5"/>
      {/* End task History Data */}

      {Comment.map((value: CommentItem, index: number) => (
        <TimelineItem key={value.ID} className="margin-none-two">
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color="primary">
            
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
              </svg>


            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div key={value.ID}>
              <Card className="max-w-[100%] mt-2 border-radius-none bg-slate-100">
                <CardHeader className="flex gap-3" style={{ justifyContent: "space-between" }}>
                  <span className="font-semibold text-sm font-sans">Comment:  
                  -  <span className="font-thin">{formatDate(value.CRETAE_AT)}</span>
                  </span>
                  <Tooltip>
                    <Link to="#">
                      <Avatar showFallback src="https://images.unsplash.com/broken" size="sm" />
                    </Link>
                  </Tooltip>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex">
                    <div className="icon-head">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="icon-width"
                      >
                        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                      </svg>
                    </div>
                    <p className="comment-text text-xs font-sans" dangerouslySetInnerHTML={{ __html: value.COMMENT_TEXT }}></p>
                  </div>
                </CardBody>
                <Divider title="modal" />
                <CardFooter className="footer-modal ">
                  <Dropdown>
                    <DropdownTrigger className="cursor-not-allowed">
                      <NavLink to="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </NavLink>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem key="new" className="cursor-not-allowed">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onClick={DeleteComment}
                        data-delete={value.ENCRYPT_ID}
                        data-serial={value.ID}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </CardFooter>

                <Modal backdrop="transparent" style={{ justifyContent: "end" }} isOpen={isOpen} onClose={handleClose} key={value.ID}>
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
                          {proccess ? (
                            <Button color="danger" isLoading={true}>
                              process...
                            </Button>
                          ) : (
                            <Button color="danger" onClick={SuccessDeleteComment} data-delete={value.ENCRYPT_ID} data-serial={value.ID}>
                              Delete
                            </Button>
                          )}
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </Card>
              <Divider className="mt-2 mb-2 border-hr" />
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}


    {/* lead history  */}

    {LEAD_HISTORY.map((value: any, index: number) => (
      (value.STATUS_BEFORE && value.STATUS_AFTER) ? (
        <TimelineItem key={value.ID} className="margin-none-two">
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot style={{ background: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" style={{ color: 'black' }}>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div key={value.ID}>
              <Card className="max-w-[100%] mt-2 border-radius-none bg-slate-100">
                <CardHeader className="flex gap-3" style={{ justifyContent: "space-between" }}>
                  <span className="font-medium text-zinc-400">Stage changed</span>
                  <Tooltip content={`${value.CREATE_USER_NAME} Stage changed from ${value.STATUS_BEFORE} to ${value.STATUS_AFTER}`}>
                    <Link to={`/user/profile/${value.CREATE_USER_ID}`}>
                      <Avatar showFallback src={value.CREATE_USER_PROFILE} size="sm" />
                    </Link>
                  </Tooltip>
                </CardHeader>
                <CardBody>
                  <div className="flex">
                      <Chip className="text-xs font-sans" style={{background:'#e4e9ed'}}>{value.STATUS_BEFORE}</Chip> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-6 ml-2 mr-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>
                      <Chip className="text-xs font-sans " style={{background:'#e4e9ed'}}>{value.STATUS_AFTER}</Chip> 
                  </div>
                </CardBody>
                <Divider title="modal" />
              </Card>
              <Divider className="mt-2 mb-2 border-hr" />
            </div>
          </TimelineContent>
        </TimelineItem>
      ) : null
    ))}


    </Timeline>

    </>
  );
}
