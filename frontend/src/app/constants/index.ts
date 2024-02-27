export const TYPE_MESSAGE_SUCCESS = 'success';
export const TYPE_MESSAGE_ERROR = 'error';
export const TYPE_MESSAGE_WARNING = 'warning';
export const TYPE_MESSAGE_INFO = 'info';

export const LOGIN_MESSAGE = {
  success: 'Login successfully',
  error: 'Login failure',
};

export const LOGIN_ADMIN_MESSAGE = {
  success: 'Login with role admin successfully',
  error: 'Login with role admin failure',
};

export const REGISTER_MESSAGE = {
  success: 'Register successfully',
  error: 'Register failure',
};

export const GET_ROLES_MESSAGE = {
  error: 'Get roles failure',
};

export const GET_ROLE_REQUEST_MESSAGE = {
  error: 'Get role requests failure',
};

export const GET_ALL_USER_REQUEST_MESSAGE = {
  error: 'Get all user failure',
};

export const APPROVE_ROLE_REQUEST_MESSAGE = {
  success: 'Approve role request successfully',
  error: 'Approve role requests failure',
};

export const REJECT_ROLE_REQUEST_MESSAGE = {
  success: 'Reject role request successfully',
  error: 'Reject role requests failure',
};

export const VERIFY_EMAIL_MESSAGE = {
  success: 'Send email verify successfully',
  error: 'Send email verify your account failure',
};

export const VERIFY_ACCOUNT_MESSAGE = {
  success: 'Verify account successfully',
  error: 'Verify account failure',
};

export const GET_BLOGS_MESSAGE = {
  success: 'Get all blogs successfully',
  error: 'Get all blogs failure',
};

export const GET_DETAIL_BLOG_MESSAGE = {
  error: 'Get detail blog failure',
};

export const GET_CURRENT_USER_MESSAGE = {
  error: 'Get current user failure',
};

export const SEND_REQUEST_CHANGE_ROLE_MESSAGE = {
  success: 'Send request change role successfully',
  error: 'Send request change role failure',
};

export const CREATE_BLOG_MESSAGE = {
  success: 'Create blog successfully',
  error: 'Create blog failure',
};

export const GET_BLOG_BY_USER_MESSAGE = {
  success: 'Get blog by user successfully',
  error: 'Get blog by user failure',
};

export const EDIT_BLOG_MESSAGE = {
  success: 'Edit blog successfully',
  error: 'Edit blog failure',
};

export const DELETE_BLOG_MESSAGE = {
  success: 'Delete blog successfully',
  error: 'Delete blog failure',
};

export const LIST_PATH_NOT_USE_TOKEN = [
  '/login',
  '/register',
  '/register',
  '/resend-email-verify',
  '/verify-account',
  '/verify-account',
  '/roles',
  '/refresh-token',
];

export const LIST_PATH_ADMIN_ROUTE = [
  '/admin/user',
  '/admin/blog',
  '/admin/role-request',
];

export const LIST_OF_ROLES = ['ROLE_USER', 'ROLE_MANAGER', 'ROLE_ADMIN'];
export const ADMIN_ROLE_NAME = 'ROLE_ADMIN';
export const MANAGER_ROLE_NAME = 'ROLE_MANAGER';
export const USER_ROLE_NAME = 'ROLE_USER';
export const ACCESS_TOKEN_NAME = 'access_token';
export const REFRESH_TOKEN_NAME = 'refresh_token';
export const ERROR_CODE = {
  TOKEN_EXPIRED: 'error_013',
};
