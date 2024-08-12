import axiosInstance from './axiosInstance'

export const fetchExercise = async (id: number) => {
  const response = await axiosInstance.get(`/exercises/${id}`)
  return response.data
}

export const fetchExcerciseModel = async (level: number) => {
  const response = await axiosInstance.get(`/exercises/model/${level}`)
  return response.data
}

export default {
  fetchExercise,
  fetchExcerciseModel,
}
