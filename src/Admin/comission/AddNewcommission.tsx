import React, { useState, useEffect, useRef } from 'react';
import { Drawer } from 'antd';
import '../../style/drawer.css';
import { Button, Col, DatePicker, Form, Input, Row, Select, message } from 'antd';
import { InsertAction } from '../../FormHandler/InsertAction';
import { GETDATA } from '../../APIurl/url';
import getCookie from '../../getLoggedUser/GetUserInfomation';

const App: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { Option } = Select;
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    const Token = getCookie('jwt');
    useEffect(() => {
        const formControlElements = document.querySelectorAll('.ant-form-item-control');
        formControlElements.forEach((element: any) => {
            element.style.width = '100%';
        });
    }, [open]);
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

    const CurrencyType = [
        {
            label: 'Dollar',
            value: '$',
        },
        {
            label: 'Rupees',
            value: '₹',
        },
        {
            label: 'Euro',
            value: '€',
        },
        {
            label: 'Pound',
            value: '£',
        },
        {
            label: 'Other',
            value: 'Other',
        },
    ];

    const [Country_of_Interest, setCountries] = useState([]);
    useEffect(() => {
        const fetchCountries = async () => {
            const response = await fetch('/public.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCountries(data.Country);
        };

        fetchCountries();
    }, []);

    const handlesubmit = useRef<HTMLFormElement | null>(null);
    const [CurrencyTypes, setCurrencyType] = useState('');
    const [ServiceTypes, setServiceTypes] = useState('');
    const [CountryTypes, setCountryTypes] = useState('');
    const [loading, setloading] = useState(false);
    const handlePriceSetup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setloading(true)
        if (handlesubmit.current) {
            const formData = new FormData(handlesubmit.current);
            formData.append('CurrencyTypes', CurrencyTypes);
            formData.append('ServiceTypes', ServiceTypes);
            formData.append('CountryTypes', CountryTypes);
            formData.append('PAGE_REQUEST', 'INSERT_COMMISSION_SETUP_PRICE');

            const Header = {
                Authenticate: `Bearer ${Token}`,
            };
            const formrequest = await InsertAction(GETDATA, formData, 'POST', Header);
            if (formrequest.status === true) {
                message.success('The commission price has been successfully recorded');
                onClose();
                window.location.reload();
            } else {
                message.error(formrequest.message);
            }
        }
        setloading(false);
    };

    const HanldeCurrenyType = (value: any) => {
        setCurrencyType(value);
    };

    const HanldeServcireType = (value: any) => {
        setServiceTypes(value);
    };

    const HandleCountry = (value: any) => {
        setCountryTypes(value);
    };

    return (
        <>
            <button className="btn btn-sm btn-primary" onClick={showDrawer}>
                Create Commission
            </button>
            <Drawer
                title="Add New Commssion"
                onClose={onClose}
                open={open}
                placement="left"
                className="rounded-xl set_modal_width"
                extra={
                    <div className="flex">
                        <button className="btn btn-sm btn-primary mr-2" disabled={loading} onClick={onClose}>Close</button>
                        <button className="btn btn-sm btn-primary" type={(loading) ? 'button' : 'submit'} form={(loading) ? 'null' : 'priceForm'} disabled={loading}>
                            {(loading) ? 'Please wait...' : 'Store Price'}
                        </button>
                    </div>
                }
            >
                <form onSubmit={handlePriceSetup} ref={handlesubmit} id="priceForm">
                    <Row gutter={16} className='set_form_col'>
                        <Col span={12}>
                            <Form.Item name="name" label="Commission Price" rules={[{ required: true, message: 'Please Enter Commission Price' }]}>
                                <Input placeholder="Please Enter Commission Price" type="text" className="h-[40px] rounded-xl" name="PriceData" />
                            </Form.Item>
                        </Col>
                        <Col span={12} className="w-[100%]">
                            <Form.Item className="" name="owner" label="Currency Type" rules={[{ required: true, message: 'Please select an owner' }]}>
                                <Select
                                    placeholder="Please select an owner"
                                    className="w-[100%] h-[40px] Border-Round"
                                    options={CurrencyType}
                                    value={CurrencyType}
                                    onChange={HanldeCurrenyType}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16} className='set_form_col'>
                        <Col span={12} className="w-[100%]">
                            <Form.Item className="" name="owner" label="Service Type" rules={[{ required: true, message: 'Please select an owner' }]}>
                                <Select
                                    placeholder="Please select an owner"
                                    className="w-[100%] h-[40px] Border-Round"
                                    options={Services_of_Interest}
                                    value={ServiceTypes}
                                    onChange={HanldeServcireType}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} className="w-[100%]">
                            <Form.Item className="" name="owner" label="Service Country" rules={[{ required: true, message: 'Please select an owner' }]}>
                                <Select
                                    placeholder="Please select an owner"
                                    className="w-[100%] h-[40px] Border-Round"
                                    options={Country_of_Interest}
                                    value={CountryTypes}
                                    onChange={HandleCountry}
                                ></Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} className="w-[100%]">
                            <Form.Item className="" name="owner" label="description" rules={[{ required: true, message: 'Please select an owner' }]}>
                                <Input.TextArea rows={4} placeholder="please enter description" className="rounded-xl" name="Description" />
                            </Form.Item>
                        </Col>
                    </Row>
                </form>
            </Drawer>
        </>
    );
};

export default App;
