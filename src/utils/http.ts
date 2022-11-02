import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { backend, PROXY_SERVER } from '../config';

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

export const httpClientRequest = <T>(
  url: string,
  { method, body, headers, jwt, timeoutInMs }: HttpClientOptions = defaultOptions
): Promise<AxiosResponse<T>> => {
  const axiosInstance = axios.create();
  const extraHeaders = jwt
    ? { ...headers, Authorization: `Bearer ${jwt}` }
    : { ...headers };

  return axiosInstance.request<T>({
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

  return httpClientRequest(proxyUrl, { method, body, headers, jwt, timeoutInMs });
};

export const winBackendClientRequest = <T>(
  endpoint: string,
  { method, body, headers, jwt, timeoutInMs }: HttpClientOptions = defaultOptions
): AxiosPromise<T> => {
  // encode url adn append to proxy base uri
  const url = backend.url + '/api' + endpoint;

  return httpClientRequest(url, { method, body, headers, jwt, timeoutInMs });
};
