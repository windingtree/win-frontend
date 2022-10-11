import { httpProxyClient } from './http';

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

export const isVatValid = async (countryCode: string, vat: string): Promise<boolean> => {
  const res = await httpProxyClient<EuVatResponse>(
    `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode.trim()}/vat/${vat.trim()}`
  );
  return res && res.data && res.data.isValid;
};
