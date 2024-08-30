import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event:any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;


    
    const [amount, setamount ] = useState(0);
    const [Quanatity, setQuanatity ] = useState(0);
    const [TotalAmount, setTotalAmount ] = useState(0);


    function handleKeyUp(event:any)
    {
        setamount(event.target.value);
    }

    function setQuanatitys(event:any) {
        setQuanatity(event.target.value)
    }

    useEffect(() => {
        const Newtotal =  amount*Quanatity;
        setTotalAmount(Newtotal);
    },[Quanatity , amount ]);

  return (
    <>
        <Card className='m-2 border-rounded'>
        
        <table className='m-3 w-[98%]'>
            <tr className='border-bottom'>
                <th className='font-style text-center w-[5px]' >
                    #
                </th>
                <th className='font-style text-start' >
                    product
                </th>
                <th className='font-style w-[30vh]' >
                    Price
                </th>
                <th className='font-style  w-[30vh]' >
                    Quanatity
                </th>
                <th className='font-style  w-[30vh]' >Amount</th>
            </tr>
            <Divider  className='margin-style'/>
            <tr>
                <td className='text-center'>
                    1
                </td>
                <td className='font-style'> 
                  <input type="search" placeholder="Find or create a new product... " className="form-input font-style" required  />
                   <Popover
                        id={id}
                        open={open}
                        className='w-[50%] mt-2 rounded-lg '
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                    >
                        <Card className='rounded-lg '>
                            <div className="product-list">
                                <ul className="products">
                                    
                                </ul>
                            </div>
                        </Card>
                   </Popover>
                </td>
                <td>
                    <div className="flex">
                        <input type="number" placeholder="" onKeyUp={handleKeyUp} className="form-input ltr:rounded-r-none rtl:rounded-l-none flex-1 ltr:rounded-l-md rtl:rounded-r-md" />
                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                            ₹
                        </div>
                    </div>
                </td>

                <td>
                    <div className="flex">
                        <input type="number"   placeholder="" onKeyUp={setQuanatitys}  className="form-input ltr:rounded-r-none rtl:rounded-l-none flex-1 ltr:rounded-l-md rtl:rounded-r-md" />
                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        Pcs
                        </div>
                    </div>
                </td>

                <td>
                    <div className="flex">
                        <input type="number" readOnly placeholder="" className="form-input ltr:rounded-r-none rtl:rounded-l-none flex-1 ltr:rounded-l-md rtl:rounded-r-md" value={TotalAmount} />
                        <div className="bg-[#eee] flex justify-center items-center ltr:rounded-r-md rtl:rounded-l-md px-3 font-semibold border ltr:border-l-0 rtl:border-r-0 border-white-light dark:border-[#17263c] dark:bg-[#1b2e4b]">
                            ₹
                        </div>
                    </div>
                </td>

            </tr>
        </table>
    </Card>
    <Card className='m-2 border-rounded'>
        <ul className='m-5'>
            <li>
                 <button type="button" className="btn green-button ">Add products</button>
            </li>
        </ul>
    </Card>

    {/*calculater  */}

    <Card className='m-2 border-rounded'>
        <div className="crm-product-list-result-container" id="deal_product_editor_product_sum_total_container">
            <table className="crm-product-list-payment-side-table">
                <tbody>
                    <tr className="crm-product-list-payment-side-table-row">
                        <td>Total without discounts and taxes:</td>
                        <td className="crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalWithoutDiscount">0</span></td>
                    </tr>
                    <tr className="crm-product-list-payment-side-table-row">
                        <td>Delivery price:</td>
                        <td className="crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalDelivery">0</span></td>
                    </tr>
                    <tr className="crm-product-list-payment-side-table-row crm-product-list-result-grid-benefit">
                        <td>Discount amount:</td>
                        <td className="crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalDiscount">0</span></td>
                    </tr>
                    <tr className="crm-product-list-payment-side-table-row">
                        <td>Total before tax:</td>
                        <td className="crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalWithoutTax">0</span></td>
                    </tr>
                    <tr className="crm-product-list-payment-side-table-row">
                        <td className="crm-product-list-payment-side-table-td-border">Tax total:</td>
                        <td className="crm-product-list-payment-side-table-td-border crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalTax">0</span></td>
                    </tr>
                    <tr className="crm-product-list-payment-side-table-row">
                        <td className="crm-product-list-result-grid-total-big">Total amount:</td>
                        <td className="crm-product-list-result-grid-total-big crm-product-list-payment-side-table-column">₹<span className="crm-product-list-result-grid-total" data-total="totalCost">{TotalAmount}</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Card>

    </>
  );
}
