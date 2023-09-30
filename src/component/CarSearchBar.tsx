import React, { FC } from 'react';
import { Menu } from '@headlessui/react';

import iconDropdown from "../images/icon-dropdown.svg";
import iconArrowDown from "../images/icon-arrow-down.svg";

const CarSearchBar: FC<any> = ({ menuActive, handleChangeSearchCar, handleSortPrice, menuList }) => {
    return (
        <div className="block md:flex justify-between px-10 py-3">
            <div className="text-2xl md:text-3xl font-semibold">Car Available</div>
            <div className="grid md:flex gap-3 mt-3 md:mt-0">
                <input
                    className="h-[43px] w-full md:w-[250px] border px-5 border-[#D1D5DB] focus:outline-none rounded-md"
                    placeholder="Search Car"
                    onChange={(e) => handleChangeSearchCar(e)}
                />
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="border flex items-center w-full md:w-auto justify-center gap-2 h-[43px] px-5 border-[#D1D5DB] focus:outline-none rounded-md">
                            <img src={iconDropdown} alt="iconDropdown" />
                            {menuActive.name}
                            <img src={iconArrowDown} alt="iconArrowDown" />
                        </Menu.Button>
                    </div>
                    <Menu.Items className="absolute right-0 mt-2 w-full bg-white border border-[#D1D5DB] rounded-md shadow-lg focus:outline-none">
                        <div className="py-1">
                            {menuList.map((menu: { value: string; name: string; }) => (
                                <Menu.Item key={menu.value}>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-[#F3F4F6]' : ''
                                                } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                            onClick={() => handleSortPrice(menu)}
                                        >
                                            {menu.name}
                                        </button>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </Menu.Items>
                </Menu>
            </div>
        </div>
    );
}

export default CarSearchBar;
