import axiosInstance from './axiosInstance'

export const fetchExercise = async (id: number) => {
  const response = await axiosInstance.get(`/exercises/${id}`)
  return response.data
}

// 종류 level(1:스트레칭, 2:요가)
export const fetchExerciseModel = async (level: number) => {
  const response = await axiosInstance.get(`/exercises/model/${level}`)
  return response.data
}

export default {
  fetchExercise,
  fetchExerciseModel,
}
