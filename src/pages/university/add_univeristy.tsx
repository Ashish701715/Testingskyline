import React, { useState } from "react";
import { ScrollShadow, Input, Divider ,Checkbox ,Card, CardBody } from "@nextui-org/react";
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import "./style.css";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { IconButton, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
// Collapse components
import Country from "./Collapse/country";
import University from "./Collapse/university";
import Courselabel from "./Collapse/course_lable";
import Courseintake from "./Collapse/course_intake";
import Coursefees from "./Collapse/course_fees";


import Addmodal from "./univeristy_add_modal";
export default function App() {
  // Collapse states
  const [countryCollapsed, setCountryCollapsed] = useState(false);
  const [universityCollapsed, setUniversityCollapsed] = useState(false);
  const [courselabelCollapsed, setCourselabelCollapsed] = useState(false);
  const [courseintakeCollapsed, setCourseintakeCollapsed] = useState(false);
  const [coursefeesCollapsed, setCoursefeesCollapsed] = useState(false);

  // Toggle functions
  const handleCountryToggle = () => {
    setCountryCollapsed(!countryCollapsed);
  };

  const handleUniversityToggle = () => {
    setUniversityCollapsed(!universityCollapsed);
  };

  const handleCourselabelToggle = () => {
    setCourselabelCollapsed(!courselabelCollapsed);
  };

  const handleCourseintakeToggle = () => {
    setCourseintakeCollapsed(!courseintakeCollapsed);
  };

  const handleCoursefeesToggle = () => {
    setCoursefeesCollapsed(!coursefeesCollapsed);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <>
      <div className="grid grid-cols-10 gap-0">
        <div className="col-span-2 row-span-2 p-4">
          <div className="coll">
            <div className="filter card-content">
              <ul className="flex justify-between after-line md-margin">
                <li className="text-left">
                  <div className="content">
                    <h1 className="text-xl font-black">Filters</h1>
                  </div>
                </li>
                <li className="text-right">
                  <div className="filter-link">
                    <a href="#" className="text-primary underline font-bold">Clear All</a>
                  </div>
                </li>
              </ul>
              <Divider />
            </div>
            <ScrollShadow className="card-content w-[100%] h-[700px]">
              {/* Country */}
              <div className="Collapse-checker p-2">
                <ul className="flex justify-between" onClick={handleCountryToggle}>
                  <li>
                    <h5 className="font-bold">Country</h5>
                  </li>
                  <li>
                    {countryCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </li>
                </ul>
                <Collapse in={countryCollapsed} timeout="auto" unmountOnExit>
                  <Country />
                </Collapse>
              </div>

              {/* University */}
              <div className="Collapse-checker p-2">
                <ul className="flex justify-between" onClick={handleUniversityToggle}>
                  <li>
                    <h5 className="font-bold">University</h5>
                  </li>
                  <li>
                    {universityCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </li>
                </ul>
                <Collapse in={universityCollapsed} timeout="auto" unmountOnExit>
                  <University />
                </Collapse>
              </div>

              {/* Course Label */}
              <div className="Collapse-checker p-2">
                <ul className="flex justify-between" onClick={handleCourselabelToggle}>
                  <li>
                    <h5 className="font-bold">Course Label</h5>
                  </li>
                  <li>
                    {courselabelCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </li>
                </ul>
                <Collapse in={courselabelCollapsed} timeout="auto" unmountOnExit>
                  <Input
                    type="search"
                    variant="bordered"
                    placeholder="Enter Search"
                  />
                  <Divider className="mb-1 mt-1"/>
                  <Courselabel />
                </Collapse>
              </div>

              {/* Course Intake */}
              <div className="Collapse-checker p-2">
                <ul className="flex justify-between" onClick={handleCourseintakeToggle}>
                  <li>
                    <h5 className="font-bold">Course Intake</h5>
                  </li>
                  <li>
                    {courseintakeCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </li>
                </ul>
                <Collapse in={courseintakeCollapsed} timeout="auto" unmountOnExit>
                  <Input
                    type="search"
                    variant="bordered"
                    placeholder="Enter Search"
                  />
                  <Divider className="mb-1 mt-1"/>
                  <Courseintake />
                </Collapse>
              </div>

              {/* Course Fees */}
              <div className="Collapse-checker p-2">
                <ul className="flex justify-between" onClick={handleCoursefeesToggle}>
                  <li>
                    <h5 className="font-bold">Course Fees</h5>
                  </li>
                  <li>
                    {coursefeesCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </li>
                </ul>
                <Collapse in={coursefeesCollapsed} timeout="auto" unmountOnExit>
                  <Input
                    type="search"
                    variant="bordered"
                    placeholder="Enter Search"
                  />
                  <Divider className="mb-1 mt-1"/>
                  <Coursefees />
                </Collapse>
              </div>
            </ScrollShadow>
          </div>
        </div>
        <div className="col-span-8 ml-2">
          <div className="coll card-content">
            
              <div className="navbar-fix">
                <div className="d-flex">
                  <div className="ul-list m-2 after-line">
                    <form>
                    <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-3 pt-5">
                        <h2 className="design_h2">Total Courses: <span>28141</span></h2>
                    </div>
                        <div className="flex col-span-3 gap-4 design_search_form">
                          <input type="text" className="search_input" placeholder="Search from over 80,000 + courses" aria-label="First name"/>
                          <button className="Search_btn">Search</button>
                        </div>
                      </div>
                    </form>
                   
                  </div>
                  <hr className="border-b-0.5 border-gray-300"></hr>
                </div>
                <div className="grid grid-cols-6 gap-4 course-list2 ">
                  <div className="design_clg_img">
                    <img src="../assets/images/Leeds-Beckett-University-pic-campus.png"/>
                  </div>
                  <div className="col-span-4 pt-3">
                      <h4 className="design_h4">BSc (Hons) Data Science and Artificial Intelligence</h4>
                      <p className="design_p_tag">Leeds Beckett University</p>
                      <div className="grup_btn">
                      <button className="oraing_btn">Undergraduate</button>
                      <button className="oraing_btn">3 Years</button>
                      <button className="oraing_btn">Leads</button>
                      </div>
                     
                  </div>
                  <div className="pt-3">
                    <button className="apply_btn">Apply Now</button>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-4 course-list2 ">
                  <div className="design_clg_img">
                    <img src="../assets/images/Leeds-Beckett-University-pic-campus.png"/>
                  </div>
                  <div className="col-span-4 pt-3">
                      <h4 className="design_h4">BSc (Hons) Data Science and Artificial Intelligence</h4>
                      <p className="design_p_tag">Leeds Beckett University</p>
                      <div className="grup_btn">
                      <button className="oraing_btn">Undergraduate</button>
                      <button className="oraing_btn">3 Years</button>
                      <button className="oraing_btn">Leads</button>
                      </div>
                     
                  </div>
                  <div className="pt-3">
                    <button className="apply_btn">Apply Now</button>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-4 course-list2 ">
                  <div className="design_clg_img">
                    <img src="../assets/images/Leeds-Beckett-University-pic-campus.png"/>
                  </div>
                  <div className="col-span-4 pt-3">
                      <h4 className="design_h4">BSc (Hons) Data Science and Artificial Intelligence</h4>
                      <p className="design_p_tag">Leeds Beckett University</p>
                      <div className="grup_btn">
                      <button className="oraing_btn">Undergraduate</button>
                      <button className="oraing_btn">3 Years</button>
                      <button className="oraing_btn">Leads</button>
                      </div>
                     
                  </div>
                  <div className="pt-3">
                    <button className="apply_btn">Apply Now</button>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-4 course-list2 ">
                  <div className="design_clg_img">
                    <img src="../assets/images/Leeds-Beckett-University-pic-campus.png"/>
                  </div>
                  <div className="col-span-4 pt-3">
                      <h4 className="design_h4">BSc (Hons) Data Science and Artificial Intelligence</h4>
                      <p className="design_p_tag">Leeds Beckett University</p>
                      <div className="grup_btn">
                      <button className="oraing_btn">Undergraduate</button>
                      <button className="oraing_btn">3 Years</button>
                      <button className="oraing_btn">Leads</button>
                      </div>
                     
                  </div>
                  <div className="pt-3">
                    <button className="apply_btn">Apply Now</button>
                    </div>
                </div>
                <div className="grid grid-cols-6 gap-4 course-list2 ">
                  <div className="design_clg_img">
                    <img src="../assets/images/Leeds-Beckett-University-pic-campus.png"/>
                  </div>
                  <div className="col-span-4 pt-3">
                      <h4 className="design_h4">BSc (Hons) Data Science and Artificial Intelligence</h4>
                      <p className="design_p_tag">Leeds Beckett University</p>
                      <div className="grup_btn">
                      <button className="oraing_btn">Undergraduate</button>
                      <button className="oraing_btn">3 Years</button>
                      <button className="oraing_btn">Leads</button>
                      </div>
                     
                  </div>
                  <div className="pt-3">
                    <button className="apply_btn">Apply Now</button>
                    </div>
                </div>
                  {/* <ScrollShadow className="card-content w-[100%] h-[400px] ">
                  <Box sx={{ flexGrow: 1 }}  className="mt-2 card">
                    <Card>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Item className="flex justify-s">
                            <Avatar
                              className="rounded-full shadow-lg"
                              src="https://swiftwebdemo.sgp1.digitaloceanspaces.com/universities/logos/ceds/daaeoxn18zoH5PK4vv823cL9B7plQ1K0BrnxSRjI.png"
                              alt="university_logo"
                              sx={{ width: 65, height: 65 }}
                            />
                            <Box
                              aria-haspopup="menu"
                              aria-expanded="false"
                              aria-controls="mantine-uren1vdrn-dropdown"
                              id="mantine-uren1vdrn-target"
                              style={{ padding: '4px', cursor: 'pointer' }}
                            >
                              <IconButton aria-label="more options" size="small">
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </Item>
                        </Grid>
                        <Grid item xs={8}>
                          <Item>
                            <div className="header-content">
                              <span className="heading">MPH - International Business & Diplomacy</span>
                            </div>
                          </Item>
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                  </ScrollShadow> */}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
