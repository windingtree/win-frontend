import { createContext, useContext, useState } from 'react';
import { SearchPropsType } from 'src/hooks/useAccommodationSingle';

type FacilityContextType = {
  searchProps: SearchPropsType | undefined;
  setSearchProps: (value: SearchPropsType) => void;
};

const FacilityContext = createContext<FacilityContextType>({
  searchProps: undefined,
  setSearchProps: (value) => {
    value;
  }
});

const FacilityProvider = ({ children }) => {
  const [searchProps, setSearchProps] = useState<SearchPropsType | undefined>(undefined);

  return (
    <FacilityContext.Provider value={{ searchProps, setSearchProps }}>
      {children}
    </FacilityContext.Provider>
  );
};

export { FacilityProvider };

export const useFacilitySearchProps = () => {
  return useContext(FacilityContext);
};
