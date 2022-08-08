export interface Request {
  readonly contentType?: string;
  readonly headers?: object;
  readonly method?: 'get' | 'post';
  readonly url: string;
}
