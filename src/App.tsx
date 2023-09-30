import { useAppViewModel } from './AppVM';

import CarSearchBar from "./component/CarSearchBar";
import CartDialog from "./component/CartDialog";
import CarItem from "./component/CarItem";
import Header from "./component/Header";
import Footer from "./component/Footer";

import logo from "./images/logo.svg";

import "./index.css";
import "./App.css";

const menuList = [
  { value: 'asc', name: 'Price: Low - High' },
  { value: 'desc', name: 'Price: High - Low' },
]


function App() {
  const {
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
  } = useAppViewModel();


  return (
    <div className="text-[#111827]">
      <Header logo={logo} cartList={cartList} setIsOpen={setIsOpen} />
      <CarSearchBar
        menuActive={menuActive}
        handleChangeSearchCar={handleChangeSearchCar}
        handleSortPrice={handleSortPrice}
        menuList={menuList}
      />
      <div className="bg-[#F3F4F6] px-10 py-5">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {carList.map((carItem, index) => (
            <CarItem
              key={index}
              carItem={carItem}
              index={index}
              handleClickAddToCart={handleClickAddToCart}
              cartList={cartList}
            />
          ))}
        </div>
      </div>
      <Footer />
      <CartDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        cartList={cartList}
        handleClickIncrease={handleClickIncrease}
        handleClickDecrease={handleClickDecrease}
        handleChangeDiscountCode={handleChangeDiscountCode}
        total={total}
        discount={discount}
        grandTotal={grandTotal}
      />
    </div>
  );
}

export default App;
