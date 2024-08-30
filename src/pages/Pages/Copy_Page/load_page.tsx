import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate, NavLink } from "react-router-dom";
import "./style.css";
interface Variants {
  variant: "solid" | "underlined" | "bordered" | "light" | undefined;
}
import CreateButton from "../button/create_button";
import FormControl from "@mui/joy/FormControl";
import Stack from "@mui/joy/Stack";
import Autocomplete from "@mui/joy/Autocomplete";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import FormTab from "../Helper/Tab";
import DragAndDrop from "../Helper/Drag_drop";
import { generateJWT } from "../../JWT";
import { GetUserAPI } from "../../../APIurl/url";
import Modals from '../../Users/Profile';

import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
export default function LoadPage() {
  const navigate = useNavigate();
  const { page_name } = useParams();

  const [Refresh, setrefresh] = useState(false);
  const [PageName, SetPagename] = useState("");
  const [isloader, setloader] = useState(true);
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
            PAGE_REQUEST: "CRM_Form_Data",
            FormID: page_name,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            if (
              data &&
              data.data &&
              data.data.FORM_NAME &&
              data.data.FORM_NAME.trim() !== ""
            ) {
              setloader(false);
              SetPagename(data.data.FORM_NAME);
            } else {
              navigate("/not-found");
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [Refresh]);

  return (
    <>
      {isloader ? (
         null
      ) : (
        <>
          <div className="flex flex-wrap gap-12 card-white">
            <ul className="list" id="table-list">
              <li className="list-name font-medium text-lg-200 text-black-color" title="Lead">
                Lead
              </li>
              <li className="list-name font-thin font-medium text-lg-200 text-black-color" title="Deal">
                <NavLink to="/deal/karban/category/1">
                   Deal
                </NavLink>
              </li>
              {/* <li className="list-name font-thin font-medium text-lg-200" title="Contact">
                Contact
              </li>

              <li className="list-name font-thin font-medium text-lg-200" title="Analytics Data">
                <Dropdown backdrop="blur">
                  <DropdownTrigger>
                    <Button 
                    is="true"
                    style={{backgroundColor:'transparent' , border:'none'}}
                    >
                    Analytics Data
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu variant="faded" aria-label="Static Actions">
                    <DropdownItem key="new">Lead Analytics</DropdownItem>
                    <DropdownItem key="copy">Dead Analytics</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li> */}

            </ul>
          </div>

          <div className="header mt-5">
            <ul className="header-content">
              <li className="header-name header-heading mr-10 text-white font-weight-200">{PageName}</li>
              <li className="header-name button-section ml-10">
                <CreateButton />
              </li>
              {/* <li className="header-name" style={{ marginLeft: "2%" }}>
                <Stack spacing={2} sx={{ width: 700 }} className={`light-white-200 white-bg-next-div`}>
                  <FormControl id="free-solo-2-demo ">
                    <Autocomplete
                      placeholder="Search anything"
                      type="search"
                      freeSolo
                      disableClearable
                      options={top100Films.map((option) => option.title)}
                    />
                  </FormControl>
                </Stack>
              </li> */}
              {/* <li className="header-name  ml-2">
                <Box
                  sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                  style={{ width: "40px" }}
                >
                <Button startDecorator={<Add />} style={{background:'#f3f3f347'}}></Button>
                </Box>
              </li> */}
              <li className="header-name"></li>
            </ul>
          </div>
          <FormTab />
          <DragAndDrop />
        </>
      )}
    </>
  );
}
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
];
