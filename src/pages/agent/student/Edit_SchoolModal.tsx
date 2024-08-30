import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { Col, Divider, Row, Alert, Popover, Checkbox, Drawer, Select } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Token from '../../../getLoggedUser/GetUserInfomation';
import { v1GETDATA } from '../../../APIurl/url';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
interface AppProps {
    onClose: () => void;
    schoolID: any;
    client_id: any;
    encrypt_id: any;
}
const App: React.FC<AppProps> = ({ onClose, schoolID, client_id, encrypt_id }) => {
    const MySwal = withReactContent(Swal);
    const JwtToken = Token('jwt');
    const [Schooledata, setSchooledata]: any = useState([]);
    const [open, setOpen] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);

    const showModal: any = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setOpen(false);
        onClose(); // Call onClose when modal is confirmed (OK)
    };

    const handleCancel = () => {
        setOpen(false);
        onClose(); // Call onClose when modal is canceled (closed)
    };

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    useEffect(() => {
        const Client = async () => {
            const payload = { REQUEST: 'STUDENT_DATA', is_Admin: false, isValid: true };
            const secretKey = 'JwtSecret';
            const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
            const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
            const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

            try {
                const responseData: any = await fetch(v1GETDATA + '?action=view.client.record', {
                    method: 'POST',
                    headers: {
                        Authenticate: `Bearer ${JwtToken}`,
                        'x-token-access': 'true',
                    },
                    body: JSON.stringify({
                        PAGE_REQUEST: 'STUDENT_DATA_VIEW_SCHOOLE_DATA',
                        RequesterUser: 'agent',
                        ClientId: client_id,
                        Encrypt_id: encrypt_id,
                        schoolID: schoolID,
                    }),
                });
                const data = await responseData.json();
                setSchooledata(data.data)
                showLoading();
            } catch (err) {
                console.error(err);

            }
        };
        Client();
    }, []);


    //query to fetch country data
    const [sccountries, setscCountries] = useState([]);
    useEffect(() => {
        const CountryscData = fetch('/country.json');
        CountryscData.then((res) => {
            return res.json();
        }).then((data) => {
            const countryOptions = data.countries.map((country: any) => ({
                value: country.name,
                label: country.name,
                id: country.id,
            }));
            setscCountries(countryOptions);
        });
    }, []);


    //handal changes query

    const [SchoolformData, setschoolFormData] = useState({});
    const [SchoolformLoad, setSchoolformLoad] = useState(false);

    function Selectschoolcountry(name: any, value: any) {
        setschoolFormData({
            ...SchoolformData,
            [name]: value,
        });

    }

    function handalchange(name: any, value: any) {
        setschoolFormData({
            ...SchoolformData,
            [name]: value,
        });

    }


    const handleDateChange = (name: any, value: any) => {
        setschoolFormData({
            ...SchoolformData,
            [name]: value,
        });
    };

    const [loading, setLoading] = React.useState<boolean>(true);
    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    //update form data
    const handalschoolform = async () => {
        if (Object.keys(SchoolformData).length === 0 && SchoolformData.constructor === Object) {
            Swal.fire({
                title: 'Are you looking for an update schools attended session but can`t update profile?',
                // text: 'Please fill out the form before submitting.',
                icon: 'warning',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 5000,
                showCloseButton: true,
                customClass: {
                    popup: 'color-danger',
                },
            });
        } else {
            setSchoolformLoad(true);
            // Update formData with additional data

            // ClientId: client_id,
            //     Encrypt_id: encrypt_id,
            //         schoolID: schoolID,
            const updatedFormData = {
                ...SchoolformData,
                'PAGE_REQUEST': 'STUDENT_PROFILE_FILE_SCHOOL_DATA_UPDATE',
                'ClientId': client_id,
                'Encrypt_id': encrypt_id,
                'schoolID': schoolID,
            };

            try {
                const res = await fetch(`${v1GETDATA}?action=Fileupdateadd&fileTransfer=true&isAgree=true`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authenticate: `Bearer ${JwtToken}`,
                        'x-crros-access': 'true',
                    },
                    body: JSON.stringify(updatedFormData),
                });

                const data = await res.json();

                if (data.status === true) {
                    setSchoolformLoad(false);
                    Swal.fire({
                        title: 'Schools Attended data Updated',
                        // text: 'Please fill out the form before submitting.',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        showCloseButton: true,
                        customClass: {
                            popup: 'color-success',
                        },
                    });
                    onClose();
                } else if (data.status === false) {
                    setSchoolformLoad(false);
                    Swal.fire({
                        text: data.message,
                        icon: 'error',
                    });
                } else {
                    setSchoolformLoad(false);
                    Swal.fire({
                        text: 'Error Query. Please Refresh Page And Try Again',
                        icon: 'error',
                    });
                }
            } catch (error) {
                setSchoolformLoad(false);
                console.error('Error:', error);
                Swal.fire({
                    text: 'Failed to submit data. Please try again later.',
                    icon: 'error',
                });
            }
        }
    }


    return (

        <Modal
            loading={loading}
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                    onFocus={() => { }}
                    onBlur={() => { }}
                // end
                >
                    Update Date
                </div>
            }
            footer={null}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            width={1000}
        >
            <>
                <div className="school-card">
                    <Row gutter={12}>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Country of Institution <span className="text-danger">*</span>
                                </label>
                                <Select
                                    className="w-[100%]"
                                    showSearch
                                    style={{ height: 36 }}
                                    placeholder="Type Country Name (First Letter Capital)"
                                    optionFilterProp="children"
                                    filterOption={(input: any, option: any) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                    options={sccountries}
                                    onChange={(value) => Selectschoolcountry('SCHOOLSATTENDED[COUNTRY_OF_INSTITUTION]', value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].COUNTRY_OF_INSTITUTION
                                            ? Schooledata[0].COUNTRY_OF_INSTITUTION
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Name of Institution <span className="text-danger">*</span>
                                </label>
                                <input

                                    type="text"
                                    name="Education[nameofinstitution]"
                                    placeholder="Institution"
                                    className="form-input design_input"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[NAME_OF_INSTITUTION]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].NAME_OF_INSTITUTION
                                            ? Schooledata[0].NAME_OF_INSTITUTION
                                            : ''
                                    }

                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Level of Education <span className="text-danger">*</span>
                                </label>
                                <input

                                    type="text"
                                    placeholder="Level"
                                    name="Education[level_education]"
                                    className="form-input design_input"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[LEVEL_OF_EDUCATION]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].LEVEL_OF_EDUCATION
                                            ? Schooledata[0].LEVEL_OF_EDUCATION
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Primary Language of Instruction <span className="text-danger">*</span>
                                </label>
                                <input

                                    type="text"
                                    placeholder="Language"
                                    name="Education[primary_instruction_language]"
                                    className="form-input design_input"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[PRIMARY_LANGUAGE_OF_INSTRUCTION]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].PRIMARY_LANGUAGE_OF_INSTRUCTION
                                            ? Schooledata[0].PRIMARY_LANGUAGE_OF_INSTRUCTION
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Attended Institution From <span className="text-danger">*</span>
                                </label>
                                <Flatpickr
                                    value={
                                        Schooledata.length > 0 && Schooledata[0].ATTENDED_FROM
                                            ? Schooledata[0].ATTENDED_FROM
                                            : ''
                                    }
                                    placeholder='Attended From'
                                    options={{ dateFormat: 'Y-m-d' }}
                                    className="form-input design_input"
                                    onChange={(date: any) => {
                                        const selectedDate = new Date(date);
                                        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
                                        handleDateChange('SCHOOLSATTENDED[ATTENDED_FROM]', selectedDate.toISOString().split('T')[0]);
                                    }}


                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Attended Institution To <span className="text-danger">*</span>
                                </label>
                                <Flatpickr
                                    value={
                                        Schooledata.length > 0 && Schooledata[0].ATTENDED_TO
                                            ? Schooledata[0].ATTENDED_TO
                                            : ''
                                    }
                                    placeholder='Attended To'
                                    options={{ dateFormat: 'Y-m-d' }}
                                    className="form-input design_input"
                                    onChange={(date: any) => {
                                        const selectedDate = new Date(date);
                                        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
                                        handleDateChange('SCHOOLSATTENDED[ATTENDED_TO]', selectedDate.toISOString().split('T')[0]);
                                    }}


                                />

                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Degree Name
                                </label>
                                <input

                                    type="text"
                                    placeholder="Degree"
                                    className="form-input design_input"
                                    name="Education[dgree_name]"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[DEGREE_NAME]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].DEGREE_NAME
                                            ? Schooledata[0].DEGREE_NAME
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    I have graduated from this institution <span className="text-danger">*</span>
                                </label>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`Education[graduated_of_institution]`}
                                            className="form-radio design_modal_check_box"
                                            value='1'
                                            onChange={(event) => handalchange('SCHOOLSATTENDED[DID_NOT_GRADUATE]', event.target.value)}
                                            defaultChecked={
                                                Schooledata.length > 0 && Schooledata[0].DID_NOT_GRADUATE
                                                    ? Schooledata[0].DID_NOT_GRADUATE == '1'
                                                    : false
                                            }

                                        />
                                        <span className="text-white-dark">Yes</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`Education[graduated_of_institution]`}
                                            className="form-radio design_modal_check_box"
                                            value='0'
                                            onChange={(event) => handalchange('SCHOOLSATTENDED[DID_NOT_GRADUATE]', event.target.value)}
                                            defaultChecked={
                                                Schooledata.length > 0 && Schooledata[0].DID_NOT_GRADUATE
                                                    ? Schooledata[0].DID_NOT_GRADUATE == '0'
                                                    : false
                                            }

                                        />
                                        <span className="text-white-dark">No</span>
                                    </label>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Graduation Date
                                </label>

                                <Flatpickr
                                    value={
                                        Schooledata.length > 0 && Schooledata[0].GRADUATION_DATE
                                            ? Schooledata[0].GRADUATION_DATE
                                            : ''
                                    }
                                    placeholder='Attended From'
                                    options={{ dateFormat: 'Y-m-d' }}
                                    className="form-input design_input"
                                    onChange={(date: any) => {
                                        const selectedDate = new Date(date);
                                        selectedDate.setMinutes(selectedDate.getMinutes() - selectedDate.getTimezoneOffset());
                                        handleDateChange('SCHOOLSATTENDED[GRADUATION_DATE]', selectedDate.toISOString().split('T')[0]);
                                    }}


                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox"
                                        name="Education[i_have_physical_certificate]"
                                        onChange={(event) => handalchange('SCHOOLSATTENDED[PHYSICAL_CERTIFICATE]', event.target.checked)}
                                        defaultChecked={
                                            Schooledata.length > 0 && Schooledata[0].PHYSICAL_CERTIFICATE
                                                ? Schooledata[0].PHYSICAL_CERTIFICATE == '1'
                                                : false
                                        }
                                    />I have the physical certificate for this degree
                                </label>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Address <span className="text-danger">*</span>
                                </label>
                                <input

                                    type="text"
                                    placeholder="Address"
                                    className="form-input design_input"
                                    name="Education[Address]"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[ADDRESS]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].ADDRESS
                                            ? Schooledata[0].ADDRESS
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    City/Town <span className="text-danger">*</span>
                                </label>
                                <input

                                    type="text"
                                    placeholder="City/Town"
                                    className="form-input design_input"
                                    name="Education[city]"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[CITY]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].CITY
                                            ? Schooledata[0].CITY
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Province/State <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Province/State"
                                    className="form-input design_input"
                                    name="Education[sate]"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[PROVINCE]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].PROVINCE
                                            ? Schooledata[0].PROVINCE
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={12} className="mt-4">
                        <Col span={8}>
                            <div>
                                <label className="font-size-12">
                                    Postal/Zip Code
                                </label>
                                <input

                                    type="text"
                                    placeholder="Postal/Zip Code"
                                    className="form-input design_input"
                                    name="Education[ZipCode]"
                                    onChange={(event) => handalchange('SCHOOLSATTENDED[PROVINCE]', event.target.value)}
                                    defaultValue={
                                        Schooledata.length > 0 && Schooledata[0].PROVINCE
                                            ? Schooledata[0].PROVINCE
                                            : ''
                                    }
                                />
                            </div>
                        </Col>
                    </Row>

                    <Divider />

                    <div className="button-save grid gap-3">

                        <button className="btn btn-primary"
                            onClick={() => {
                                handalschoolform();
                            }}
                            disabled={(SchoolformLoad == true ? true : false)}
                        >
                            {SchoolformLoad == true ? '...Wait' : 'Update'}
                        </button>
                        <button className="btn btn-primary" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>

                </div>

            </>
        </Modal>

    );
};

export default App;