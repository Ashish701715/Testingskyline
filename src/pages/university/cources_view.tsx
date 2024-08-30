import { Card, CardBody, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Button } from '@nextui-org/react';
import './style.css';
import {InsertAction}  from './../../FormHandler/InsertAction';
import { Textarea } from '@nextui-org/input';
// import { Form } from 'react-router-dom';
export default function View({ programinfomation }: any) {
    // const HandlerCourseSubmission = async(e:any) => {
    //     e.preventDefault();
    //     const Formdata = new FormData(e.target);
    //     Formdata.append('PAGE_REQUEST' , 'NEW_OFFER_LETTER_REQUEST');
    // }
    return (
        <>
            <div className="grid grid-cols-5 pb-4 gap-4">
                <div className="col-span-3 page_headng underline">{programinfomation.PROGRAM_NAME}</div>
                <div className="col-span-2 custom-flex-container justify-content-end"></div>
            </div>
            <hr />
            <div className="grid grid-cols-8 pb-4 gap-5">
                <div className="col-span-2">
                    <div className="desin_1st_col ">
                        <div className="grid grid-cols-5 pb-4 gap-4">
                            <div className="col-span-1">
                                <img src="../assets/images/LeedsBeckettUniversity.png" className="clg_img_icon" />
                            </div>
                            <div className="col-span-4">
                                <h3 className="h3_tag_design">{programinfomation.UNIVERSITY_NAME}</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-6 pb-4 gap-4">
                            <div className="col-span-3">
                                <h4 className=" design_h4_tag1">Tution Fees:</h4>
                                <h4 className=" design_h4_tag1">Duration:</h4>
                                <h4 className=" design_h4_tag1">Course Type:</h4>
                                <h4 className=" design_h4_tag1">Location:</h4>
                            </div>
                            <div className="col-span-3">
                                <h4 className="design_h4_tag2">{programinfomation.GROSS_TUITION}</h4>
                                <h4 className="design_h4_tag2">{programinfomation.PROGRAM_LENGTH}</h4>
                                <h4 className="design_h4_tag2">{programinfomation.PROGRAM_LEVEL}</h4>
                                <h4 className="design_h4_tag2">{programinfomation.PROGRAM_ADDRESS}</h4>
                            </div>
                        </div>
                    </div>
                    {/* <div className="desin_1st_col">
                        <div className="grid grid-cols-5 pb-4 gap-4 ApplyCourse"> */}
                            {/* <form>
                                <div className="col-span-5">
                                    <h3 className="h3_tag_design pb-3">Available Options</h3>
                                    <h4 className="design_h4_tag2 pb-2">Intake</h4>
                                    <Select placeholder=" --- Please Select --- " className="max-w-xs pb-4 w-[100%] max-w-[100%]">
                                        <SelectItem key={1}>September/October 2024</SelectItem>
                                    </Select>
                                    <br />
                                    <Textarea
                                        label="Description"
                                        variant="bordered"
                                        placeholder="Enter your description"
                                        disableAnimation
                                        disableAutosize
                                        className="bg-white rounded-2xl w-[100%] max-w-[100%]"
                                        classNames={{
                                            base: 'max-w-xs',
                                            input: 'resize-y min-h-[40px]',
                                        }}
                                    />
                                    <br />
                                    <Button className="design_btn  w-full">Apply Now</Button>
                                </div>
                            </form> */}
                        {/* </div>
                    </div> */}
                </div>
                <div className="col-span-6 custom-flex-container justify-content-end">
                    <div className="flex w-full flex-col desin_1st_col box_height">
                        <Tabs aria-label="Options">
                            <Tab className="design_tab_title" key="General Entry Requirement" title="General Entry Requirement">
                                <Card>
                                    <CardBody>
                                        <h3 className="h3_tag_design pb-3">Academic Requirement:</h3>
                                        <p className="design_p_tag1" dangerouslySetInnerHTML={{ __html: programinfomation.PROGRAM_ACADEMIC }} />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab className="design_tab_title" key="General English Requirement" title="General English Requirement">
                                <Card>
                                    <CardBody>
                                        <h3 className="h3_tag_design pb-3">English Language Requirement:</h3>
                                        <p className="design_p_tag1" dangerouslySetInnerHTML={{ __html: programinfomation.PROGRAM_ENGLISH_LANGUAGE_REQUIREMENT }} />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab className="design_tab_title" key="Time Line" title="Time Line">
                                <Card>
                                    <CardBody>
                                        <Table removeWrapper aria-label="Example static collection table">
                                            <TableHeader>
                                                <TableColumn className="table_heading">Conditional Offer</TableColumn>
                                                <TableColumn className="table_heading">Unconditional Offer</TableColumn>
                                                <TableColumn className="table_heading">CAS</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow key="1">
                                                    <TableCell className="table_content">{programinfomation.CONDITIONAL_OFFER}</TableCell>
                                                    <TableCell className="table_content">{programinfomation.UNCONDITIONAL_OFFER}</TableCell>
                                                    <TableCell className="table_content">{programinfomation.CAS}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab className="design_tab_title" key="locationAndAddress" title="Location & Address">
                                <Card>
                                    <CardBody>
                                        <iframe src={programinfomation.PROGRAM_MAP_ID} width="100%" height="430" loading="lazy"></iframe>
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    );
}
