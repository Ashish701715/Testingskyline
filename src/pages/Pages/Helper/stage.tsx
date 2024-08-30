import React, { useEffect, useState } from "react";
import { GETDATA } from "../../../APIurl/url";
import { UPDATE } from "../../../APIurl/url";
import { generateJWT } from "../../JWT";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
export default function StageData() {
    const { FormID, EncryptId, SerialId } = useParams();
    const [StageData, setLeadSatge] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [hoveredClass, setHoveredClass] = useState('');
    const [currentclass, setCurrentclass] = useState('');
    const [currnectIndex , setCurrentIndex] = useState(-1)
    useEffect(() => {
        let url = `view=comment&edit=true$delete=true&auth=true`;
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((JwtToken) => {
            fetch(GETDATA + '?action=view-stage-data&auth=true&view=true&edit=false', {
                method: "POST",
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'GET_STAGE_DATA_STATUS',
                    FORM_ID: FormID,
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setLeadSatge(data.data)
            })
        }).catch((err) => {
            console.warn(err);
        })
    }, []);

    const handleHover = (index:any, className:any) => {
        setHoveredIndex(index);
        setHoveredClass(className);
    };
    function UpdateLeadStage(index:any , currect_stage:any)
    {
        setHoveredClass(currect_stage.CLASS);
        setCurrentclass(currect_stage.CLASS);
        setCurrentIndex(index)
        const STAGE_ID  = currect_stage.STAGE_ID;
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = generateJWT(payload, secretKey, expiresIn);

        token.then((JwtToken) => {
            fetch(UPDATE + '?action=update-stage-data&auth=true&view=true&edit=false', {
                method: "POST",
                headers: {
                    Authenticate: `Bearer ${JwtToken}`,
                },
                body: JSON.stringify({
                    PAGE_REQUEST: 'UPDATE_STAGE_DATA_STATUS',
                    CURRENT_STAGE: STAGE_ID,
                    SERIAL_ID:SerialId,
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                if(data.status==true)
                {
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        showCloseButton: true,
                        customClass: {
                            popup: `color-defalut`,
                        },
                    });
                    toast.fire({
                        title: data.message,
                    });
                }else{
                    const toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        showCloseButton: true,
                        customClass: {
                            popup: `color-danger`,
                        },
                    });
                    toast.fire({
                        title: data.message,
                    });
                }
            })
        }).catch((err) => {
            console.warn(err);
        })
    }

    return (
        <>
            <div className="statusbar">
                <div className="status-list">
                    <ul className="nav flex m-3">
                        {StageData.map((value:any, index) => (
                            <li className="nav-item" key={index}>
                                <a
                                    className={`font-sans font-medium hover:text-white nav-link stage-list  ${currnectIndex >= index ? currentclass : ''} ${hoveredIndex >= index ? hoveredClass : 'stage-list-default'} `}
                                    aria-current="page"
                                    href="#"
                                    onMouseEnter={() => handleHover(index, value.CLASS)}
                                    onMouseLeave={() => { setHoveredIndex(-1); setHoveredClass(''); }}
                                    onClick={()=>{UpdateLeadStage(index , value)}}
                                >
                                    {value.STAGE_NAME}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
