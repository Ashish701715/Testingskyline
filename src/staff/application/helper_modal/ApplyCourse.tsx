import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Space, notification } from 'antd';
import { Button } from '@nextui-org/react';
import jwt from '../../../getLoggedUser/GetUserInfomation';
import { INSERTDATA } from '../../../APIurl/url';
import { useParams } from 'react-router-dom';
import Calculateintak from './selectintak';
const AddNewCourse = ({ ClientData, program_infomation, intake }: any) => {
    const [open, setOpen] = useState(false);
    const showLargeDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const Token = jwt('jwt');
    const ComponentsData = ClientData ?? [];
    const [api, contextHolder] = notification.useNotification();
    const [Programintake, setData] = useState([]);
    const currentYear = new Date().getFullYear();
    useEffect(() => {
        let intakeFilter = JSON.parse(program_infomation.UNIVERSITY_PROGRAM_INTAKE);
        const FilterIntake = intakeFilter.filter((value: any) => {
            return value.INTAKE_START_YEAR <= currentYear && value.INTAKE_CLOSE_YEAR >= currentYear;
        });
        setData(FilterIntake);
    }, [open]);
    const { client_id } = useParams();
    const { file_id } = useParams();
    const { encrypt_id } = useParams();

    const [isloader, setLoader] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const HandleFormApplication = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            const Formdata = new FormData(e.target);
            Formdata.append('PAGE_REQUEST', 'INSERT_OFFERLETTER_APPLICATION');
            Formdata.append('CLIENT_ID', client_id || '');
            Formdata.append('encrypt_id', encrypt_id || '');
            Formdata.append('Deal_id', file_id || '');

            const res = await fetch(INSERTDATA + '?action=apply-offer-letter', {
                method: 'POST',
                headers: {
                    Authenticate: `Bearer ${Token}`,
                    'x-token-access': `true`,
                    'x-client-id': client_id || '',
                    'x-encrypt-id': encrypt_id || '',
                },
                body: Formdata,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const response = await res.json();
            if (response.status === true) {
                api['success']({
                    message: response.message,
                    placement: 'topLeft',
                    duration: 3,
                });
                if (formRef.current) {
                    formRef.current.reset();
                }
            } else {
                api['error']({
                    message: response.message,
                    placement: 'topLeft',
                    duration: 3,
                });
            }
        } catch (err) {
            api['error']({
                message: 'Error your Form Components',
                placement: 'topLeft',
                duration: 3,
            });
        }
        setLoader(false);
    };
    return (
        <>
            {contextHolder}
            <Space className="mt-5 w-[100%] width_class">
                <button className="btn btn-primary" onClick={showLargeDrawer}>
                    Enroll New Courses
                </button>
            </Space>
            <Drawer title="Enroll New Courses" width={'85%'} className="font-Nunito new-header-class set_widht_enroll_form" placement="right" onClose={onClose} open={open} closable={false}>
                <form ref={formRef} className="pl-12 pr-12" onSubmit={HandleFormApplication}>
                    <input type="hidden" name="CourseID" value={program_infomation.IDS} />
                    <input type="hidden" name="UniversityID" value={program_infomation.UNIVERSITY_ID} />
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        First name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="first-name"
                                            id="first-name"
                                            value={ComponentsData.FIRST_NAME}
                                            autoComplete="given-name"
                                            readOnly
                                            disabled
                                            className="block design_input cursor-no-drop w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                        Last name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="last-name"
                                            readOnly
                                            disabled
                                            id="last-name"
                                            value={ComponentsData.LAST_NAME}
                                            autoComplete="family-name"
                                            className="design_input block cursor-no-drop w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block cursor-no-drop text-sm font-medium leading-6 text-gray-900">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={ComponentsData.EMAIL}
                                            readOnly
                                            disabled
                                            autoComplete="email"
                                            className="block cursor-no-drop design_input w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block  max-w-full  text-sm font-medium leading-6 text-gray-900">
                                        Intake
                                        <span className="text-primary">
                                            * <span className="text-primary font-sm-13">please select admission intake.</span>
                                        </span>
                                    </label>
                                    <div className="mt-2">
                                        <select
                                            id="Intake_Data"
                                            name="Intake_Data"
                                            required
                                            autoComplete="Intake_Data-name"
                                            className="block design_input max-w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                        >
                                            <option disabled selected>
                                                {' '}
                                                select intake{' '}
                                            </option>

                                            <Calculateintak intakeData={program_infomation.UNIVERSITY_PROGRAM_INTAKE} />
                                        </select>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                                        University Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="street-address"
                                            id="street-address"
                                            readOnly
                                            disabled
                                            value={program_infomation.UNIVERSITY_NAME}
                                            autoComplete="street-address"
                                            className="block w-full design_input cursor-no-drop rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1">
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                        Course Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            readOnly
                                            value={program_infomation.PROGRAM_NAME}
                                            disabled
                                            autoComplete="address-level2"
                                            className="block design_input cursor-no-drop w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                                        Campus city
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="postal-code"
                                            id="postal-code"
                                            readOnly
                                            value={program_infomation.PROGRAM_CAMPUS}
                                            disabled
                                            autoComplete="postal-code"
                                            className="block w-full cursor-no-drop design_input rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900">
                                        Course Fees
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="region"
                                            id="region"
                                            readOnly
                                            value={program_infomation.APPLICATION_FEE}
                                            disabled
                                            autoComplete="address-level1"
                                            className="block design_input cursor-no-drop w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    <label htmlFor="country" className="block  max-w-full  text-sm font-medium leading-6 text-gray-900">
                                        Comment <span className="text-primary">*</span>
                                    </label>
                                    <div className="mt-2">
                                        <textarea id="about" name="Comment_section" rows={3} className="block w-full ring-1 ring-inset ring-gray-300 rounded-2xl p-3" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6 bottom-fix">
                        <Button type="submit" className="btn btn-primary" isLoading={isloader}>
                            Apply application
                        </Button>
                        <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </Drawer>
        </>
    );
};

export default AddNewCourse;
