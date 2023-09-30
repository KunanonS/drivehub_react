import { useEffect, useState, ChangeEvent } from "react";
import { useRecoilState } from "recoil";

import { cartListState } from './store/recoil/atoms/common'

import { Car, CarInCart, DiscountCode } from "./types/common";

const carListApi = 'https://cdn.contentful.com/spaces/vveq832fsd73/entries?content_type=car';
const discountListApi = 'https://cdn.contentful.com/spaces/vveq832fsd73/entries?content_type=discount';

const AccessToken = 'VPmo2U661gTnhMVx0pc0-CtahNg_aqS5DuneLtYfO1o';

export function useAppViewModel() {
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

  return {
    carList,
    isOpen,
    total,
    discount,
    grandTotal,
    menuActive,
    cartList,
    setIsOpen,
    handleChangeSearchCar,
    handleSortPrice,
    handleChangeDiscountCode,
    handleClickAddToCart,
    handleClickIncrease,
    handleClickDecrease,
  };
}
