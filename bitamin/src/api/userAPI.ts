import axiosInstance from './axiosInstance'

export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('members/get-member')
    console.log(response.data)
    return response.data
  } catch (error: any) {
    throw new Error('Failed to fetch user information')
  }
}
