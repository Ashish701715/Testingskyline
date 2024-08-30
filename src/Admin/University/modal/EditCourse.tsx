import React, { useState, useRef, useEffect } from 'react';
import { Drawer, Input, notification } from 'antd';
import { Button } from '@nextui-org/react';
import { InsertAction } from '../../../FormHandler/InsertAction';
import { university_Api } from '../../../APIurl/url';
import token from '../../../getLoggedUser/GetUserInfomation';
import { NavLink, useParams } from 'react-router-dom';
import { Editor } from 'primereact/editor';
import './modal-phone.css';
interface EditUniversityProps {
    children: React.ReactNode;
}

const App: React.FC<EditUniversityProps> = ({ children }) => {
    const CourseUpdateInfomation: any = children;
    const { universityId } = useParams();
    const [text, setText] = useState(CourseUpdateInfomation.PROGRAM_SUMMARY);
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const showDrawer = () => {
        setOpen(true);
    };
    const { TextArea } = Input;
    const onClose = () => {
        setOpen(false);
    };
    const jwttoken = token('jwt');
    const formRef: any = useRef<HTMLFormElement>(null);
    const [loader, setloader] = useState(false);
    const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloader(true);
        const formData = new FormData(formRef.current);
        formData.append('PAGE_REQUEST', 'UPDATE_PROGRAM_FORM_DATA');
        formData.append('universityId', universityId ? universityId : '0');
        const Header = {
            Authenticate: `Bearer ${jwttoken}`,
        };
        const response = await InsertAction(university_Api, formData, 'POST', Header);
        if (response.status === false) {
            api['error']({
                message: response.message,
            });
        } else {
            localStorage.setItem('refresh', 'univeristyData');
            api['success']({
                message: response.message,
            });
        }
        setloader(false);
    };

    return (
        <>
            <NavLink to="#" className="btn btn-primary" onClick={showDrawer}>
                Edit university
            </NavLink>
            {contextHolder}
            <Drawer
                title="Add New University"
                onClose={onClose}
                open={open}
                placement="left"
                className="university_modal_css"
                extra={
                    <div className="flex">
                        <Button onClick={onClose} className="btn btn-primary mr-2">
                            Cancel
                        </Button>
                        <Button
                            isLoading={loader}
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                            }}
                        >
                            {loader ? 'Loading...' : 'Update record'}
                        </Button>
                    </div>
                }
            >
                <div className="w-full">
                    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
                        <form className="bg-background rounded-lg  p-2  grid gap-6" onSubmit={handleFormData} ref={formRef}>
                            <input type="hidden" name="ProgramId" value={CourseUpdateInfomation.IDS} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 ">
                                    <label htmlFor="name">
                                        Program Name <span className="text-danger">*</span>{' '}
                                    </label>
                                    <Input id="name" type="text" name="Program_name" placeholder="Enter Program Name " className="design_input" defaultValue={CourseUpdateInfomation.PROGRAM_NAME} />
                                </div>
                                <div className="space-y-2 ">
                                    <label htmlFor="name">
                                        Campus Name <span className="text-danger">*</span>{' '}
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="program_Campusname"
                                        placeholder="Enter Campus name"
                                        className="design_input"
                                        defaultValue={CourseUpdateInfomation.PROGRAM_CAMPUS}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                                <div className="space-y-2">
                                    <label htmlFor="street">
                                        Country Name <span className="text-danger">*</span>{' '}
                                    </label>
                                    <Input
                                        id="street"
                                        type="text"
                                        name="program_country"
                                        placeholder="Enter country address"
                                        className="design_input"
                                        defaultValue={CourseUpdateInfomation.PROGRAM_COUNTRY}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="city">
                                        City <span className="text-danger">*</span>{' '}
                                    </label>
                                    <Input id="city" type="text" name="program_city" placeholder="Enter city" className="design_input" defaultValue={CourseUpdateInfomation.PROGRAM_CITY} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="zip">
                                        Zip Code <span className="text-danger">*</span>{' '}
                                    </label>
                                    <Input
                                        id="zip"
                                        type="text"
                                        name="program_zip_code"
                                        placeholder="Enter zip code"
                                        className="design_input"
                                        defaultValue={CourseUpdateInfomation.PROGRAM_CITY_PINCODE}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">
                                    Full Address <span className="text-danger">*</span>{' '}
                                </label>
                                <Input id="email" type="email" name="programAddress" placeholder="Enter full address" className="design_input" defaultValue={CourseUpdateInfomation.PROGRAM_ADDRESS} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">
                                    University Description <span className="text-danger">*</span>{' '}
                                </label>
                                <Editor value={text} onTextChange={(e: any) => setText(e.htmlValue)} style={{ height: '320px' }} className="rounded-xl " />
                                <input type="hidden" name="ProgramDescription" defaultValue={CourseUpdateInfomation.PROGRAM_SUMMARY} />
                            </div>
                        </form>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default App;
