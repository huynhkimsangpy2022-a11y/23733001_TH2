import { create } from 'zustand';
import { STUDENT, examStamp } from '../constants/student';

interface AuthState {
  token: string | null;
  authValue: string;
  isAuthenticated: boolean;
  login: (inputValue: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  authValue: '',
  isAuthenticated: false,
  login: (inputValue: string) => {
    const generatedToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    set({
      token: generatedToken,
      authValue: inputValue,
      isAuthenticated: true,
    });
  },
  logout: () => {
    set({
      token: null,
      authValue: '',
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
