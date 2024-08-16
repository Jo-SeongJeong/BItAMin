import axiosInstance from './axiosInstance'

export const fetchMessages = async () => {
  const response = await axiosInstance.get('/messages')
  return response.data
}

export const fetchMessageDetail = async (messageId: number) => {
  const response = await axiosInstance.get(`/messages/${messageId}`)
  return response.data
}

export const createMessage = async (messageData: {
  receiverId: number
  category: string
  title: string
  content: string
  counselingDate: string
}) => {
  const response = await axiosInstance.post(`/messages`, messageData)
  return response.data
}

export const createReply = async (
  messageId: number,
  replyData: { content: string }
) => {
  const response = await axiosInstance.post(`/messages/${messageId}`, replyData)
  return response.data
}

export const deleteMessage = async (messageId: number) => {
  const response = await axiosInstance.delete(`/messages/${messageId}`)
  return response.data
}

export const deleteReply = async (replyId: number) => {
  const response = await axiosInstance.delete(`/messages/replies/${replyId}`)
  return response.data
}

export default {
  fetchMessages,
  fetchMessageDetail,
  createMessage,
  createReply,
  deleteMessage,
  deleteReply,
}
