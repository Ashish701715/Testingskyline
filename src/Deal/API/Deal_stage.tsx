import { generateJWT } from "../../pages/JWT";
import React, { useEffect, useState } from "react";
import { UPDATE } from "../../APIurl/url";
import { GetUserAPI } from "../../APIurl/url";
import { GETDATA } from "../../APIurl/url";
import { useParams  } from "react-router-dom";

export const DealStage = async () => {
    const  {deal_id} = useParams();
    const [StageData, setLeadSatge] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [hoveredClass, setHoveredClass] = useState('');
    const [currentclass, setCurrentclass] = useState('');
    const [currnectIndex , setCurrentIndex] = useState(-1)
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
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
            })
        }).catch((err) => {
            console.warn(err);
        })
    }


    try {
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = await generateJWT(payload, secretKey, expiresIn);
        
        const response = await fetch(GetUserAPI + `?view=karban.deal.view&is_view=true`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authenticate: `Bearer ${token}`,
            },
            body: JSON.stringify({
                PAGE_REQUEST: "karban.data.deal.stage",
                DEAL_ID:deal_id
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return data ;
    } catch (error) {
        console.error(error);
        throw error;
    }


};
