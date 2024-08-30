import React, { useState ,useEffect} from "react";
import { ScrollShadow, Input, Divider, Checkbox , Spinner} from "@nextui-org/react";
import { GetUserAPI } from "../../../APIurl/url";
import generateJWT  from '../../../getLoggedUser/GetUserInfomation';
import './style.css';
interface Country {
    ID: number;
    UNIVERISTY_NAME: string;
    COUNTRY_NAME:string;
    COUNTRY_FLAG:string;
}
export default function country()
{    
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [loaded, setLoaded] = useState(true);
    const handleShowAll = () => {
        setShowAll(!showAll);
    };
    const countries = [
        { id: 1, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 2, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 3, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 4, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 5, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 6, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 7, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
        { id: 8, name: 'India', imageUrl: 'https://seeklogo.com/images/I/Indian_Flag-logo-19B702FA68-seeklogo.com.png' },
    ];
    
    const itemsToShow = showAll ? countries.length : 3;
    const hiddenCount = countries.length - itemsToShow;
    const [Countrydata, setCountry] = useState<Country[]>([]);

    /*########################{  Country list Data fetch start section  }##################*/ 

    useEffect(() => {
        const payload = { useremail: "ashishboostui@gmail.com" };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 30;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;

        const getUniversityData = async () => {
            setLoaded(true);
            try {
                const JwtToken = await generateJWT('jwt');
                const response = await fetch(GetUserAPI, {
                    method: "POST",
                    body: JSON.stringify({
                        "PAGE_REQUEST": 'Country_list'
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authenticate': `Bearer ${JwtToken}`
                    }
                });
                const data = await response.json();
                setCountry(data.data);
                setLoaded(false);
            } catch (error) {
                console.error(error);
                setLoaded(false);
            }
        };

        getUniversityData();
    }, []);


    /*########################{  Country list Data fetch end section  }##################*/ 

    const filteredCountries = Countrydata.filter(country =>
        country.COUNTRY_NAME.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const handleCheckboxChange = (ID: number) => {
        if (selectedItems.includes(ID)) {
            setSelectedItems(selectedItems.filter(item => item !== ID));
        } else {
            setSelectedItems([...selectedItems, ID]);
        }
    };

    return(
        <>
        <Input
            type="search"
            variant="bordered"
            placeholder="Search University"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Divider className="mb-3 mt-1"/>
        <div className="country-list">
            <ul className="country" style={{ position: 'relative'}}>
                {loaded && (
                    <div style={{ position: 'absolute', top: '100%', left: '40%', transform: 'translate(0%, 0%)' }}>
                        <Spinner />
                    </div>
                )}
                {!loaded && (
                    filteredCountries.slice(0, itemsToShow).map(country => (
                        <li key={country.ID} className="mb-5 border-lable" >
                            <Checkbox
                                aria-label={country.COUNTRY_NAME}
                                classNames={{
                                    base: "-m-0 inline-flex w-full max-w-md bg-content1 hover:bg-content2 items-center justify-start cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                                    label: "w-full ",
                                }}
                                isSelected={selectedItems.includes(country.ID)}
                                onValueChange={() => handleCheckboxChange(country.ID)}
                            >
                                <div className="w-full flex justify-between gap-2">
                                    <div className="box-img">
                                        <img src={country.COUNTRY_FLAG} className="w-[40px]" alt={country.COUNTRY_NAME}/>
                                    </div>
                                    {country.COUNTRY_NAME}
                                </div>
                            </Checkbox>
                        </li>
                    ))
                )}
            </ul>
            {Countrydata.length > 3 && (
                <button onClick={handleShowAll} className="text-blue-500 font-bold">
                    {showAll ? `Show Less (${hiddenCount} hidden)` : `Show ${hiddenCount} More`}
                </button>
            )}
        </div>
    </>
    );
}
