import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { generateJWT } from '../../pages/JWT';
import { GetUserAPI } from '../../APIurl/url';
import { useSelector } from 'react-redux';
import Dropdown from '../../components/Dropdown';
import Skeleton from '@mui/material/Skeleton';
import { useParams } from "react-router-dom";
interface CategoryItem {
    label: string;
    icon: string;
}

interface OutlinedDemoProps {
  setLoader: (value: boolean) => void;
}

export default function OutlinedDemo({ setLoader }: OutlinedDemoProps) {
   const { category_id } = useParams<{ category_id: any }>();
    const isRtl = useSelector((state:any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const [Categroyes, setCategoryes] = useState<CategoryItem[]>([]);
    const [Refresh, setRefresh] = useState(false);
    const [loader, setLoaders] = useState(true);
    const [currentDep, setcurrentDep] = useState('please wait...');

     useEffect(() => {
        const payload = { REQUEST: "LEAD_PAGE", is_Admin: false, isValid: true };
        const secretKey = "JwtSecret";
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimestampInSeconds = currentTimestampInSeconds + 20;
        const expiresIn = expirationTimestampInSeconds - currentTimestampInSeconds;
        let Default = category_id-1;
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
                PAGE_REQUEST: "GET_DEAL_Category_HISTORY",
                FormID:'lead'
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                setCategoryes(data.data);
                setcurrentDep(data.data[Default]['CATEGORY_NAME']);
                setLoaders(false);
              })
              .catch((err) => {
                setLoaders(false);
                console.error(err);
              });
          })
          .catch((err) => {
            setLoaders(false);
            console.error(err);
          });
      }, [Refresh]);

      function DealChangeStage(event:any)
      {
        setLoaders(true);
        setcurrentDep(event.STAGE_NAME)
        window.location.href=`/deal/karban/category/${event.ID}`;
      }
    return (
        <>
            {(loader)?(
                <Skeleton variant="rectangular" width={210} height={60} className='Skeleton-Bg'/>
            ):(
                <div className="dropdown w-[100%] ">
                    <Dropdown
                            placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                            btnClassName="btn btn-outline-primary  border-black-text-black dropdown-toggle"
                            button={
                                <>
                                {currentDep}
                                </>
                            }
                        >
                        <ul className="!min-w-[250px] h-[80vh] overflow-auto" >
                            {Categroyes.map((value:any, index) => (
                                <li key={index}>
                                <button type="button" className='' onClick={()=>DealChangeStage(value)} key={index}>{value.CATEGORY_NAME}</button>
                                </li>
                            ))}
                        </ul>
                    </Dropdown>
                </div>
            )}
        </>
    )
}
