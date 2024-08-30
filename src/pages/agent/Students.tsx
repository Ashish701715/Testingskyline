import React, { useState, useEffect } from 'react';
import { CustomerService } from './service/CustomerService';
import './student-flags.css';
import './student.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { INSERTDATA } from '../../APIurl/url';
import jwt from '../../getLoggedUser/GetUserInfomation';
import { GETDATA } from '../../APIurl/url';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useSelector } from 'react-redux';
import Select, { ActionMeta, MultiValue } from 'react-select';
import { message, Space } from 'antd';
import MuiPhoneNumber from 'mui-phone-number';
export default function LazyLoadDemo({ Refresh }: any) {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [User, setUser] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [customers, setCustomers] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: {
            name: { value: '', matchMode: 'contains' },
            'country.name': { value: '', matchMode: 'contains' },
            company: { value: '', matchMode: 'contains' },
            'representative.name': { value: '', matchMode: 'contains' },
        },
    });

    let networkTimeout: string | number | NodeJS.Timeout | null | undefined = null;

    useEffect(() => {
        loadLazyData();
    }, [lazyState]);

    const loadLazyData = () => {
        setLoading(true);

        if (networkTimeout) {
            clearTimeout(networkTimeout);
        }

        //imitate delay of a backend call
        networkTimeout = setTimeout(() => {
            CustomerService.getCustomers({ lazyEvent: JSON.stringify(lazyState) }).then((data) => {
                setTotalRecords(data.totalRecords);
                setCustomers(data.customers);
                setLoading(false);
            });
        }, Math.random() * 1000 + 250);
    };
    const token = jwt('jwt');
    useEffect(() => {
        let url = `view=comment&edit=true`;
        fetch(GETDATA + '?action=view-user&auth=true&view=true&edit=false', {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: 'GET_USER_DATA_LIST',
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status == true) {
                    setUser(data.data);
                }
            });
    }, []);

    const [selectedServices, setSelectedServices] = useState<MultiValue<any>[]>([]); // Use the correct type

    const handleSelectChange = (newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
        setSelectedServices(newValue as MultiValue<any>[]); // Cast newValue to the correct type
    };

    const [selectedCountryValues, setSelectedCountryValues] = useState<MultiValue<any>[]>([]);
    const handleSelectChangecountryofinterest = (newValue: MultiValue<any>, actionMeta: ActionMeta<any>) => {
        setSelectedCountryValues(newValue as MultiValue<any>[]);
    };

    const [formloader, setformloader] = useState(false);
    const [number, setnumber] = useState('');
    const StoreStudent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setformloader(true);
        const formData = new FormData(e.currentTarget);

        const jsonData: { [key: string]: any } = {};
        formData.forEach((value, key) => {
            jsonData[key] = value.toString();
        });
        const selectedServicesValues = selectedServices.map((Option: any) => Option.value);
        jsonData['services[Servicesofinterest]'] = selectedServicesValues;

        const selectedServicesCountry = selectedCountryValues.map((Option: any) => Option.value);
        jsonData['services[countryofinterest]'] = selectedServicesCountry;
        jsonData['PAGE_REQUEST'] = 'INSERT_USER_ENQUIRE_FORM_DATA';

        let url = `action=insert-data-user&edit=true$delete=true&auth=true`;
        fetch(INSERTDATA + '?' + url, {
            method: 'POST',
            headers: {
                Authenticate: `Bearer ${token}`,
            },
            body: JSON.stringify(jsonData),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.status == true) {
                    setformloader(false);
                    Refresh(true);
                    const Form = document.getElementById('FomrId') as HTMLFormElement;
                    if (Form) {
                        Form.reset();
                    } else {
                        console.error("Form with ID 'FormId' not found.");
                    }
                    messageApi.open({
                        type: 'success',
                        content: 'Form Submited Successfully',
                        style: {
                            color: 'success',
                            textAlign: 'end',
                        },
                    });
                    setVisible(false)
                } else {
                    setformloader(false);
                    messageApi.open({
                        type: 'error',
                        content: data.message,
                        style: {
                            color: 'danger',
                            textAlign: 'end',
                        },
                    });
                }
            });
    };

    const [visible, setVisible] = useState(false);
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [date1, setDate1] = useState<any>('');
    const Country_of_Interest: any = [
        { value: 'USA', label: 'USA' },
        { value: 'Ireland', label: 'Ireland' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Germany', label: 'Germany' },
        { value: 'United Kingdom', label: 'United Kingdom' }
    ];

    const Services_of_Interest: any = [
        {
            value: 'Programs',
            label: 'Programs',
        },
        {
            value: 'Scholarships',
            label: 'Scholarships',
        },
        {
            value: 'Visa Services',
            label: 'Visa Services',
        },
        {
            value: 'Insurance',
            label: 'Insurance',
        },
        {
            value: 'Accommodation',
            label: 'Accommodation',
        },
        {
            value: 'bank_accounts',
            label: 'Bank Accounts',
        },
        {
            value: 'Tourium',
            label: 'Tourium',
        },
        {
            value: 'Other',
            label: 'Other',
        },
    ];
    function setnumbers() {
        console.log('okay');
    }
    return (
        <>
            <div className="flex modal-custom">
                {/* Success Message Show  */}
                {contextHolder}
                <Button type="button" label="Create Application" icon="pi pi-plus" className="modal-btn-custom" onClick={() => setVisible(true)} />
                <Dialog
                    header="New Application"
                    visible={visible}
                    onHide={() => {
                        if (!visible) return;
                        setVisible(false);
                    }}
                >
                    <form onSubmit={StoreStudent} id="FomrId">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="grid-cols-1">
                                <label className="design_modal_label" htmlFor="firstname">
                                    First Name <span className="text-danger">*</span>
                                </label>
                                <input id="firstname" type="text" placeholder="Enter First Name" className="design_input" name="personalInfomation[FirstName]" required />
                            </div>
                            <div className="grid-cols-1">
                                <label className="design_modal_label" htmlFor="lastname">
                                    Last Name <span className="text-danger">*</span>
                                </label>
                                <input id="lastname" type="taxt" placeholder="Enter Last Name" className="design_input" name="personalInfomation[LastName]" required />
                            </div>
                            <div className="grid-cols-1">
                                <label className="design_modal_label" htmlFor="middlename">
                                    Middle Name
                                </label>
                                <input id="middlename" type="text" placeholder="Enter Middle Name" name="personalInfomation[MiddleName]" className="design_input" />
                            </div>

                            <div>
                                <label className="design_modal_label" htmlFor="DOB">
                                    Date of Birth <span className="text-danger">*</span>
                                </label>
                                <input id="DOB" type="date" className="design_input font-normal" name="personalInfomation[Dob]" required />
                            </div>
                            <div className="">
                                <label className="design_modal_label" htmlF-span-3or="gridState">
                                    Country of Citizenship
                                </label>
                                <input type="text" className="design_input" name="personalInfomation[CountryOfCitizenship]" placeholder="Country of Citizenship" />
                            </div>
                            <div>
                                <label className="design_modal_label" htmlFor="firstname">
                                    Passport number
                                </label>
                                <input id="firstname" type="text" placeholder="Passport number" className="design_input" name="Document[PassportNumber]" />
                            </div>
                            <div className="col-span-3">
                                <label className="design_modal_label" htmlFor="firstname">
                                    Passport expiry date
                                </label>
                                <Flatpickr
                                    name="Document[PassportExpire]"
                                    value={date1}
                                    options={{ dateFormat: 'd-M-Y', position: isRtl ? 'auto right' : 'auto left' }}
                                    className="design_input"
                                    onChange={(date) => setDate1(date)}
                                />
                            </div>
                            <div className="col">
                                <label className="design_modal_label" htmlFor="gender">
                                    Gender
                                </label>
                                <div className="flex items-center mt-1 cursor-pointer">
                                    <input id="male" type="radio" name="personalInfomation[Gender]" className="form-radio" value="male" />
                                    <label className=" design_modal_label_check" htmlFor="male">
                                        Male
                                    </label>

                                    <input id="female" type="radio" name="personalInfomation[Gender]" className="form-radio ml-4" value="female" />
                                    <label className=" design_modal_label_check" htmlFor="female">
                                        Female
                                    </label>
                                </div>
                            </div>
                            <h1 className="col-span-3 contact-information-custom">Contact Information</h1>

                            <div className="col-span-2">
                                <label className="design_modal_label" htmlFor="email">
                                    Email <span className="text-danger">*</span>
                                </label>
                                <input id="email" type="email" placeholder="Enter Email" className="design_input" name="Contact_Infomation[EmailId]" required />
                            </div>
                            <div className="col-span-1">
                                <label className="design_modal_label" htmlFor="phonenumber">
                                    Phone Number <span className="text-danger">*</span>
                                </label>
                                <MuiPhoneNumber id="phonenumber" onChange={setnumbers} className="design_input" name="Contact_Infomation[MobileNumber]" defaultCountry="in" />
                            </div>

                            <div className="col-span-2">
                                <label className="design_modal_label" htmlFor="countryofinterest">
                                    Country of Interest
                                </label>
                                <Select
                                    className="design_input"
                                    placeholder="Select an option"
                                    options={Country_of_Interest}
                                    isMulti
                                    value={selectedCountryValues}
                                    onChange={handleSelectChangecountryofinterest}
                                />
                            </div>
                            <div className="">
                                <label className="design_modal_label" htmlFor="servicesofinterest">
                                    Services of Interest
                                </label>
                                <Select className="design_input" placeholder="Select an option" options={Services_of_Interest} isMulti value={selectedServices} onChange={handleSelectChange} />
                            </div>

                            <div className="col-span-3">
                                <label className="design_modal_check_box flex items-center mt-1 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox" required />
                                    <span className="text-white-dark">
                                        I confirm that I have received express written consent from the student whom I am creating this profile for and I can provide proof of their consent upon
                                        request. To learn more please refer to the Personal Data Consent/Confirm Visa+Enrolment article.
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex">
                            {formloader ? (
                                <Button type="button" className="btn btn-primary" loading>
                                    please wait...
                                </Button>
                            ) : (
                                <Button type="submit" className="btn btn-primary mx-3">
                                    Submit
                                </Button>
                            )}

                            <Button type="button" className="btn btn-primary" onClick={() => setVisible(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Dialog>
            </div>
        </>
    );
}
