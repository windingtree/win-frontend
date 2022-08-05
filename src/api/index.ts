export interface Request<Response, EncodedResponse = any> {
  readonly contentType?: string;
  readonly headers?: object;
  readonly method?: 'get' | 'post';
  readonly url: string;
}
