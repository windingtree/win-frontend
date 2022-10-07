import axios, { AxiosPromise } from 'axios';
import { PROXY_SERVER } from '../config';

export interface HttpClientOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
  body?: Record<string, unknown> | string;
  headers?: Record<string, string>;
  jwt?: string;
  timeoutInMs?: number;
}

const defaultTimeout = 15000;
const defaultOptions: HttpClientOptions = {
  method: 'GET',
  headers: {},
  timeoutInMs: defaultTimeout
};

export const httpClient = <T>(
  url: string,
  { method, body, headers, jwt, timeoutInMs }: HttpClientOptions = defaultOptions
): AxiosPromise<T> => {
  const axiosInstance = axios.create();
  const extraHeaders = jwt
    ? { ...headers, Authorization: `Bearer ${jwt}` }
    : { ...headers };

  return axiosInstance({
    url,
    method,
    data: body,
    headers: extraHeaders,
    timeout: timeoutInMs
  });
};

export const httpProxyClient = <T>(
  url: string,
  { method, body, headers, jwt, timeoutInMs }: HttpClientOptions = defaultOptions
): AxiosPromise<T> => {
  // encode url adn append to proxy base uri
  const encodedUrl = encodeURIComponent(url);
  const proxyUrl = PROXY_SERVER + '/' + encodedUrl;

  return httpClient(proxyUrl, { method, body, headers, jwt, timeoutInMs });
};
