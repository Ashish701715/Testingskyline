import React, { useState , useEffect} from "react";
import { Card, CardBody, Input, Textarea } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select, SelectItem,
} from "@nextui-org/react";
  import { generateJWT } from "./../Authentication/JWT";
  import { DataInsert } from "../../APIurl/url";
  import { GetUserAPI } from "../../APIurl/url";

  import Swal from 'sweetalert2';
  import withReactContent from 'sweetalert2-react-content';

interface Data {
  COUNTRY_ID: string;
  ID: string;
  COUNTRY_NAME: string;
}
export function AddUniversity() {
  const MySwal = withReactContent(Swal);

  const [responseData, setResponseData] = useState<Data[] | null>(null);
  const [isloading  ,  setloading] = useState(false); 


  useEffect(() => {
    // Generate JWT token
    const payload = { useremail: 'ashish'};
    const secretKey = 'JwtSecret';
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

    const token = generateJWT(payload, secretKey, expiresIn);

    // Fetch user data
    token.then((JwtToken) => {
      const parametter = '?onlyview=true&limit=10&page=1&order=ASC&query=';            
      fetch(GetUserAPI + parametter, {
        method: 'POST',
        body: JSON.stringify({ PAGE_REQUEST: 'Country_list' }),
        headers: {
          'Content-Type': 'application/json',
          'Authenticate': `Bearer ${JwtToken}`
        }
      })
      .then(response => response.json())
      .then(data => {
        setResponseData(data.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
    }).catch((err) => {
      console.log(err)
    });
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Define state variables to store form data
  const [formData, setFormData] = useState({
    universityName: "",
    universityWebsite: "",
    file: null,
    locationAddress: "",
    universityCountry: "",
    description: "",
  });

  // Handle input change
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  
  // Handle file input change
  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      file: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setloading(true)
    // Generate JWT token
    const payload = { useremail: "ashishboostui@gmail.com" };
    const secretKey = "JwtSecret";
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
    const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

    try {
      // Generate JWT token
      const JwtToken = await generateJWT(payload, secretKey, expiresIn);

      // Create form data object
      const formDataToSend = new FormData();
      formDataToSend.append("universityName", formData.universityName);
      formDataToSend.append("universityWebsite", formData.universityWebsite);
      if (formData.file !== null) {
        formDataToSend.append("filename", formData.file);
      }
      formDataToSend.append("locationAddress", formData.locationAddress);
      formDataToSend.append("universityCountry", formData.universityCountry);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("PAGE_REQUEST", 'InsertUniveristyData');

      const parametter = "?prequest=insertdata&form=task&refresh=false";
      const response = await fetch(DataInsert + parametter, {
        method: "POST",
        body:formDataToSend,
        headers: {
           Authenticate: `Bearer ${JwtToken}`,
        },
      });
      const data = await response.json();
      setloading(false);
      if(data.status==true)
        {
          MySwal.fire({
            title: 'The University Details Have Been Successfully Added',
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            showCloseButton: true,
            customClass: {
                popup: `color-primary`,
            },
            width:'100%'
          });

          setFormData(
            {
              universityName: "",
              universityWebsite: "",
              file: null,
              locationAddress: "",
              universityCountry: "",
              description: "",
            }
          )
        }else{
          MySwal.fire({
            title: data.message,
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 2000,
            showCloseButton: true,
            customClass: {
                popup: `color-danger`,
            },
            width:'100%'
          });
        }
      

    } catch (error) {
      setloading(false)
      console.error("Error fetching user data:", error);
    }
  };

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          variant="flat"
          color="warning"
          onPress={handleOpen}
          className="capitalize"
        >
          modal
        </Button>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose} size="5xl">
        {/* University form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <ModalContent>
            <>
              <ModalHeader className="flex flex-col gap-1 font-black text-2xl">
                Add University:
              </ModalHeader>
              <ModalBody>
                {/* Form components */}
                <Card>
                  <CardBody>
                    <div className="grid grid-cols-3">
                      <div className="w-[100%] p-2 pt-0 mb-0">
                        <Input
                          isRequired
                          type="text"
                          label="University Name"
                          name="universityName"
                          value={formData.universityName}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                      </div>
                      <div className="w-[100%] p-2 pt-0 mb-0">
                        <Input
                          isRequired
                          type="text"
                          label="University Website"
                          name="universityWebsite"
                          value={formData.universityWebsite}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                      </div>
                      <div className="w-[100%] p-2 pt-0 mb-0">
                        <Input
                          isRequired
                          type="text"
                          label="Location Address"
                          name="locationAddress"
                          value={formData.locationAddress}
                          onChange={handleInputChange}
                          variant="bordered"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 mt-5">
                      <div className="formfile w-[100%] p-2 pt-0 mb-0">
                        <input
                          required
                          type="file"
                          onChange={handleFileChange}
                          className="relative w-full inline-flex tap-highlight-transparent shadow-sm px-3 border-medium border-default-200 data-[hover=true]:border-default-400 group-data-[focus=true]:border-default-foreground min-h-unit-10 rounded-medium flex-col items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-14 py-2"
                        />
                      </div>
                      <div className="w-[100%] p-2 pt-0 mb-0">
                        
                        <Select
                         isRequired
                          items='column'
                          variant="bordered"
                          label="Univeristy County"
                          name="universityCountry"
                          value={formData.universityCountry}
                          onChange={handleInputChange}
                        >
                          {responseData ? (
                              responseData.map((item: Data) => (
                                <SelectItem key={item.COUNTRY_ID} value={item.ID}>
                                  {item.COUNTRY_NAME}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem key={0} isDisabled={true}>
                                 Not
                              </SelectItem>
                            )}

                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 mt-1">
                      <div className="mt-5 p-2 pt-0">
                        <Textarea
                          variant="bordered"
                          label="Description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter your description"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Form components */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} isDisabled={isloading}>
                  Close
                </Button>
                <Button color="primary" type="submit" isDisabled={isloading}>
                  {isloading ? 'Is Loading...' : 'Add University'}
                </Button>

              </ModalFooter>
            </>
          </ModalContent>
        </form>
        {/* End university form */}
      </Modal>
    </>
  );
}

export default AddUniversity;
