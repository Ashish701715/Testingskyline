import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Avatar } from 'primereact/avatar';
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { useEffect, useRef} from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import  { createFilterOptions } from "@mui/material/Autocomplete";
import InputLabel from "@mui/material/InputLabel";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import { Divider } from "@nextui-org/react";
import "flatpickr/dist/flatpickr.css";
import { useDispatch, useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {ScrollShadow } from "@nextui-org/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../css/Deal.css';
import { GetUserAPI } from "../../APIurl/url";
import { INSERTDATA } from "../../APIurl/url";
import { generateJWT } from "../../pages/JWT";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom"
import {Textarea} from "@nextui-org/react";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import {Checkbox} from "@nextui-org/react";
//Stage Data import 
import STAGE from '../../pages/Pages/API_HELPER/STAGE'; 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ProductsService  from '../Helper/product';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import withReactContent from 'sweetalert2-react-content';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FilmOptionType {
    inputValue?: string;
    title: string;
    year?: number;
  }


const filter = createFilterOptions<FilmOptionType>();
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
  
  interface EmailInput {
    emailAddress: string;
    emailType: string;
  }
  
  type E164Number = string;

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

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function ButtonMoad()
{

 
  // date picker 

  const dispatch = useDispatch();
  const isRtl =
    useSelector((state: any) => state.themeConfig.rtlClass) === "rtl"
      ? true
      : false;
  const [date1, setDate1] = useState<any>(new Date());

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [value, setValue] = React.useState<FilmOptionType | null>(null);
  const [isOpen, onOpen] = useState(true);
  function onOpenChange() {
    if (isOpen == true) {
      onOpen(false);
    } else {
      onOpen(true);
    }
  }

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
  

  const [DealSource, setDealSource] = useState<string>("");
  const handleChangeDealSource = (event: SelectChangeEvent<string>): void => {
    setDealSource(event.target.value);
  };
  
  const [DealStage, setDealSatge] = useState<string>("");
  const handleChangeDealstage = (event: SelectChangeEvent<string>): void => {
    setDealSatge(event.target.value)
  };


  const handleFormReset = () => {
    setDealSource("");
    setDealSatge("");
    setPhoneInputs([{ phoneNumber: "", phoneType: "" }]);
    setEmailInputs([{ emailAddress: "", emailType: "" }]);
    setValue(null);
    setCurrency("");
    setValues("");
  };


  const USER_ID = localStorage.getItem('SID') ?? '0';
  const MySwal = withReactContent(Swal);
  //Form Heandling functions
  const [isLoading , setLoading] = useState<boolean>(false);   
  const HeandleFormData = async (event:any) =>{
    setLoading(true)
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append('PAGE_REQUEST', 'INSERT_DEAL_DATA');
    formData.append('USER_ID', USER_ID);

    
          const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
          const secretKey = "JwtSecret";
          const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
          const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
          const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
          const token = await generateJWT(payload, secretKey, expiresIn);
    
          const response = await fetch(INSERTDATA + '?action=insert-deal-data', {
            method: 'POST',
            headers: {
              'Authenticate': `Bearer ${token}`,
            },
            body:formData
          });
          const data = await response.json();
          if (data.status == true) {
            setLoading(false);
            setVisible(false)
            Swal.fire({
              title: data.message,
              icon: "success"
            });
          } else {
            setLoading(false);
            setVisible(false)
            Swal.fire({
              title: data.message,
              icon: "success"
            });
          }
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
    const stageData = STAGE
    const [ FORM_SOURCE , SET_SOURCE ] =  useState([]); 
    useEffect(() => {
      const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
      const secretKey = "JwtSecret";
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
      const token = generateJWT(payload, secretKey, expiresIn);
      token
        .then((JwtToken) => {
          fetch(GetUserAPI+'?view=application-source-list', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authenticate: `Bearer ${JwtToken}`,
            },
            body: JSON.stringify({
              PAGE_REQUEST: "APPLICATION_FROM_SOURCE",
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              SET_SOURCE(data.data);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }, []);


    const [ FORM_STAGE_STATUS , SET_FORM_STAGE_STATUS ] =  useState([]); 
    const { category_id } = useParams();
    useEffect(() => {
      const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
      const secretKey = "JwtSecret";
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
      const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
      const token = generateJWT(payload, secretKey, expiresIn);
      token
        .then((JwtToken) => {
          fetch(GetUserAPI+'?view=application-source-list', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authenticate: `Bearer ${JwtToken}`,
            },
            body: JSON.stringify({
              PAGE_REQUEST: "APPLICATION_FROM_STATUS",
              DEPARTMENT_UID:category_id
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              SET_FORM_STAGE_STATUS(data.data);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }, []);

    const [visible, setVisible] = useState<boolean>(false);

    const [ DealTypeChange , setDealTypeChange] = useState('');
    const handleDealTypeChange = (event:any) => {
      setDealTypeChange(event.target.value);
    };
     

  const [tabvalue, setValuetab] = useState(0);
  const handleChangeTab = (event:any, newValue:any) => {
    setValuetab(newValue);
  };

    const customHeader = (
        <Tabs  value={tabvalue} onChange={handleChangeTab} aria-label="basic tabs example">
          <Tab label="general" value={0}  {...a11yProps(0)} />
          <Tab label="Products" value={1} {...a11yProps(1)} />
          <Tab label="history"   {...a11yProps(2)} disabled />
        </Tabs>
  );

    return(
        <>
            <button type="button" className="btn btn-primary background-yellow-green" onClick={()=>setVisible(true)}>CREATE</button>
            <div className="card flex justify-content-center">
            <Sidebar header={customHeader}  position="right" className="md:w-[50%] lg:w-[50%] Deal-Peding-section" visible={visible} onHide={() => setVisible(false)} >
                {/* Deal Form Start Div */}
                <form onSubmit={HeandleFormData} id="FomrId" className="form-copy" >
                    <ScrollShadow hideScrollBar className="w-[100%] h-[85vh] background-light-black scroll-shadow-none p-2">
                        {tabvalue == 0 ? (
                            <div className="max-w-[100%] w-full flex items-center gap-3">
                            <Card className="w-[100%] border box-shadow-card  border-radius-17 margin-12 ">
                                <CardContent className="w-[100%]">
                                <span className="font-bold uppercase text-xs">About Section</span>
                                <Divider className="my-4" />
                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12}>
                                      <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Deal type</InputLabel>
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Deal type"
                                          value={DealTypeChange}
                                          name='DEAL_TYPE'
                                          onChange={handleDealTypeChange}
                                          required
                                        >
                                          <MenuItem value="null">Not selected</MenuItem>
                                          <MenuItem value="Student Visa">Student Visa</MenuItem>
                                          <MenuItem value="Visitor Visa">Visitor Visa</MenuItem>
                                          <MenuItem value="OWP">OWP</MenuItem>
                                          <MenuItem value="Dependent Case">Dependent Case</MenuItem>
                                          <MenuItem value="PR">PR</MenuItem>
                                          <MenuItem value="Business">Business</MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                </Grid>

                              
                                <Grid container spacing={3}>
                                  <Grid xs={12} md={12}>
                                  <Textarea
                                      label="Source Information"
                                      placeholder="Enter your Source Information"
                                      variant="bordered"
                                      className="w-full"
                                      name='DealSource'
                                    />
                                  </Grid>
                                </Grid>


                                  <Grid container spacing={3}>
                                    <Grid xs={12} md={12}>
                                      <label htmlFor="" className='font-normal text-sm'>Starting Date</label>
                                      <Flatpickr name='startingDate' value={date1} options={{ dateFormat: 'Y-m-d'}} className="form-input date-picker" onChange={(date) => setDate1(date)} />
                                    </Grid>
                                  </Grid>

                                {/* amount input */}
                                

                                <Grid container spacing={3}>
                                    <Grid xs={12} md={12}>
                                    <label htmlFor="" className='font-normal text-sm'>Comment</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={editorData}
                                        onChange={handleEditorChange}
                                    />
                                    <input type="hidden" name="DEAL_COMMENT" value={editorData} />
                                    </Grid>
                                </Grid>


                                <Grid container spacing={3}>
                                  <Grid xs={12} md={12}>
                                  <TextField
                                      required
                                      name="CLIENT_NAME"
                                      id="outlined-basic"
                                      label="Client Name"
                                      placeholder="Enter Name"
                                      variant="outlined"
                                      className="w-[100%]"
                                  />
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
                                                onChange={(phoneNumber:any) =>
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
                                    className="underline text-primary ml-0 
                                    mb-2 mt-1 mb-5"
                                    onClick={addMoreEmailSection}
                                    >
                                    Add More
                                    </a>
                                </Grid>


                                <Grid container spacing={3} className='mb-2'>
                                  <Grid xs={12} md={12} >
                                  <TextField
                                      required
                                      name="ADREESS"
                                      id="outlined-basic"
                                      label="Client Address"
                                      placeholder="Enter Name"
                                      variant="outlined"
                                      className="w-[100%]"
                                      style={{marginBottom:'10px'}}
                                  />
                                  </Grid>
                                </Grid>

                                <Grid container spacing={3} className='mb-2'>
                                  <Grid xs={12} md={12} >
                                  <TextField
                                      required
                                      name="REFRENCE"
                                      id="outlined-basic"
                                      label="Reference"
                                      placeholder="Enter Name"
                                      variant="outlined"
                                      className="w-[100%]"
                                      style={{marginBottom:'10px'}}
                                  />
                                  </Grid>
                                </Grid>

                                <Grid container spacing={3} >
                                    <Grid xs={12} md={12}>
                                        <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Deal Source
                                        </InputLabel>
                                        <Select
                                            name="DEAL_SOURCE"
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={DealSource}
                                            label="Deal Source"
                                            onChange={handleChangeDealSource}
                                        >
                                        
                                          {FORM_SOURCE.map((stage: any, index: number) => (
                                                <MenuItem key={stage.SOURCE_NAME} value={stage.SOURCE_NAME}>{stage.SOURCE_NAME}</MenuItem>
                                          ))}
                                        </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid xs={12} md={12}>
                                        <label htmlFor="" className='font-style' >Enquire</label>
                                        <TextField    name='EnquireForm' id="outlined-basic" type="file" variant="outlined" className="bg-file-color" />
                                    </Grid>

                                    <Grid xs={12} md={12}>
                                        <label htmlFor="" className='font-style' > Upload Photo </label>
                                        <TextField    name="Photo"  id="outlined-basic" type="file" variant="outlined" className="bg-file-color" />
                                    </Grid>
                                    <Grid xs={12} md={12}>
                                        <label htmlFor="" className='font-style' > Upload New File </label>
                                        <TextField  name='NewFile' id="outlined-basic" type="file" variant="outlined" className="bg-file-color" />
                                    </Grid>
                                  
                                    <Grid xs={12} md={12}>
                                        <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Deal  Stage
                                        </InputLabel>
                                        <Select
                                            required
                                            name ='DEAL_STAGE'
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={DealStage}
                                            label="Deal Stage"
                                            onChange={handleChangeDealstage}
                                        > 
                                            {FORM_STAGE_STATUS.map((stage: any, index: number) => (
                                                <MenuItem key={stage.ID} value={stage.ID}>{stage.STAGE_NAME}</MenuItem>
                                            ))}
                                        </Select>
                                        <input type="hidden" name='DEAL_CATEGORY' value={category_id} />
                                        </FormControl>
                                        <Checkbox defaultSelected className='mt-2 font-style' name='see_everyone'>Available to everyone</Checkbox>
                                    </Grid>
                                </Grid>
                                </CardContent>
                            </Card>
                            </div>
                          ) : (
                            <ProductsService />
                          )}
                    </ScrollShadow>

                    <footer className='absolute inset-x-0 bottom-0 h-16 border w-[100%] background-white'>
                        <div className='flex justify-center mt-2'>
                            {(isLoading) ? (
                              <LoadingButton
                                loading
                                loadingPosition="start"
                                className='h-[80%] '
                                startIcon={<SaveIcon />}
                                variant="outlined"
                                style={{margin:'3px'}} 
                              >
                                Saving...
                              </LoadingButton>
                            ) : (
                              <Button variant="contained" className='m-2 green-button' type='submit' style={{margin:'3px'}} >
                                SAVE
                              </Button>
                            )}
                           <Button variant="contained" className='m-2 danger-button'  onClick={() => setVisible(false)}  style={{margin:'3px'}} >CANCEL</Button>
                        </div>
                    </footer>

                </form>
            </Sidebar>
            <button  onClick={() => setVisible(true)} />
        </div>
        </>
    );
}