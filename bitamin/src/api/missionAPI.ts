import axiosInstance from './axiosInstance'

const BASE_URL = 'https://i11b105.p.ssafy.io/api'

// 미션 불러오기
export const getMission = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions`)
    return response.data;
  } catch (error) {
    console.error('Error fetching mission:', error);
    throw error;
  }
}

// 미션 교체하기
export const substituteMission = async (missionId: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/substitute`, {
      params: { missionId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 월간 미션 및 문구 조회
export const fetchMonthMissionAndPhrase = async (date: string) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/month`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 선택일 미션 기록 가져오기
export const fetchMissionsByDate = async (completeDate: string) => {
  try {
    const response = await axiosInstance.get('/missions/completed', {
      params: { date: completeDate }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 미션 제출하기
export const submitMission = async (missionData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/missions`,
      missionData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 경험치
export const getExperience = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/plant`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 미션 id로 미션 설명 가져오기
export const fetchMissionById = async (missionId: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/description`, {
      params: { missionId: missionId }
    })
    return response.data;
  } catch (error) {
    throw error;
  }
}