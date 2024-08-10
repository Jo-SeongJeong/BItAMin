import axiosInstance from './axiosInstance'

// 운동 id에 맞는 정보 불러오기
export const healthInfo = async () => {
  try {
    const response = await axiosInstance.get('exercises/{id}')
    return response.data
  } catch (error: any) {
    console.error('Error fetching sido names:', error.response)
    throw new Error('Failed to fetch health info')
  }
}
