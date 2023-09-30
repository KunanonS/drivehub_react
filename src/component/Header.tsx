import React, { FC } from 'react';

import iconShopping from "../images/icon-shopping.svg";

const Header: FC<any> = ({ logo, cartList, setIsOpen }) => {
    return (
        <div className="app-header shadow-lg w-full">
            <div className="flex items-center gap-1">
                <img src={logo} alt="logo" />
                <span className="text-lg md:text-xl font-semibold uppercase">Drivehub</span>
            </div>
            <div className="flex gap-2 cursor-pointer" onClick={() => setIsOpen(true)}>
                <div className="relative">
                    <img src={iconShopping} alt="iconShopping" />
                    {cartList.length > 0 && <div className="bg-[#EF4444] h-3 w-3 rounded-full absolute -top-1 -right-1" />}
                </div>
                <span className="text-sm font-semibold hover:underline">{`Cart(${cartList.length})`}</span>
            </div>
        </div>
    );
}

export default Header;
