import axios from 'axios';

export interface EuVatResponse {
  isValid: boolean;
  requestDate: string;
  userError: string;
  name: string;
  address: string;
  requestIdentifier: string;
  vatNumber: number;
  viesApproximate: {
    name: string;
    street: string;
    postalCode: string;
    city: string;
    companyType: string;
    matchName: number;
    matchStreet: number;
    matchPostalCode: number;
    matchCity: number;
    matchCompanyType: number;
  };
}

export const isVatValid = async (vat: string): Promise<boolean> => {
  const res = await axios.get<EuVatResponse>(
    `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/EE/vat/${vat.trim()}`
  );
  return res && res.data && res.data.isValid;
};
