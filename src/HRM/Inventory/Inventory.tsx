import React from 'react'
import Addinventory from './Add_inventory';
import Inventorylist from './Inventorylist';
export default function Inventory() {
    return (
        <div className='grid gap-4'>
            <div>
                <ul className="flex justify-between set_padding">
                    <li>
                        <h4 className="bold-font-700 text-3xl">Inventory Management</h4>
                    </li>
                    <li className="flex">
                        <Addinventory />
                    </li>
                </ul>
            </div>


            <div>
                <Inventorylist />
            </div>
        </div>

    )
}
