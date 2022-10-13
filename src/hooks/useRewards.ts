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

const getRewards = async (id: string, isGroupBooking = false) => {
  const { data } = await axios
    .get<RewardOption[]>(
      isGroupBooking
        ? `${backend.url}/api/groups/${id}/rewardOptions`
        : `${backend.url}/api/booking/${id}/rewardOptions`
    )
    .catch((_) => {
      throw new Error('Could not retrieve rewards');
    });

  return data;
};

const postClaimReward = async ({ id, rewardType }: MutationProps, isGroupBooking) => {
  const { data } = await axios
    .post<ClaimRewardResponse>(
      isGroupBooking
        ? `${backend.url}/api/groups/${id}/reward`
        : `${backend.url}/api/booking/${id}/reward`,
      {
        rewardType
      },
      { withCredentials: true }
    )
    .catch((_) => {
      throw new Error('Something went wrong with claiming your reward.');
    });

  if (!data.success) {
    throw new Error('Something went wrong with claiming your reward.');
  }

  return data;
};

export const useRewards = (id: string | null, isGroupBooking = false) => {
  const { error, data, isLoading } = useQuery<RewardOption[] | undefined>(
    ['rewards', { id }],
    async () => {
      if (!id) return;
      return await getRewards(id);
    }
  );

  const claimReward = useMutation<ClaimRewardResponse, Error, MutationProps>(
    ({ id, rewardType }) => postClaimReward({ id, rewardType }, isGroupBooking)
  );

  return {
    error,
    isLoading,
    data,
    claimReward
  };
};
