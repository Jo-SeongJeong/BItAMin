import axiosInstance from './axiosInstance'

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('members/get-member')
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user information')
  }
}
