import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { backend } from 'src/config';

type Rewards = {
  tokenName: string;
  quantity: string;
}[];

type MutationProps = {
  id: string;
  rewardType: string;
};

const getRewards = async (id: string) => {
  const { data } = await axios
    .get(`${backend.url}/api/booking/${id}/rewardOptions`)
    .catch((_) => {
      throw new Error('Could not retrieve rewards');
    });

  return data;
};

const postClaimReward = async (id, rewardType) => {
  const result = await axios
    .post(`${backend.url}/api/booking/${id}/reward`, {
      rewardType
    })
    .catch((_) => {
      throw new Error('Something went wrong with claiming your reward.');
    });

  return result;
};

export const useRewards = (id: string) => {
  const { error, data, isLoading } = useQuery<Rewards, Error>(
    ['rewards', { id }],
    async () => {
      if (!id) return;
      return await getRewards(id);
    }
  );

  const claimReward = useMutation(({ id, rewardType }: MutationProps) =>
    postClaimReward(id, rewardType)
  );

  return {
    error,
    isLoading,
    data,
    claimReward
  };
};
