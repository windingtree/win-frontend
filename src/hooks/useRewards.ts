import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { backend } from 'src/config';

type Rewards = {
  tokenName: string;
  quantity: string;
}[];

async function getRewards(id: string) {
  const { data } = await axios
    .get(`${backend.url}/api/booking/${id}/rewardOptions`)

    .catch((e) => {
      throw new Error('Could not retrieve rewards');
    });

  return data;
}

export const useRewards = (id: string) => {
  const { error, data, isLoading } = useQuery<Rewards, Error>(
    ['rewards', { id }],
    async () => {
      return await getRewards(id);
    }
  );

  return {
    error,
    isLoading,
    data
  };
};
