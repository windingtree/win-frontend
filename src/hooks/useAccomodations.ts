import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

async function fetchAccomodations() {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}`);
  return data;
}

export const useAccomodations = () => {
  const { data, refetch, error, isLoading } = useQuery(
    ['search-accomodations'],
    fetchAccomodations
  );

  return {
    data,
    error,
    isLoading
  };
};
