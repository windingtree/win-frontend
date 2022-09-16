import { useMutation, useQuery } from '@tanstack/react-query';
import { RewardOption } from '@windingtree/glider-types/dist/win';
import axios from 'axios';
import { backend } from 'src/config';

type MutationProps = {
  id?: string | null;
  rewardType?: string;
};

interface ClaimRewardResponse {
  success: boolean;
}

const getRewards = async (id: string) => {
  const { data } = await axios
    .get<RewardOption[]>(`${backend.url}/api/booking/${id}/rewardOptions`)
    .catch((_) => {
      throw new Error('Could not retrieve rewards');
    });

  return data;
};

const postClaimReward = async ({ id, rewardType }: MutationProps) => {
  const { data } = await axios
    .post<ClaimRewardResponse>(`${backend.url}/api/booking/${id}/reward`, {
      rewardType
    })
    .catch((_) => {
      throw new Error('Something went wrong with claiming your reward.');
    });

  if (!data.success) {
    throw new Error('Something went wrong with claiming your reward.');
  }

  return data;
};

export const useRewards = (id: string | null) => {
  const { error, data, isLoading } = useQuery<RewardOption[] | undefined>(
    ['rewards', { id }],
    async () => {
      if (!id) return;
      return await getRewards(id);
    }
  );

  const claimReward = useMutation<ClaimRewardResponse, Error, MutationProps>(
    ({ id, rewardType }) => postClaimReward({ id, rewardType })
  );

  return {
    error,
    isLoading,
    data,
    claimReward
  };
};
