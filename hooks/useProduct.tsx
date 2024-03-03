import { useEffect, useState } from 'react';
import axios from 'axios';
import md5 from 'md5';
import { TProductData } from '@/types';

const baseURL = 'https://api.valantis.store:41000';
const pageSize = 50;

const generateAuthHeader = () => {
  const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const authString = `${process.env.NEXT_PUBLIC_VALANTIS_PASSWORD}_${timestamp}`;
  return md5(authString);
};

const makeAuthenticatedRequest = async (action: string, params: any = {}) => {
  const headers = { 'X-Auth': generateAuthHeader() };
  try {
    const response = await axios.post(
      `${baseURL}`,
      { action, params },
      { headers }
    );
    return response.data.result;
  } catch (error: any) {
    console.error('Error:', error.response?.data);
    throw new Error('API request failed');
  }
};

export const useProduct = () => {
  const [productData, setProductData] = useState<TProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const fetchProductIds = async (offset?: number, limit?: number) => {
    return makeAuthenticatedRequest('get_ids', { offset, limit });
  };

  const fetchProducts = async (ids: string[]) => {
    return makeAuthenticatedRequest('get_items', { ids });
  };

  const filterProducts = async (filterType: string, filterValue: any) => {
    return makeAuthenticatedRequest('filter', { [filterType]: filterValue });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const offset = currentPage * pageSize;
      const ids = await fetchProductIds(offset, pageSize);
      const data = await fetchProducts(ids);

      const uniqueData = Array.from(
        new Map(data.map((item: TProductData) => [item.id, item])).values()
      ) as TProductData[];

      setProductData(uniqueData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };


  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const filterByName = async (name: string) => {
    performFiltering('product', name);
  };

  const filterByPrice = async (price: number) => {
    performFiltering('price', price);
  };

  const filterByBrand = async (brand: string) => {
    performFiltering('brand', brand);
  };

  const filterData = async (filterType: string, filterValue: any) => {
    performFiltering(filterType, filterValue);
  };

  const performFiltering = async (filterType: string, filterValue: any) => {
    try {
      setLoading(true);
      const filteredIds = await filterProducts(filterType, filterValue);
      const filteredData = await fetchProducts(filteredIds);
      setProductData(filteredData);
    } catch (error) {
      console.error(`Error filtering products by ${filterType}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return {
    productData,
    loading,
    goToNextPage,
    goToPrevPage,
    filterByName,
    filterByPrice,
    filterByBrand,
    filterData,
    currentPage,
    fetchData,
  };
};
