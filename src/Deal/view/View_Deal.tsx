import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Button from "@mui/material/Button";
import { generateJWT } from "../../pages/JWT";
import { NavLink } from "react-router-dom";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tabs from "@mui/material/Tabs"; 
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { UPDATE } from "../../APIurl/url";
import { GetUserAPI } from "../../APIurl/url";
import { useParams  } from "react-router-dom";
import '../css/style.css';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {User} from "@nextui-org/react";
import { Image } from 'primereact/image';
import "primereact/resources/themes/lara-light-cyan/theme.css";
//Tab Steup 
import CommentTab from "../Helper/Comment"; 
import Task  from "./../Helper/Task";
import Swal from 'sweetalert2'
//History
import Histroy from "../Helper/Deal_history"; 
import Table_Histroy from '../Helper/History_table';
import Mail from '../Helper/mail';
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function App() {
   const userId = localStorage.getItem("SID");
    const icon = (<i className="pi pi-search"></i>)
    const  {deal_id} = useParams();
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [hoveredClass, setHoveredClass] = useState('');
    const [currentclass, setCurrentclass] = useState('');
    const [currnectIndex , setCurrentIndex] = useState(-1)
    

    const handleHover = (index:any, className:any) => {
      setHoveredIndex(index);
      setHoveredClass(className);
  };

  
  const [STAGE_DATA, SETSTAGE_DATA] = useState([]);
  const [DEPARTMENT, SET_DEPARTMENT] = useState([]);
  const [DEAL_DATA , setDEAL_DATA] = useState([]);
  const [trigger, setTrigger] = useState(true);
  const [Current_stage , setCurrentStage] = useState('');
  const [Current_Category , setCurrentCategroy] = useState('');
  async function UpdateLeadStage(index:any , currect_stage:any)
  {
      setHoveredClass(currect_stage.CLASS);
      setCurrentclass(currect_stage.CLASS);
      setCurrentIndex(index);

      try {
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = await generateJWT(payload, secretKey, expiresIn);
        const response = await fetch(GetUserAPI + `?view=karban.deal.view&is_view=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authenticate: `Bearer ${token}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: "karban.data.deal.stage.update",
                Newstage: currect_stage.ID,
                Deal_Id:deal_id,
                CategroyID:1,
                USER_ID:userId
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
       const data = await response.json();
       if(data.status==true)
          {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title:data.message
            });
            window.location.reload();
          }else{
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "error",
              title:data.message
            });
          }
    } catch (error) {
        console.error(error);
        throw error;
    }
  }


  async function UserStage() {
      try {
          const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
          const secretKey = "JwtSecret";
          const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
          const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
          const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
          const token = await generateJWT(payload, secretKey, expiresIn);
          
          const response = await fetch(GetUserAPI + `?view=karban.deal.view&is_view=true`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Authenticate: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  PAGE_REQUEST: "karban.data.deal.stage",
                  DEAL_ID: deal_id
              }),
          });
  
          if (!response.ok) {
              throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          SETSTAGE_DATA(data.STAGES)
          SET_DEPARTMENT(data.CATEGORY)
          setDEAL_DATA(data.data)
      } catch (error) {
          console.error(error);
          throw error;
      }
  }
  useEffect(() => {
      if (trigger) {
          UserStage();
      }
  }, [trigger]);


  const { onOpenChange } = useDisclosure();
  const [isOpen, setisOpen] = useState(true);
  function CloseModal() {
    setisOpen(false);
    window.history.back();
  }
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const [values, setValues] = React.useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues(newValue);
  };

  async function DealCategroyhandle(event:any)
  {
    try {
      const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
      const secretKey = "JwtSecret";
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
      const token = await generateJWT(payload, secretKey, expiresIn);
      
      const response = await fetch(GetUserAPI + `?view=karban.deal.view&is_view=true`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authenticate: `Bearer ${token}`,
          },
          body: JSON.stringify({
              PAGE_REQUEST: "karban.data.deal.categroy.update",
              DEAL_ID: deal_id,
              Categroy_id:event.target.value,
              USerID:userId
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if(data.status==true)
        {
          window.location.reload();
        }else[
          alert(data.status)
        ]
    } catch (error) {
        console.error(error);
        throw error;
    }
  }


  // useEffect(() => {
  //   STAGE_DATA
  //   setCurrentIndex(5);
  //   setCurrentclass('stage-list-danger')
  // },[]);

  // Current stage
  // console.log(DEAL_DATA[0]['DEAL_STAGE'])

  // Current Categroy stage
  // console.log(DEAL_DATA[0]['DEAL_CATEGORY'])
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="full"
        isDismissable={true}
        style={{ marginLeft: "10%" }}
        className="light-background-white-10"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ul className="flex justify-between">
                <li className="flex">
                  <ModalHeader className="flex font-thin">
                    VIEW DEAL
                  </ModalHeader>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className="h-[50px] mt-2"
                    onChange={DealCategroyhandle}
                  >
                    {DEPARTMENT.map((value:any, index:any) => (
                      <MenuItem key={value.ID} value={value.ID} selected>
                        {value.CATEGORY_NAME}
                      </MenuItem>
                    ))}

                  </Select>

                </li>
                <li
                  className="justify-end"
                  style={{ margin: "8px 173px 11px 51px" }}
                >
                  <Button variant="outlined" disabled>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </Button>

                  {/* SMS */}

                  <Button variant="outlined" style={{ marginLeft: "10px" }} disabled>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                  </Button>

                  <NavLink
                    style={{ marginLeft: "10px", marginRight: "20px" }}
                    to="#"
                  >
                    <Badge badgeContent={1} color="error" className="cursor-not-allowed"> 
                      <NotificationsIcon color="primary" />
                    </Badge>
                  </NavLink>

                  
                </li>
              </ul>
                {/*  Deal Stage List  */}
                <>
                  <div className="statusbar">
                      <div className="status-list">
                          <ul className="nav flex m-3">
                              {STAGE_DATA.map((value:any, index) => {
                                 if(value.ID===DEAL_DATA[0]['DEAL_STAGE'])
                                  {
                                    setCurrentIndex(index);
                                    setCurrentclass(value.CLASS);
                                  }else{}
                                 return(
                                    <li className="nav-item" key={index}>
                                        <a 
                                            className={`font-sans font-medium hover:text-white nav-link stage-list  ${currnectIndex >= index ? currentclass : ''} ${hoveredIndex >= index ? hoveredClass : 'stage-list-default'} `}
                                            aria-current="page"
                                            href="#"
                                            onMouseEnter={() => handleHover(index, value.CLASS)}
                                            onMouseLeave={() => { setHoveredIndex(-1); setHoveredClass(''); }}
                                            onClick={()=>{UpdateLeadStage(index , value)}}
                                        >
                                            {value.STAGE_NAME}
                                        </a>
                                    </li>
                                 );
                              })}
                          </ul>
                      </div>
                  </div>
                </>
                {/* End Deal Stage List */}
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab
                  className="font-bold-inside-button"
                  label="General"
                  {...a11yProps(0)}
                />
                <Tab
                  className="font-bold-inside-button"
                  label="Product"
                  disabled
                  {...a11yProps(1)}
                />
                <Tab
                  className="font-bold-inside-button"
                  label="Dependencies"
                  disabled
                  {...a11yProps(1)}
                />
                <Tab
                  className="font-bold-inside-button"
                  label="History"
                  {...a11yProps(1)}
                />
              </Tabs>

              <ModalBody style={{ overflow: "auto" }}>
                {value === 0 && (
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={5}>
                      <Card className="border-radius-none">
                        <CardBody className="m-2">
                          <ul className="mb-2 ml-0 flex justify-between">
                            <li className="uppercase font-normal text-xs mt-5">
                              Deal Infomation
                            </li>
                            <li>
                              <NavLink to="#" title="Edit Deal Data">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-5 mt-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                              </NavLink>
                            </li>
                          </ul>

                          <Divider className="mb-2"/>
                          {(DEAL_DATA.length > 0) ? (
                            <ul className="Deal_infomation">

                            <li>
                              <span  className="Heading-Tag font-sans">Name</span>
                            </li>
                            <li>
                              <span  className="Heading-Tag-ans font-sans">{DEAL_DATA['0']['CLIENTNAME']}</span>
                            </li>

                            <li>
                              <span  className="Heading-Tag font-sans">Source</span>
                            </li>
                            <li>
                              <span  className="Heading-Tag-ans font-sans">{DEAL_DATA['0']['DEALSOURCE']}</span>
                            </li>

                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans">Start Date</span>
                            </li>
                            <li>
                               <span  className="Heading-Tag-ans font-sans">{DEAL_DATA[0]['STARTINGDATE']}</span>
                            </li>

                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans">Available to everyone</span>
                            </li>
                            <li>
                              <span  className="Heading-Tag-ans font-sans">{(DEAL_DATA[0]['SEE_EVERYONE']==1) ? 'Yes': 'No'}</span>
                            </li>

                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans">Start Date</span>
                            </li>
                            <li>
                              <span  className="Heading-Tag-ans font-sans">{DEAL_DATA[0]['STARTINGDATE']}</span>
                            </li>

                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans mb-2">Responsible</span>
                            </li>
                            <li>
                              <div  className="Heading-Tag-ans font-sans user-box">
                                <User   
                                  name={DEAL_DATA[0]['CREATE_USER_NAME']}
                                  className=""
                                  description={DEAL_DATA[0]['ASSIGNED_USER_EMAIL']}
                                  avatarProps={{
                                    src: DEAL_DATA[0]['ASSIGNED_USER_PROFILE']
                                  }}
                                />

                              </div>
                            </li>


                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans">Photo</span>
                            </li>
                            <li>
                             
                            <div className="card flex justify-content-center">
                              {(DEAL_DATA[0]['PHOTOPATH']==null) ? (
                               <p className="font-thin-style">
                                 field is empty 
                               </p>
                              ):(
                                <Image src={DEAL_DATA[0]['PHOTOPATH']}  indicatorIcon={icon} alt="Image" preview className="w-[100%]" loading="lazy" />
                              )}
                            </div>

                            </li>

                            <li className="mt-2">
                              <span  className="Heading-Tag font-sans">New File</span>
                            </li>
                            <li>
                             
                            <div className="card flex justify-content-center">
                              {(DEAL_DATA[0]['NEWFILEPATH']==null) ? (
                               <p className="font-thin-style">
                                 field is empty 
                               </p>
                              ):(
                                <Image src={DEAL_DATA[0]['NEWFILEPATH']}  indicatorIcon={icon} alt="Image" preview className="w-[100%]" loading="lazy" />
                              )}
                            </div>

                            </li>

                          </ul>
                          ):(
                            null
                          )}
                        </CardBody>
                      </Card>
                    </Grid>
                    <Grid item xs={7}>
                      <Card className="border-radius-none">
                        <CardBody className="m-2">
                          <Tabs
                            value={values}
                            onChange={handleTabChange}
                            aria-label="basic tabs example"
                          >
                            {/* <Tab className="font-bold-inside-button " label="Activity" {...a11yProps(0)} style={{fontWeight:'bold' , fontSize:'11px'}}/> */}
                            <Tab
                              className="font-bold-inside-button"
                              label="Comment"
                              {...a11yProps(0)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                            <Tab
                              className="font-bold-inside-button"
                              label="Task"
                              {...a11yProps(1)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                            <Tab
                              className="font-bold-inside-button"
                              label="SMS"
                              {...a11yProps(2)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                            <Tab
                              className="font-bold-inside-button"
                              label="Call"
                              {...a11yProps(3)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                            <Tab
                              className="font-bold-inside-button"
                              label="E-Mail"
                              {...a11yProps(4)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                            <Tab
                              className="font-bold-inside-button"
                              label="Zoom"
                              {...a11yProps(5)}
                              style={{ fontWeight: "bold", fontSize: "11px" }}
                            />
                          </Tabs>
                          <Divider className="mb-4 " />
                          <div className="div">
                            {values === 0 && 
                            <>
                                <CommentTab />
                            </>
                             }
                            {values === 1 && 
                            <>
                              <Task />
                            </>
                            }
                            {values === 4 && 
                              <>
                                <Mail />
                              </>
                              }
                          </div>
                        </CardBody>
                      </Card>
                      {/* Page History section  */}
                      <Divider
                        className="mt-5 mb-5"
                        style={{ margin: "20px", width: "97%" }}
                      />

                      <Histroy />
                     
                      {/* eng page history section  */}
                    </Grid>
                  </Grid>
                )}
                {value === 1 && null}
                {value === 2 && (
                 null
                )}
                {value === 3 &&  <Table_Histroy /> }
              </ModalBody>
              <ModalFooter>
                <Button onClick={CloseModal} color="error">Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
