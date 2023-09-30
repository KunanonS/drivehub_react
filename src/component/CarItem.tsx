import React, { FC } from 'react';

import { Car } from '../types/common';

import iconNullImage from "../images/icon-null-image.svg";

const CarItem: FC<any> = ({ carItem, index, handleClickAddToCart, cartList }) => {
    return (
        <div key={index} className="bg-white h-[340px] rounded-xl flex flex-col justify-between">
            <div>
                <img
                    className="h-[185px] w-full object-cover rounded-t-xl"
                    src={carItem.fields.photo}
                    alt={carItem.fields.title}
                    onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                        e.target.src = iconNullImage;
                    }}
                />
                <div className="p-3">
                    <div className="font-bold text-xl">{carItem.fields.title}</div>
                    <div className="font-medium text-sm">{`${carItem.fields.price.toLocaleString()} THB/Day`}</div>
                </div>
            </div>
            <div className="mx-3 mb-3">
                <button
                    className="bg-[#3B82F6] text-white h-14 w-full rounded-md disabled:bg-[#93C5FD] hover:bg-[#1E40AF] disabled:cursor-not-allowed hover:cursor-pointer"
                    onClick={() => handleClickAddToCart(carItem)}
                    disabled={cartList.findIndex((car: Car) => car.sys.id === carItem.sys.id) !== -1}
                >
                    {cartList.findIndex((car: Car) => car.sys.id === carItem.sys.id) !== -1 ? 'Added' : 'Add to cart'}
                </button>
            </div>
        </div>
    );
};

export default CarItem;
