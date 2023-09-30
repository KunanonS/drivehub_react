import React, { Fragment, FC } from 'react';
import { Transition, Dialog } from '@headlessui/react';

import { CarInCart } from '../types/common';

import iconNullImage from "../images/icon-null-image.svg";
import iconClose from '../images/icon-close.svg';

const CartDialog: FC<any> = ({
    isOpen,
    onClose,
    cartList,
    handleClickIncrease,
    handleClickDecrease,
    handleChangeDiscountCode,
    total,
    discount,
    grandTotal,
}) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#111827] bg-opacity-75" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white text-left py-4 px-5 transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl md:text-3xl font-semibold"
                                >
                                    Cart
                                    <img
                                        className="absolute top-5 right-5 cursor-pointer"
                                        src={iconClose}
                                        alt="iconClose"
                                        onClick={onClose}
                                    />
                                </Dialog.Title>
                                <div className="flex flex-col justify-between">
                                    <div className="mt-6 flex flex-col gap-3 h-[250px] overflow-auto">
                                        {cartList.map((carItem: CarInCart) => (
                                            <div className="flex justify-between border-b pb-2" key={carItem.sys.id}>
                                                <div className="flex gap-3">
                                                    <img
                                                        className="h-[54px] w-[87px] object-cover hidden md:grid"
                                                        src={carItem.fields.photo}
                                                        alt={carItem.fields.title}
                                                        onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                                                            e.target.src = iconNullImage;
                                                        }} />
                                                    <div>
                                                        <div className="md:text-xl font-bold">{carItem.fields.title}</div>
                                                        <div className="text-sm font-medium">{`${carItem.fields.price.toLocaleString()} THB/Day`}</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-center">
                                                    <button
                                                        className="bg-[#3B82F6] h-6 w-6 text-white rounded-md disabled:bg-[#93C5FD] hover:bg-[#1E40AF] disabled:cursor-not-allowed hover:cursor-pointer"
                                                        onClick={() => handleClickIncrease(carItem)}
                                                    >
                                                        <div className="-mt-1">+</div>
                                                    </button>
                                                    <div className="w-10 text-center">{carItem.amountInCart}</div>
                                                    <button
                                                        className="bg-[#3B82F6] h-6 w-6 text-white rounded-md disabled:bg-[#93C5FD] hover:bg-[#1E40AF] disabled:cursor-not-allowed hover:cursor-pointer"
                                                        onClick={() => handleClickDecrease(carItem)}

                                                    >
                                                        <div className="-mt-1">-</div>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4">
                                        <div className="bg-[#F3F4F6] rounded-md w-full h-[75px] flex items-center px-5">
                                            <input
                                                className="h-[43px] w-full border px-5 border-[#D1D5DB] focus:outline-none rounded-md"
                                                placeholder="Discount code"
                                                onChange={(e) => handleChangeDiscountCode(e)}
                                            />
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <div className="text-lg md:text-xl font-bold">Total</div>
                                            <div className="text-lg md:text-xl">{`${total.toLocaleString()} THB`}</div>
                                        </div>
                                        <div className="flex justify-between py-1 border-y">
                                            <div className="text-lg md:text-xl font-bold">Discount</div>
                                            <div className="text-lg md:text-xl">{`${discount.toLocaleString()} THB`}</div>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <div className="text-lg md:text-xl font-bold">Grand Total</div>
                                            <div className="text-lg md:text-xl">{`${grandTotal.toLocaleString()} THB`}</div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default CartDialog;