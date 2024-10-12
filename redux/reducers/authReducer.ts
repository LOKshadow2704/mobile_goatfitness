import { authConstants } from '../constants/authConstants';

interface User {
  TenDangNhap: string;
  IDVaiTro: number;
  HoTen: string;
  DiaChi: string;
  Email: string;
  SDT: string;
  TrangThai: string;
  avt: string;
  TenVaiTro: string;
}

interface AuthState {
  loggedIn: boolean;
  user: User | null;
  loading: boolean; 
  error: string | null;
}

// State mặc định ban đầu
const initialState: AuthState = {
  loggedIn: false,
  user: null,
  loading: false,
  error: null
};

// Giảm (reducer)
const authReducer = (state = initialState, action: any): AuthState => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        loading: false,
        error: null
      };
    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggedIn: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case authConstants.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

// Xuất reducer mặc định
export default authReducer;
