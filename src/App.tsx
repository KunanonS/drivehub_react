import { useEffect, useState, Fragment, ChangeEvent, SetStateAction } from "react";
import { useRecoilState } from "recoil";
import { Dialog, Transition, Menu } from '@headlessui/react'

import { cartListState } from './store/recoil/atoms/common'

import { Car, CarInCart, DiscountCode } from "./types/common";

import logo from "./images/logo.svg";
import iconNullImage from "./images/icon-null-image.svg";
import iconShopping from "./images/icon-shopping.svg";
import iconDropdown from "./images/icon-dropdown.svg";
import iconArrowDown from "./images/icon-arrow-down.svg";
import iconClose from "./images/icon-close.svg";

import "./index.css";
import "./App.css";

const menuList = [
  { value: 'asc', name: 'Price: Low - High' },
  { value: 'desc', name: 'Price: High - Low' },
]

const carListApi = 'https://cdn.contentful.com/spaces/vveq832fsd73/entries?content_type=car';
const discountListApi = 'https://cdn.contentful.com/spaces/vveq832fsd73/entries?content_type=discount';

const AccessToken = 'VPmo2U661gTnhMVx0pc0-CtahNg_aqS5DuneLtYfO1o';

function App() {
  const [carListAll, setCarListAll] = useState<Car[]>([]);
  const [carList, setCarList] = useState<Car[]>([]);
  const [discountList, setDiscountList] = useState<DiscountCode[]>([]);
  const [isOpen, setIsOpen] = useState(false)
  const [total, setTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [grandTotal, setGrandTotal] = useState(0)
  const [menuActive, setMenuActive] = useState({ value: 'asc', name: 'Price: Low - High' })

  const [cartList, setCartList] = useRecoilState<CarInCart[]>(cartListState);

  const calculatePrice = () => {
    let totalPrice = 0;

    cartList.forEach((carItem) => {
      if (carItem.amountInCart && carItem.fields.title) {
        totalPrice += carItem.amountInCart * carItem.fields.price;
      }
    });

    const grandTotal = totalPrice - discount;
    const grandTotalChecked = grandTotal > 0 ? grandTotal : 0;

    setTotal(totalPrice);
    setGrandTotal(grandTotalChecked);
  }

  const handleSortPrice = (menu?: { value: string; name: string }) => {
    const menuDefault = menu || menuActive
    setMenuActive(menuDefault);

    let sortedCarList = [...carList];

    if (menuDefault.value === 'asc') {
      sortedCarList = sortedCarList.sort((a, b) => a.fields.price - b.fields.price);
    } else if (menuDefault.value === 'desc') {
      sortedCarList = sortedCarList.sort((a, b) => b.fields.price - a.fields.price);
    }

    setCarList(sortedCarList);
  }

  const handleChangeSearchCar = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      const filteredCarList = carListAll.filter((carItem) => {
        const carTitle = carItem.fields.title.toLowerCase();
        return carTitle.includes(value);
      });
      setCarList(filteredCarList)
    } else {
      setCarList(carListAll)
    }
  }

  const handleChangeDiscountCode = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const discountAmount = discountList.reduce((totalDiscount, discountItem) => {
      if (discountItem.fields.code === value) {
        return totalDiscount + discountItem.fields.amount;
      }

      return totalDiscount;
    }, 0);

    setDiscount(discountAmount);
  }

  const handleClickAddToCart = (carData: Car) => {
    const carId = carData.sys.id
    console.log(carData)

    const findIdInCart = cartList.find((carItem) => carItem.sys.id === carId);
    if (!findIdInCart) {
      const carItemAddAmountInCart: CarInCart = { ...carData, amountInCart: 1 };

      setCartList((prevState) => [...prevState, carItemAddAmountInCart]);
    }
  }

  const handleClickIncrease = (carData: Car) => {
    const carId = carData.sys.id

    const updatedCartList = cartList.map((carItem) => {
      if (carItem.sys.id === carId && carItem.amountInCart) {
        return { ...carItem, amountInCart: carItem.amountInCart + 1 };
      };
      return carItem;
    });

    setCartList(updatedCartList);
  }

  const handleClickDecrease = (carData: Car) => {
    const carId = carData.sys.id

    const updatedCartList = cartList.map((carItem) => {
      if (carItem.sys.id === carId && carItem.amountInCart) {
        return { ...carItem, amountInCart: carItem.amountInCart - 1 };
      };
      return carItem;
    }).filter((carItem) => (carItem.amountInCart || 0) > 0);

    setCartList(updatedCartList);
  }

  const getCarList = async () => {
    try {
      const response = await fetch(carListApi, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('response not ok');
      }

      const data = await response.json();

      setCarList(data.items);
      setCarListAll(data.items);
    } catch (error) {
      console.error('error: ', error);
    }
  }

  const getDiscountListApi = async () => {
    try {
      const response = await fetch(discountListApi, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${AccessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('response not ok');
      }

      const data = await response.json();
      setDiscountList(data.items)
    } catch (error) {
      console.error('error: ', error);
    }
  }

  useEffect(() => {
    getCarList();
    getDiscountListApi();
  }, [])

  useEffect(() => {
    if (isOpen) {
      calculatePrice()
    } else {
      setDiscount(0);
    }
  }, [cartList, isOpen, discount])

  useEffect(() => {
    handleSortPrice();
  }, [carList.length])


  return (
    <div className="text-[#111827]">
      <div className="app-header shadow-lg w-full">
        <div className="flex items-center gap-1">
          <img src={logo} alt="logo" />
          <span className="text-xl font-semibold uppercase">Drivehub</span>
        </div>
        <div className="flex gap-2 cursor-pointer" onClick={() => setIsOpen(true)}>
          <div className="relative">
            <img src={iconShopping} alt="iconShopping" />
            {cartList.length > 0 && <div className="bg-[#EF4444] h-3 w-3 rounded-full absolute -top-1 -right-1" />}
          </div>
          <span className="text-sm font-semibold hover:underline">{`Cart(${cartList.length})`}</span>
        </div>
      </div>
      <div className="flex justify-between px-10 py-3">
        <div className="text-3xl font-semibold">Car Available</div>
        <div className="flex gap-3">
          <input
            className="h-[43px] w-[250px] border px-5 border-[#D1D5DB] focus:outline-none rounded-md"
            placeholder="Search Car"
            onChange={(e) => handleChangeSearchCar(e)}
          />
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="border flex items-center justify-center gap-2 h-[43px] px-5 border-[#D1D5DB] focus:outline-none rounded-md">
                <img src={iconDropdown} alt="iconDropdown" />
                {menuActive.name}
                <img src={iconArrowDown} alt="iconArrowDown" />
              </Menu.Button>
            </div>
            <Menu.Items className="absolute right-0 mt-2 w-full bg-white border border-[#D1D5DB] rounded-md shadow-lg focus:outline-none">
              <div className="py-1">
                {menuList.map((menu) => (
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
      <div className="bg-[#F3F4F6] px-10 py-5">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {carList.map((carItem, index) => (
            <div key={index} className="bg-white h-[340px] rounded-xl flex flex-col justify-between">
              <div>
                <img
                  className="h-[185px] w-full object-cover rounded-t-xl"
                  src={carItem.fields.photo}
                  alt={carItem.fields.title}
                  onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                    e.target.src = iconNullImage;
                  }} />
                <div className="p-3">
                  <div className="font-bold text-xl">
                    {carItem.fields.title}
                  </div>
                  <div className="font-medium text-sm">
                    {`${carItem.fields.price.toLocaleString()} THB/Day`}
                  </div>
                </div>
              </div>
              <div className="mx-3 mb-3">
                <button
                  className="bg-[#3B82F6] text-white h-14 w-full rounded-md disabled:bg-[#93C5FD] hover:bg-[#1E40AF] disabled:cursor-not-allowed hover:cursor-pointer"
                  onClick={() => handleClickAddToCart(carItem)}
                  disabled={cartList.findIndex((car) => car.sys.id === carItem.sys.id) !== -1}
                >
                  Add to cart
                </button>
              </div>
            </div>
          ))}</div>
      </div>
      <div className="app-footer">
        <div className="text-left">
          <div className="font-semibold">Drivehub Co.,Ltd</div>
          <div>193-195 Lake Rajada Office Complex,</div>
          <div>Ratchadapisek road, Khlong Toei, Bangkok</div>
        </div>
        <div className="mt-auto">
          <div className="text-[#E5E7EB]">© Drivehub 2023</div>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
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
                    className="text-3xl font-semibold"
                  >
                    Cart
                    <img
                      className="absolute top-5 right-5 cursor-pointer"
                      src={iconClose}
                      alt="iconClose"
                      onClick={() => setIsOpen(false)}
                    />
                  </Dialog.Title>
                  <div className="flex flex-col justify-between">
                    <div className="mt-6 flex flex-col gap-3 h-[250px] overflow-auto">
                      {cartList.map((carItem) => (
                        <div className="flex justify-between border-b pb-2">
                          <div className="flex gap-3">
                            <img
                              className="h-[54px] w-[87px] object-cover"
                              src={carItem.fields.photo}
                              alt={carItem.fields.title}
                              onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                                e.target.src = iconNullImage;
                              }} />
                            <div>
                              <div className="text-xl font-bold">{carItem.fields.title}</div>
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
                        <div className="text-xl font-bold">Total</div>
                        <div className="text-xl">{`${total.toLocaleString()} THB`}</div>
                      </div>
                      <div className="flex justify-between py-1 border-y">
                        <div className="text-xl font-bold">Discount</div>
                        <div className="text-xl">{`${discount.toLocaleString()} THB`}</div>
                      </div>
                      <div className="flex justify-between py-1">
                        <div className="text-xl font-bold">Grand Total</div>
                        <div className="text-xl">{`${grandTotal.toLocaleString()} THB`}</div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default App;
