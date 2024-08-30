import "./style.css";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState , useRef} from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import  { createFilterOptions } from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@nextui-org/react";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import "flatpickr/dist/flatpickr.css";
import { useDispatch, useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {ScrollShadow , Button} from "@nextui-org/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Avatar from '@mui/material/Avatar';
import {Skeleton} from "@nextui-org/react";
const filter = createFilterOptions<FilmOptionType>();

import { GetUserAPI } from "../../../APIurl/url";
import { INSERTDATA } from "../../../APIurl/url";
import { generateJWT } from "../../JWT";
import Swal from 'sweetalert2';
//Stage Data import 
import STAGE from '../API_HELPER/STAGE'; 




//avatar color

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}


interface Client {
  CLIENT_ID: string;
  CLIENT_FIRST_NAME: string;
  C_LAST_NAME: string;
  PHONE_NUMBER: string;
}

interface Contact {
  CLIENT_FIRST_NAME: string;
  C_LAST_NAME: string;
}

interface CKEditorWithAttributesProps {
  name: string;
  onChange: (event: any, editor: any) => void;
}
// Icon Bar
import { ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { NavLink } from "react-router-dom";
interface EmailInput {
  emailAddress: string;
  emailType: string;
}

type E164Number = string;
export default function App({onOpenChange}:any) {

  const dispatch = useDispatch();
  const isRtl =
    useSelector((state: any) => state.themeConfig.rtlClass) === "rtl"
      ? true
      : false;
  const [date1, setDate1] = useState<any>("2022-07-05");

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  // currnecy input change
  const [currency, setCurrency] = useState("");
  function handleInputChange(event: any) {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^\d.]/g, ""); // Allow digits and dot
    const numberValue = parseFloat(numericValue);

    if (!isNaN(numberValue)) {
      const formattedCurrency = numberValue.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      });
      setCurrency(formattedCurrency);
    } else {
      setCurrency("");
    }
  }

  const [values, setValues] = useState<E164Number | undefined>("");

  const [phoneInputs, setPhoneInputs] = useState([
    { phoneNumber: "", phoneType: "" },
  ]);

  const handleChange = (index: any, phoneNumber: any) => {
    const newPhoneInputs = [...phoneInputs];
    newPhoneInputs[index].phoneNumber = phoneNumber;
    setPhoneInputs(newPhoneInputs);
  };

  const handleChangePhoneType = (index: any, event: any) => {
    const newPhoneInputs = [...phoneInputs];
    newPhoneInputs[index].phoneType = event.target.value;
    setPhoneInputs(newPhoneInputs);
  };

  const AddMorePhoneSection = () => {
    setPhoneInputs([...phoneInputs, { phoneNumber: "", phoneType: "" }]);
  };

  const RemovePhoneSection = (indexToRemove: number) => {
    setPhoneInputs((prevPhoneInputs) =>
      prevPhoneInputs.filter((_, index) => index !== indexToRemove)
    );
  };

const [emailInputs, setEmailInputs] = useState<EmailInput[]>([
    { emailAddress: "", emailType: "" },
  ]);

  // Handler for changing email type
  const handleChangeEmail = (index: number, newEmail: string): void => {
    setEmailInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, emailAddress: newEmail } : input
      )
    );
  };
  
  const handleChangeEmailType = (
    index: number,
    newEmailType: string
  ): void => {
    setEmailInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, emailType: newEmailType } : input
      )
    );
  };
  
  // Handler for adding a new email section
  const addMoreEmailSection = (): void => {
    setEmailInputs((prevInputs) => [
      ...prevInputs,
      { emailAddress: "", emailType: "" },
    ]);
  };
  
  // Handler for removing an email section
  const removeEmailSection = (indexToRemove: number): void => {
    setEmailInputs((prevInputs) =>
      prevInputs.filter((_, index) => index !== indexToRemove)
    );
  };
  

  const [leadSource, setLeadSource] = useState<string>("");
  const handleChangeLeadSource = (event: SelectChangeEvent<string>): void => {
    setLeadSource(event.target.value);
  };
  
  const [leadStage, setLeadSatge] = useState<string>("");
  const handleChangeLeadstage = (event: SelectChangeEvent<string>): void => {
    setLeadSatge(event.target.value);
  };


  const handleFormReset = () => {
    setLeadSource("");
    setLeadSatge("");
    setPhoneInputs([{ phoneNumber: "", phoneType: "" }]);
    setEmailInputs([{ emailAddress: "", emailType: "" }]);
    setValue(null);
    setCurrency("");
    setValues("");
  };

  //Form Heandling functions
  const [isLoading , setLoading] = useState<boolean>(false);   
  const HeandleFormData = (event:any) =>{
    setLoading(true)
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('PAGE_REQUEST' ,'LeadFormSubmit');
    const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
    const token = generateJWT(payload, secretKey, expiresIn);
    token
      .then((JwtToken) => {
        fetch(INSERTDATA, {
          method: "POST",
          headers: {
            Authenticate: `Bearer ${JwtToken}`,
          },
          body:formData
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setLoading(false)
            if(data.status==true)
              {
                Swal.fire({
                    icon: 'success',
                    title: 'success',
                    padding: '2em',
                    customClass: 'sweet-alerts',
                }).then((result) => {
                  if (result && result.isConfirmed) {
                      const form = document.getElementById("FomrId") as HTMLFormElement;
                      if (form) {
                        form.reset();
                        handleFormReset();
                      }
                  }
              });
              }else{
                Swal.fire({
                  icon: 'error',
                  title: data.message,
                  padding: '2em',
                  customClass: 'sweet-alerts',
              });
              }
          })
          .catch((err) => {
            setLoading(false)
              Swal.fire({
                icon: 'error',
                title: err,
                padding: '2em',
                customClass: 'sweet-alerts',
            });
          });
      })
      .catch((err) => {
        setLoading(false)
          Swal.fire({
            icon: 'error',
            title: err,
            padding: '2em',
            customClass: 'sweet-alerts',
          });
      });
  
  }


  const [editorData, setEditorData] = useState();

  const handleEditorChange = (event:any, editor:any) => {
    const data = editor.getData();
    setEditorData(data);
  };


  const [options, setOptions] = useState<FilmOptionType[]>([]);
  let timeoutId: NodeJS.Timeout;

  const handleChanges = async (event: React.KeyboardEvent<HTMLDivElement>) => {
    const newValue = (event.target as HTMLInputElement).value;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
        try {
            const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
            const secretKey = "JwtSecret";
            const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
            const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
            const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
            const token = await generateJWT(payload, secretKey, expiresIn);

            const response = await fetch(GetUserAPI + '?get=getclientcontact&isview=true&edit=false', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authenticate': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    'PAGE_REQUEST': 'GET_CLIENTCONTACTDATA',
                    'SEARCHTEXT': newValue
                })
            });
            console.log("Response:", response);
            if (response.ok) {
                const data = await response.json();
                if (data.status === true) {
                  if (Array.isArray(data.data)) {
                     const ArrayData = data.data;
                     ArrayData.map((data:any, index:number) => {
                        setOptions([
                          ...options,
                          {
                              inputValue: data.CLIENT_FIRST_NAME,
                              title: data.PHONE_NUMBER,
                          }
                      ]);
                      
                    });
                } else {
                    throw new Error('Unexpected data format: clientContacts is not an array.');
                }
                } else {
                    throw new Error('Server returned an error.');
                }
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error("Error retrieving data:", error);
        }
    }, 2000);
};

const [showCard, setShowCard] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement)?.closest(".client_add")
      ) {
        setShowCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const toggleCardView = () => {
    setShowCard(true);
  };

  const [clientList, setClientList] = useState<Client[]>([]);
  const [CallApi , setLoader] = useState(false);
  const handleApi = async (event:any) => {
    setLoader(true);
    const newValue = event.target.value;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      try {
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        const token = await generateJWT(payload, secretKey, expiresIn);
  
        const response = await fetch(GetUserAPI + '?get=getclientcontact&isview=true&edit=false', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authenticate': `Bearer ${token}`,
          },
          body: JSON.stringify({
            'PAGE_REQUEST': 'GET_CLIENTCONTACTDATA',
            'SEARCHTEXT': newValue
          })
        });
        const data = await response.json();
        if (data.status === true) {
          setClientList(data.data)
          setLoader(false);
        } else {
          setClientList([])
          setLoader(false);
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        setLoader(false);
      }
    }, 2000);
  };

  //AddClient toggle 

  const [appendContectList, setappendContectList] = useState<Contact[]>([]);
  const [ContacAddTrue,setContacAddTrue] = useState(false);
  
  function SelectClient(event: any) {
    setremoveContacDiv(false);
    setContacAddTrue(false);
    setappendContectList([event]);
  }
  
  function setAddClientInfomation() {
    setremoveContacDiv(false);
    setContacAddTrue(true);
  }
  const [removeContacDiv, setremoveContacDiv] = useState(false);
  function removeContact()
  {
    setremoveContacDiv(true);
  }

  //#Stage List STAGE
  const stageData = STAGE();
  
  return (
    <>
      <form onSubmit={HeandleFormData} id="FomrId" className="form-copy">
        <ScrollShadow hideScrollBar className="w-[100%] h-[90vh] background-light-black">
            <ModalHeader className="flex flex-col gap-1">
                <span className="font font-600">New Lead</span>
                <ul className="list-section">
                   <li className="font-thin">
                      
                   </li>
                </ul>
            </ModalHeader>
            <ModalBody>
                <div className="max-w-[100%] w-full flex items-center gap-3">
                  <Card className="w-[50%] border box-shadow-card  border-radius-17">
                      <CardContent className="w-[100%]">
                      <span className="font-bold uppercase text-xs">About Section</span>
                      <Divider className="my-4" />

                      <Grid container spacing={3}>
                          <Grid xs={12} md={12}>
                          <TextField
                              name="LEAD_NAME"
                              id="outlined-basic"
                              label="Lead Name"
                              placeholder="Lead #"
                              variant="outlined"
                              className="w-[100%]"
                          />
                          </Grid>
                      </Grid>

                        <Grid container spacing={3}>
                          <Grid xs={12} md={12}>
                          <TextField
                              required
                              name="CLIENT_NAME"
                              id="outlined-basic"
                              label="Name"
                              placeholder="Enter Name"
                              variant="outlined"
                              className="w-[100%]"
                          />
                          </Grid>
                        </Grid>


                      {/* amount input */}
                       

                      <Grid container spacing={3}>
                          <Grid xs={12} md={12}>
                          <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={handleEditorChange}
                          />
                          <input type="hidden" name="SOURCE_INFORMATION" value={editorData} />
                          </Grid>
                      </Grid>

                      <Grid container spacing={3} className="flex">
                          <span className="font-normal ml-3 mt-4 underline">Phone</span>
                          {phoneInputs.map((phoneInput, index) => (
                            <div key={index} className="multiple">
                                <Grid xs={6} md={6}>
                                <div className="input-number">
                                  <input
                                    type="hidden"
                                    name={`MOBILE_NUMBER[]`}
                                    value={phoneInput.phoneNumber}
                                  />
                                  <PhoneInput
                                    defaultCountry="IN"
                                    placeholder="Enter phone number"
                                    value={phoneInput.phoneNumber}
                                    onChange={(phoneNumber) =>
                                      handleChange(index, phoneNumber)
                                    }
                                  />
                                </div>
                                </Grid>
                                <Grid xs={5} md={5}>
                                <FormControl fullWidth>
                                    <Select
                                        name={`MOBILE_TYPE[]`}
                                        value={phoneInput.phoneType}
                                        onChange={(event) =>
                                        handleChangePhoneType(index, event)
                                    }
                                    >
                                    <MenuItem value="Work">Work</MenuItem>
                                    <MenuItem value="Mobile">Mobile</MenuItem>
                                    <MenuItem value="Fax">Fax</MenuItem>
                                    <MenuItem value="Home">Home</MenuItem>
                                    <MenuItem value="Pager">Pager</MenuItem>
                                    <MenuItem value="SMS">SMS</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                                </Grid>
                                <Grid xs={1} md={1}>
                                <button
                                    className="btn-style-margin"
                                    onClick={() => RemovePhoneSection(index)}
                                >
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                    >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                        clipRule="evenodd"
                                    />
                                    </svg>
                                </button>
                                </Grid>
                            </div>
                          ))}
                          <a
                          className="underline text-primary ml-3 mb-2 mt-4"
                          onClick={AddMorePhoneSection}
                          >
                          Add More
                          </a>
                      </Grid>

                      <Grid container spacing={3} className="flex">
                        <span className="font-normal ml-3 mt-4 underline">Email</span>
                        {emailInputs.map((emailInput, index) => (
                          <div key={index} className="multiple">
                            <Grid xs={6} md={6}>
                              <TextField
                                name="EMAIL[]"
                                id={`email-${index}`}
                                label="Email Address"
                                type="email"
                                placeholder="Enter Email Address"
                                variant="outlined"
                                className="w-[100%]"
                                value={emailInput.emailAddress}
                                onChange={(e) => handleChangeEmail(index, e.target.value)}
                              />
                            </Grid>
                            <Grid xs={5} md={5}>
                              <FormControl fullWidth>
                                <Select
                                  name="EMAIL_TYPE[]"
                                  labelId={`email-type-label-${index}`}
                                  id={`email-type-${index}`}
                                  value={emailInput.emailType}
                                  onChange={(event) =>
                                    handleChangeEmailType(index, event.target.value)
                                  }
                                >
                                  <MenuItem value="Work">Work</MenuItem>
                                  <MenuItem value="Home">Home</MenuItem>
                                  <MenuItem value="Newsletter">For newsletters</MenuItem>
                                  <MenuItem value="Other">Other</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid xs={1} md={1}>
                              <button
                                className="btn-style-margin"
                                onClick={() => removeEmailSection(index)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </Grid>
                          </div>
                        ))}
                        <a
                          className="underline text-primary ml-3 mb-2 mt-4 mb-2"
                          onClick={addMoreEmailSection}
                        >
                          Add More
                        </a>
                      </Grid>


                      <Grid container spacing={3}>
                          <Grid xs={12} md={12}>
                              <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                  Lead Source
                              </InputLabel>
                              <Select
                                  name="LEAD_SOURCE"
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={leadSource}
                                  label="Lead Source"
                                  onChange={handleChangeLeadSource}
                              >
                                  <MenuItem value="Call">Call</MenuItem>
                                  <MenuItem value="CRM">CRM</MenuItem>
                                  <MenuItem value="Email">Email</MenuItem>
                                  <MenuItem value="Facebook">Facebook</MenuItem>
                                  <MenuItem value="Google Ads">Google Ads</MenuItem>
                                  <MenuItem value="Website">Website</MenuItem>
                                  <MenuItem value="Other">Other</MenuItem>
                              </Select>
                              </FormControl>
                          </Grid>
                          <Grid xs={12} md={12}>
                              <label htmlFor="">Photo</label>
                              <TextField name="CLIENT_PHOTO" id="outlined-basic" type="file" variant="outlined" className="bg-file-color" />
                          </Grid>

                          <Grid xs={12} md={12}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                  Lead  Stage
                              </InputLabel>
                              <Select
                                  required
                                  name ='LEAD_STAGE'
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  value={leadStage}
                                  label="Lead Stage"
                                  onChange={handleChangeLeadstage}
                              > 
                                {stageData.map((stage: any, index: number) => (
                                    <MenuItem key={stage.STAGE_ID} value={stage.STAGE_ID}>{stage.STAGE_NAME}</MenuItem>
                                ))}


                              </Select>
                              </FormControl>
                          </Grid>

                      </Grid>
                      </CardContent>
                  </Card>
                </div>
            </ModalBody>
        </ScrollShadow>
        <ModalFooter className="justify-center border-top">
          <Button color="danger" onClick={onOpenChange}> CANCEL </Button>
          <Button color="primary" type="submit"  isLoading={isLoading} >   {isLoading ? 'Processing...' : 'Create'}  </Button>
        </ModalFooter>
      </form>
    </>
  );
}

interface FilmOptionType {
  inputValue?: string;
  title: string;
  year?: number;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films: readonly FilmOptionType[] = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
];

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
