import { MediaItem } from '@windingtree/glider-types/types/win';

export const sortByLargestImage = (images: MediaItem[]) =>
  images.sort(
    (itemOne: MediaItem, itemTwo: MediaItem) => {
      return Number(itemTwo.width) - Number(itemOne.width);
    }
  );
