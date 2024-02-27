import { jwtDecode } from 'jwt-decode';
import {
  ADMIN_ROLE_NAME,
  LIST_PATH_ADMIN_ROUTE,
  LIST_PATH_NOT_USE_TOKEN,
} from '../constants';
export const isUseToken = (path: string) => {
  for (const index in LIST_PATH_NOT_USE_TOKEN) {
    if (path.includes(LIST_PATH_NOT_USE_TOKEN[index])) return false;
  }
  return true;
};

export const isTokenExpired = (token: string) => {
  const expTime = jwtDecode(token).exp;
  if (expTime) return expTime < new Date().getTime() / 1000;
  return true;
};

export const isAdminPath = (path: string) => {
  for (const index in LIST_PATH_ADMIN_ROUTE) {
    if (path.includes(LIST_PATH_ADMIN_ROUTE[index])) return true;
  }
  return false;
};

export const isAdminRole = (token: string) => {
  const decodedToken = jwtDecode(token) as any;
  if (!decodedToken?.authorities) return false;
  const authorities = decodedToken.authorities;
  for (const index in authorities) {
    if (authorities[index] === ADMIN_ROLE_NAME) return true;
  }

  return false;
};
