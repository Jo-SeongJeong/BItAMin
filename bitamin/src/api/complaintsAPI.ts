import axiosInstance from './axiosInstance'

// 신고 제출 함수
export const submitReport = async (
  respondentId: string,
  selectedCategories: number,
  content: string,
  type: number // 기본값으로 1(쪽지 신고)을 설정
) => {
  try {
    const response = await axiosInstance.post('/complaints', {
      respondentId,
      category: selectedCategories,
      content,
      type,
    })
    console.log('신고가 성공적으로 접수되었습니다.')
    return response.data
  } catch (error: any) {
    console.error('신고 접수 중 오류 발생:', error)
    throw new Error('신고 접수에 실패하였습니다.')
  }
}

// 모든 신고 목록 가져오기
export const fetchComplaintList = async () => {
  try {
    console.log('Fetching complaints list...')
    const response = await axiosInstance.get('/complaints')
    console.log('Response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to fetch ComplaintList')
  }
}

// 특정 신고 상세 내용 가져오기
export const fetchComplaintDetail = async (id: number) => {
  try {
    console.log(`Fetching complaint detail for ID: ${id}`)
    const response = await axiosInstance.get(`/complaints/${id}`)
    console.log('Response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to fetch ComplaintDetail')
  }
}

// 신고 처리 중지 날짜 업데이트
export const updateComplaintStopDate = async (id: number, stopDate: number) => {
  try {
    console.log(`Updating complaint stop date for ID: ${id} to ${stopDate}`)
    const response = await axiosInstance.patch(`/complaints/${id}/${stopDate}`)
    console.log('Update response received:', response.data)
    return response.data
  } catch (error: any) {
    if (error.response) {
      console.error('Response error data:', error.response.data)
      console.error('Response status:', error.response.status)
      console.error('Response headers:', error.response.headers)
    } else if (error.request) {
      console.error('Request error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    throw new Error('Failed to update ComplaintStopDate')
  }
}
