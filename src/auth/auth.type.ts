import { BaseResponseType } from 'src/types';

// TODO: Type definitions are to be added
export interface SigninResponseType extends BaseResponseType {
  user: any;
}

export interface LoginResponseType extends BaseResponseType {
  userData: any;
  token: string;
}

export interface JWTPayloadType {
  id: string;
  username: string;
  email: string;
}
