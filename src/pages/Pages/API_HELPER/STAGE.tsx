import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { generateJWT } from "../../JWT";
import { GetUserAPI } from "../../../APIurl/url";

function GetStage() {
  const { page_name } = useParams();
  const [Refresh, setRefresh] = useState(false);
  const [stageData, setStageData] = useState([]);

  useEffect(() => {
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

    const token = generateJWT(payload, secretKey, expiresIn);
    token
      .then((JwtToken) => {
        fetch(GetUserAPI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authenticate: `Bearer ${JwtToken}`,
          },
          body: JSON.stringify({
            PAGE_REQUEST: "CRM_Form_Stage",
            FormID: page_name,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setStageData(data.data);
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [Refresh]);

  return stageData;
}

export default GetStage;
