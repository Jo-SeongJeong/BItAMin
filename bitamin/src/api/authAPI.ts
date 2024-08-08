// authAPI.ts
import axiosInstance from './axiosInstance';

export const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken); // 로컬 스토리지에 저장
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
