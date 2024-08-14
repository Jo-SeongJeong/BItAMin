import axiosInstance from 'api/axiosInstance'

export const fetchParticipants = async () => {
  const response = await axiosInstance.get('consultations/recent-participants')
  return response.data
}

export default {
  fetchParticipants,
}
