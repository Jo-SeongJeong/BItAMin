import axiosInstance from './axiosInstance'

export const fetchMessages = async () => {
  const response = await axiosInstance.get('/messages')
  return response.data
}

export const fetchMessageDetail = async (messageId: number) => {
  const response = await axiosInstance.get(`/messages/${messageId}`)
  return response.data
}

export default {
  fetchMessages,
  fetchMessageDetail,
}
