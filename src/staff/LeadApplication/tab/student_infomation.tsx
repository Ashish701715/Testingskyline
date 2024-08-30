import Blank from '../tab/blank';
const Infomation = ({ Clientinfo }: any) => {
    return (
        <>
            {Clientinfo.UUID ? (
                <div className="tab-pane white_table_sec table_blue_border active" id="student_Details">
                    <div className="table-responsive">
                        <table className="table table-striped student-details-tables">
                            <tbody>
                                <tr>
                                    <td>
                                        STUDENT ID
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
                                        STUDENT PASSPORT NO.
                                        <br />
                                        <strong>{Clientinfo?.PASSPORT_NUMBER}</strong>
                                    </td>
                                    <td>
                                        STUDENT EXPIRE
                                        <br />
                                        <strong>{Clientinfo?.PASSPORT_EXPIRY_DATE}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        STUDENT NAME
                                        <br />
                                        <strong>
                                            {Clientinfo?.FIRST_NAME} {Clientinfo?.MIDDLE_NAME} {Clientinfo?.LAST_NAME}
                                        </strong>
                                    </td>
                                    <td>
                                        STUDENT DATE OF BIRTH
                                        <br />
                                        <strong>{Clientinfo?.DATE_OF_BIRTH}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        STUDENT E-MAIL
                                        <br />
                                        <strong>{Clientinfo?.EMAIL}</strong>
                                    </td>
                                    <td>
                                        STUDENT CONTACT NO.
                                        <br />
                                        <strong>{Clientinfo?.PHONE_NUMBER}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        COUNTRY OF CITIZENSHIP
                                        <br />
                                        <strong>{Clientinfo?.COUNTRY_OF_CITIZENSHIP}</strong>
                                    </td>
                                    <td>
                                        STUDENT MARITAL STATUS
                                        <br />
                                        <strong>{Clientinfo?.MARITAL_STATUS ? Clientinfo?.MARITAL_STATUS : '-'}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        AGENT NAME
                                        <br />
                                        <span id="counsellor_email">
                                            <strong>{Clientinfo?.AGENT_NAME}</strong>
                                        </span>
                                    </td>
                                    <td>
                                        COMMUNICATION NUMBER
                                        <br />
                                        <span id="counsellor_no">
                                            <strong>{Clientinfo?.AGENT_CONTACT_NO}</strong>
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        COMMUNICATION EMAIL-ID
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
            ) : (
                <Blank />
            )}
        </>
    );
};

export default Infomation;
