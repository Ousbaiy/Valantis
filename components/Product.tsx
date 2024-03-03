'use client';

import React, { useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { TProductData } from '@/types';
import { Button } from './ui/button';
import ProductSkeleton from './ProductSkeleton';
import { Heart } from 'lucide-react';
import { debounce } from 'lodash';
import CustomInput from './CustomInput';

const Product: React.FC = () => {
  const [nameQuery, setNameQuery] = useState<string>('');
  const [priceQuery, setPriceQuery] = useState<number>();
  const [brandQuery, setBrandQuery] = useState<string>('');

  const {
    productData,
    loading,
    goToNextPage,
    goToPrevPage,
    filterByName,
    filterByPrice,
    filterByBrand,
    currentPage,
    fetchData,
  } = useProduct();

  const [typingTimer, setTypingTimer] = useState<number | null>(null);

  console.log(productData);

  const debouncedFilter = debounce(async (type: string, value: any) => {
    switch (type) {
      case 'product':
        await filterByName(value);
        break;
      case 'price':
        await filterByPrice(value);
        break;
      case 'brand':
        await filterByBrand(value);
        break;
      default:
        break;
    }
  }, 2500);

  const handleInputChange = (
    type: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue =
      type === 'price' ? parseFloat(e.target.value) : e.target.value;

    switch (type) {
      case 'product':
        setNameQuery(inputValue as string);
        break;
      case 'price':
        setPriceQuery(inputValue as number);
        break;
      case 'brand':
        setBrandQuery(inputValue as string);
        break;
      default:
        break;
    }

    if (typingTimer) {
      clearTimeout(typingTimer);
    }

    const newTimer = setTimeout(() => {
      // Check if the input value is empty, then fetch normal data
      if (inputValue === '') {
        fetchData();
      } else {
        // Handle the filter operation after the user stops typing
        debouncedFilter(type, inputValue);
      }
    }, 500);

    setTypingTimer(newTimer);
  };

  return (
    <>
      <div className="flex gap-x-10 flex-wrap">
        <CustomInput
          type="text"
          onChange={(e) => handleInputChange('product', e)}
          value={nameQuery}
          className="w-[300px] mb-5"
          placeholder="Filter by name"
        />
        <CustomInput
          type="number"
          onChange={(e) => handleInputChange('price', e)}
          value={priceQuery}
          className="w-[300px] mb-5"
          placeholder="Filter by price"
        />
        <CustomInput
          type="text"
          onChange={(e) => handleInputChange('brand', e)}
          value={brandQuery}
          className="w-[300px] mb-5"
          placeholder="Filter by brand"
        />
      </div>

      {loading ? (
        <ProductSkeleton />
      ) : (
        <>
          {' '}
          {productData?.length === 0 && (
            <p className="text-center">Ничего не найдено</p>
          )}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productData?.map((product: TProductData) => (
              <div
                key={product.id + product.product}
                className="p-4 rounded border shadow-md space-y-5 relative flex flex-col"
              >
                <Heart className="h-5 w-5 absolute top-2 right-2 hover:text-red-500 cursor-pointer" />
                <h1 className="text-lg font-semibold mb-2 flex-1 underline cursor-pointer">
                  {product.brand}
                </h1>
                <p className="text-base">{product.product}</p>
                <p className="text-sm dark:text-gray-300">
                  Price: {product.price} RUB
                </p>
                <Button onClick={() => alert('Товар добавлен в корзину')}>
                  в корзину
                </Button>
              </div>
            ))}
          </div>
          {productData?.length > 0 && (
            <div className="flex justify-between my-5">
              <Button onClick={goToPrevPage} disabled={currentPage === 0}>
                Prev Page
              </Button>
              <Button onClick={goToNextPage} disabled={loading}>
                Next Page
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Product;
