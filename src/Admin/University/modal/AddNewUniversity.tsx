import React, { useState, useRef } from 'react';
import { Drawer, Input, Upload, notification } from 'antd';
import { Button } from '@nextui-org/react';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { InsertAction } from '../../../FormHandler/InsertAction';
import { university_Api } from '../../../APIurl/url';
import token from '../../../getLoggedUser/GetUserInfomation';
import './modal-phone.css';
const App: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const showDrawer = () => {
        setOpen(true);
    };
    const { TextArea } = Input;
    const onClose = () => {
        setOpen(false);
    };
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const jwttoken = token('jwt');

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const formRef: any = useRef<HTMLFormElement>(null);
    const [loader, setloader] = useState(false);
    const handleFormData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setloader(true);
        const formData = new FormData(formRef.current);
        formData.append('PAGE_REQUEST', 'INSERT_UNIVERSITY_FORM_DATA');
        const Header = {
            Authenticate: `Bearer ${jwttoken}`,
        };
        const response = await InsertAction(university_Api, formData, 'POST', Header);
        if (response.status === false) {
            formRef.current.reset();
            api['error']({
                message: response.message,
            });
        } else {
            api['success']({
                message: response.message,
            });
            formRef.current.reset();
        }
        setloader(false);
    };
    return (
        <>
            <button className="btn btn-primary" type="button" onClick={showDrawer}>
                Add New University
            </button>
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
                            {(loader) ? 'Loading...' : 'Submit'}
                        </Button>
                    </div>
                }
            >
                <div className="w-full">
                    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
                        <form className="bg-background rounded-lg  p-2  grid gap-6" onSubmit={handleFormData} ref={formRef}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="logo">University Logo  <span className='text-danger'>*</span> </label>
                                    <Input id="name" type="url" name="university_logo" placeholder="Enter university logo url" className="design_input" required />
                                </div>
                                <div className="space-y-2 ">
                                    <label htmlFor="name">University Name <span className='text-danger'>*</span> </label>
                                    <Input id="name" type="text" name="university_name" placeholder="Enter university name" className="design_input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="website">University Website <span className='text-danger'>*</span> </label>
                                    <Input id="website" type="url" name="university_url" placeholder="Enter website URL" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone">University Phone <span className='text-danger'>*</span> </label>
                                    <Input id="phone" type="tel" name="university_number" placeholder="Enter phone number" className="design_input" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="street">Country Name <span className='text-danger'>*</span> </label>
                                    <Input id="street" type="text" name="university_country" placeholder="Enter country address" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="city">City <span className='text-danger'>*</span> </label>
                                    <Input id="city" type="text" name="university_city" placeholder="Enter city" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="state">State <span className='text-danger'>*</span> </label>
                                    <Input id="state" type="text" name="university_state" placeholder="Enter state" className="design_input" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="zip">Zip Code <span className='text-danger'>*</span> </label>
                                    <Input id="zip" type="text" name="university_zip_code" placeholder="Enter zip code" className="design_input" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email">University Email <span className='text-danger'>*</span> </label>
                                <Input id="email" type="email" name="university_email" placeholder="Enter email address" className="design_input" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">Full Address <span className='text-danger'>*</span> </label>
                                <TextArea rows={4} id="description" name="university_address" placeholder="Enter university address" className="design_input" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description">University Description <span className='text-danger'>*</span> </label>
                                <TextArea rows={4} id="description" name="university_description" placeholder="Enter university description" className="design_input" />
                            </div>
                        </form>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default App;
