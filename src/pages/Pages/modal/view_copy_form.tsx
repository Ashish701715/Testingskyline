import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import Button from '@mui/material/Button';
import { NavLink } from "react-router-dom";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import {Card, CardBody , Divider} from "@nextui-org/react";
import './style.css';
import Textarea from "../Helper/textarea";
import Comment from "../Helper/comment";
import Histroy from "../History/Copy_PageHistory";
import Stage_data from './../Helper/stage';
import LeadHistoyTable from '../History/Lead_history';
import Mail from '..//../../Deal/Helper/mail';
//Task Modal  
import Task from "../Offcanva/Task"; 
function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
export default function App() {
  
  const { onOpenChange} = useDisclosure();
  const [isOpen , setisOpen] = useState(true);
  function CloseModal()
  {
    setisOpen(false)
    window.history.back();
   }
   const svgArray = Array.from({ length: 5 });

   const [value, setValue] = React.useState(0);

   const handleChange = (event: React.SyntheticEvent, newValue: number) => {
     setValue(newValue);
   };
   const [values, setValues] = React.useState(0);
   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues(newValue);
  };
  const [tabValue, setTabValue] = useState(0);
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="full" isDismissable={true} style={{marginLeft:'10%'}} className="light-background-white-10" >
        <ModalContent>
          {(onClose) => (
            <>
              <ul className="flex justify-between">
                <li>
                    <ModalHeader className="flex font-thin"> LEAD VIEW MODAL
                        <NavLink to="#" className='ml-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                            </svg>
                        </NavLink>
                    </ModalHeader>
                </li>
                <li className="justify-end" style={{margin:'8px 173px 11px 51px'}} >
                    <Button variant="outlined" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                    </Button>

                    {/* SMS */}

                    <Button variant="outlined" style={{marginLeft:'10px'}} disabled className="cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-6 cursor-not-allowed">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </Button>

                    <NavLink  style={{marginLeft:'10px',marginRight:'20px'}} to="#" >
                        <Badge badgeContent={1} color="error" className="cursor-not-allowed">
                            <NotificationsIcon color="primary"/>
                        </Badge>
                    </NavLink>

                    <Button style={{background:'#3bc8f5', color:'white' , fontWeight:'600' , fontSize:'13px'}} disabled className="cursor-not-allowed">
                      Completed
                    </Button>
                </li>
              </ul>
              
               {/* Stage data get  */}
                 
                 <Stage_data />

               {/* Tabs */}

                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab className="font-bold-inside-button"  label="Ganeral" {...a11yProps(0)} />
                    <Tab className="font-bold-inside-button" disabled label="Product" {...a11yProps(1)} />
                    <Tab className="font-bold-inside-button" disabled label="Dependencies" {...a11yProps(1)} />
                    <Tab className="font-bold-inside-button" label="History" {...a11yProps(1)} />
                </Tabs>

              <ModalBody style={{overflow:'auto'}}>
                

              {value === 0 && (
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={5}>
                        <Card className="border-radius-none">
                            <CardBody className="m-2">
                                <ul className="mb-2 ml-0">
                                    <li className="uppercase font-normal text-xs mt-5">
                                        Lead Infomation
                                    </li>
                                </ul> 
                                <Divider/>
                            </CardBody> 
                        </Card>
                    </Grid>
                    <Grid item xs={7}>
                        <Card className="border-radius-none">
                            <CardBody className="m-2">
                                    <Tabs value={values} onChange={handleTabChange} aria-label="basic tabs example">
                                        {/* <Tab className="font-bold-inside-button " label="Activity" {...a11yProps(0)} style={{fontWeight:'bold' , fontSize:'11px'}}/> */}
                                        <Tab className="font-bold-inside-button" label="Comment" {...a11yProps(0)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                        <Tab className="font-bold-inside-button" label="Task" {...a11yProps(1)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                        <Tab className="font-bold-inside-button" label="SMS" {...a11yProps(2)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                        <Tab className="font-bold-inside-button" label="Call" {...a11yProps(3)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                        <Tab className="font-bold-inside-button" label="E-Mail" {...a11yProps(4)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                        <Tab className="font-bold-inside-button" label="Zoom" {...a11yProps(5)} style={{fontWeight:'bold' , fontSize:'11px'}}/>
                                    </Tabs>
                                <Divider className="mb-4 "/>
                                <div className="div">
                                  {values === 0 && (
                                      <Comment />
                                  )}
                                  {values === 1 && (
                                      <Task />
                                  )}
                                  {values === 4 && (
                                      <Mail />
                                  )}

                                </div>
                            </CardBody>
                        </Card>
                        {/* Page History section  */}
                        <Divider className="mt-5 mb-5" style={{margin: '20px' , width: '97%'}}/>
                        
                        <Histroy />

                        {/* eng page history section  */}
                    </Grid>
                  </Grid>
                )}
                {value === 1 && (
                    <>
                    
                    </> 
                )}
                {value === 2 && (
                    <div>
                        {/* Components for Dependencies tab */}
                    </div>
                )}
                {value === 3 && (
                    <LeadHistoyTable />  
                )}

              </ModalBody>
              <ModalFooter>
                <Button onClick={CloseModal} className="bg-danger-color">
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
