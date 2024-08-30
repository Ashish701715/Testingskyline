import React from 'react';

import Blank from '../tab/blank';
import { Button } from "@nextui-org/react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Fullview from './Full_infomation';


const Infomation = ({ Clientinfo }: any) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {Clientinfo.UUID ? (

                <>
                    <div className='flex justify-end'>
                        <Button isIconOnly color="primary" variant="faded" aria-label="Take a photo" onClick={openModal}>
                            <RemoveRedEyeIcon />
                        </Button>

                    </div>
                    <div className="tab-pane white_table_sec table_blue_border active" id="student_Details">

                        <div className="table-responsive">

                        <table className="table table-striped student-details-tables">
    <tbody>
        <tr>
            <td>
                Student ID
                <br />
                <strong>{Clientinfo?.UUID}</strong>
            </td>
            <td>
                Date Added
                <br />
                <strong>{Clientinfo?.CREATE_AT}</strong>
            </td>
        </tr>
        <tr>
            <td>
                Student Passport No.
                <br />
                <strong>{Clientinfo?.PASSPORT_NUMBER}</strong>
            </td>
            <td>
                Student Expiry
                <br />
                <strong>{Clientinfo?.PASSPORT_EXPIRY_DATE}</strong>
            </td>
        </tr>
        <tr>
            <td>
                Student Name
                <br />
                <strong>
                    {Clientinfo?.FIRST_NAME} {Clientinfo?.MIDDLE_NAME} {Clientinfo?.LAST_NAME}
                </strong>
            </td>
            <td>
                Student Date of Birth
                <br />
                <strong>{Clientinfo?.DATE_OF_BIRTH}</strong>
            </td>
        </tr>
        <tr>
            <td>
                Student E-mail
                <br />
                <strong>{Clientinfo?.EMAIL}</strong>
            </td>
            <td>
                Student Contact No.
                <br />
                <strong>{Clientinfo?.PHONE_NUMBER}</strong>
            </td>
        </tr>
        <tr>
            <td>
                Country of Citizenship
                <br />
                <strong>{Clientinfo?.COUNTRY_OF_CITIZENSHIP}</strong>
            </td>
            <td>
                Student Marital Status
                <br />
                <strong>{Clientinfo?.MARITAL_STATUS ? Clientinfo?.MARITAL_STATUS : '-'}</strong>
            </td>
        </tr>
        <tr>
            <td>
                Agent Name
                <br />
                <span id="counsellor_email">
                    <strong>{Clientinfo?.AGENT_NAME}</strong>
                </span>
            </td>
            <td>
                Communication Number
                <br />
                <span id="counsellor_no">
                    <strong>{Clientinfo?.AGENT_CONTACT_NO}</strong>
                </span>
            </td>
        </tr>
        <tr>
            <td colSpan={2}>
                Communication Email-ID
                <br />
                <span id="counsellor_no">
                    <strong>{Clientinfo?.AGENT_CONTACT_NO}</strong>
                </span>
            </td>
        </tr>
    </tbody>
</table>

                        </div>
                    </div>

                    {isModalOpen ? <Fullview isOpen={isModalOpen} onClose={closeModal} client_id={Clientinfo.UUID} encrypt_id={Clientinfo.CLIENT_ID} /> : ''}
                </>
            ) : (
                <Blank />
            )}
        </>
    );
};

export default Infomation;
