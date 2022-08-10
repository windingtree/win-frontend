import { Button, Card, CardBody, CardFooter, CardHeader } from 'grommet';
import { CSSProperties, forwardRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FacilityRecord } from '../store/types';
import { emptyFunction } from '../utils/common';

export interface SearchResultProps {
  facility: FacilityRecord;
  isSelected?: boolean;
  onSelect?: (...args) => void;
}

export const SearchResult = forwardRef<HTMLDivElement, SearchResultProps>(
  ({ facility, isSelected, onSelect = emptyFunction }, ref) => {
    const navigate = useNavigate();
    const selectedStyle: CSSProperties = isSelected
      ? {
          position: 'relative',
          left: 10
        }
      : {};

    const handleSelect = useCallback(() => onSelect(facility.id), []);

    return (
      <Card pad="small" background={'white'} style={selectedStyle} ref={ref}>
        <CardHeader>{facility.name}</CardHeader>
        <CardBody pad={'small'} onClick={handleSelect}>
          {facility.description && facility.description.substring(0, 80) + '...'}
        </CardBody>
        <CardFooter justify="end">
          <Button label="book" onClick={() => navigate(`/facility/${facility.id}`)} />
        </CardFooter>
      </Card>
    );
  }
);
