import axiosInstance from './axiosInstance.ts'
import axios from 'axios'

const BASE_URL = 'https://i11b105.p.ssafy.io/api'

// 오늘의 문구 가져오기
export const getPhrases = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/phrases`)
    return response.data
  } catch (error) {
    console.error('Error fetching the phrase:', error)
    throw error
  }
}

// 녹음 저장
export const saveAudio = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/missions/phrases`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  } catch (error) {
    console.error('Error submitting mission:', error)
    throw error
  }
};

// 선택일 녹음 기록 가져오기
export const getMemberPhraseByDate = async (date: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/phrases/recorded`, {
      params: {
        date: date,
      },
    })
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error instanceof Error && (error as any).response?.status !== 500) {
        console.error('Error fetching record:', error)
      }
    } else {
      console.error('Unexpected error:', error)
    }
    throw error;
  }
}

