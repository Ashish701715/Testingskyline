import React, { useState } from 'react';
import { Input, Modal, Select, Button, message } from 'antd';
import { InsertAction } from '../../FormHandler/InsertAction';
import { GETDATA } from '../../APIurl/url';
import userInfo from '../../getLoggedUser/GetUserInfomation';
interface DataType {
    data: any;
    setpageRefresh: any;
}
const ApproveCommission = ({ data, setpageRefresh }: DataType) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    console.table(data);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const token = userInfo('jwt');
    const [loading, setloading] = useState(true);
    setTimeout(() => {
        setloading(false);
    }, 1000);
    const [btnClose, setBtnclose] = useState(false);

    const [CurrencyType, setCurrencyType] = useState(data.CURRENCY_TYPE);
    const [Commissiondata, setCommissiondata] = useState(data.COMMISSION_PRICE);

    const SubmitFormBtn = async () => {
        setBtnclose(true);
        const body = JSON.stringify({
            'PAGE_REQUEST': 'UPDATE_COMMISSION_DATA_PRICE_DATA',
            'CurrencyType': CurrencyType,
            'Commissiondata': Commissiondata,
            'CommissionId': data.UUID,
        });

        const Heades = {
            Authenticate: `Bearer ${token}`,
        };
        const response = await InsertAction(GETDATA, body, 'POST', Heades);
        if (response.status === true) {
            message.success('The commission amount has been updated successfully.');
            setpageRefresh(true);
        } else {
            message.error(response.message);
        }
        setIsModalOpen(false);
        setBtnclose(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    function setCurrencyTypeData(value: string) {
        setCurrencyType(value);
    }
    return (
        <>
            {/* Dailog Modal  */}
            <button className="btn mr-1 btn-primary btn-sm" onClick={showModal}>
                Edit
            </button>
            <Modal
                onCancel={handleCancel}
                title="Update Agent Commissions"
                open={isModalOpen}
                loading={loading}
                className="ModalDailog"
                footer={[
                    <>
                        <Button className="btn-primary" onClick={handleCancel}>
                            Close
                        </Button>
                        <Button className="btn-primary" onClick={SubmitFormBtn} loading={btnClose}>
                            Approve & pay
                        </Button>
                    </>,
                ]}
            >
                <p>Review and update the following commission details.</p>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="col-span-1 space-y-1">
                            <p className="text-sm font-medium">Agent Name</p>
                            <p className="text-sm text-muted-foreground">{data.AGNET_NAME}</p>
                        </div>
                        <div className="col-span-1 space-y-1">
                            <p className="text-sm font-medium">Commission Amount</p>
                            <p className="text-sm text-muted-foreground">
                                {data.CURRENCY_TYPE}
                                {data.COMMISSION_PRICE}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="col-span-1 space-y-1">
                            <p className="text-sm font-medium">Payment Status</p>
                            <p className="text-sm text-muted-foreground">{data.PAID_COMMSSION_STATUS}</p>
                        </div>
                        <div className="col-span-1 space-y-1">
                            <p className="text-sm font-medium">Application Id & Client Name</p>
                            <br />
                            <p className="text-sm text-muted-foreground">
                                <p className="flex">
                                    <p className="font-medium flex">StudentId : </p>
                                    {data.SUBMMISSION_FILE_ID}
                                </p>{' '}
                                <span className="flex">
                                    {' '}
                                    <p className="font-medium">Client Name : </p> {data.FIRST_NAME} {data.LAST_NAME}
                                </span>
                            </p>
                        </div>
                    </div>
                    <form action="">
                        <label htmlFor="currenyTYpe">
                            Currency Type <span className="text-danger">*</span>
                        </label>
                        <Select
                            id="currenyTYpe"
                            showSearch
                            className="w-full"
                            placeholder="Select a person"
                            onChange={setCurrencyTypeData}
                            value={CurrencyType}
                            options={[
                                { value: '$', label: 'Dollar' },
                                { value: '€', label: 'Euro' },
                                { value: '£', label: 'British Pound' },
                                { value: '₹', label: 'Indian Rupee' },
                            ]}
                        />

                        <label htmlFor="currenyTYpe" className="mt-3">
                            Currency Type <span className="text-danger">*</span>
                        </label>
                        <Input
                            placeholder="Update Commission Price"
                            defaultValue={data.COMMISSION_PRICE}
                            onChange={(e: any) => {
                                setCommissiondata(e.target.value);
                            }}
                        />
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default ApproveCommission;
