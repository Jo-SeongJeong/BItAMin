import axiosInstance from './axiosInstance'
// 회원 id, nickname 조회
export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get('/members/info')
    return response.data
  } catch (error: any) {
    console.error('Error fetching user information:', error.response || error)
    if (error.response && error.response.status === 404) {
      throw new Error('아이디가 없습니다.')
    } else {
      throw new Error('Failed to fetch user information')
    }
  }
}
// 로그인 시도하는 함수
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    console.error('Login error:', error.response || error.message)
    if (error.response && error.response.status === 404) {
      throw new Error('아이디가 없습니다.')
    } else {
      throw new Error('Login failed')
    }
  }
}

// 사용자 등록
export const registerUser = async (signupForm: any) => {
  try {
    const formData = new FormData()
    const memberDTO: any = {
      email: signupForm.email,
      name: signupForm.name,
      nickname: signupForm.nickname,
      password: signupForm.password,
      birthday: signupForm.birthday,
      sidoName: signupForm.sidoName,
      gugunName: signupForm.gugunName || null, // 구군이 없으면 null로 설정
      dongName: signupForm.dongName || null,
    }

    console.log('Sending memberDTO:', memberDTO) // 디버깅용 데이터 출력
    formData.append(
      'memberDTO',
      new Blob([JSON.stringify(memberDTO)], { type: 'application/json' })
    )

    if (signupForm.image) {
      formData.append('image', signupForm.image)
    }

    // 서버에 formData 전송
    const response = await axiosInstance.post('members/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to register')
  }
}
// 이메일 중복 확인 함수
export const checkEmail = async (email: string) => {
  try {
    const response = await axiosInstance.post(
      `/members/register/check-email/${email}`
    )
    return response.data // 1 : 중복 존재, 0 : 중복 없음
  } catch (error: any) {
    console.error('Error response: ', error.response)
    throw new Error('Failed to check email')
  }
}
// 닉네임 중복 확인 함수
export const checkNickname = async (nickname: string) => {
  try {
    const response = await axiosInstance.post(
      `/members/register/check-nickname/${nickname}`
    )
    return response.data // 0 (사용 가능), 1 (중복)
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to check nickname')
  }
}

// 시/도 목록을 가져오는 함수
export const fetchSidoNames = async () => {
  try {
    const response = await axiosInstance.get('members/sidoNames')
    return response.data // 시/도 이름 목록 (List<String>)
  } catch (error: any) {
    console.error('Error fetching sido names:', error.response || error)
    throw new Error('Failed to fetch sido names')
  }
}

// 특정 시/도에 해당하는 구군 목록을 가져오는 함수
export const fetchGugunNames = async (sidoName: string) => {
  try {
    const response = await axiosInstance.get('members/gugunNames', {
      params: { sidoName },
    })
    return response.data // 구군 이름 목록 (List<String>)
  } catch (error: any) {
    console.error('Error fetching gugun names:', error.response || error)
    if (error.response && error.response.status === 404) {
      throw new Error('해당 시/도에 구군 정보를 찾을 수 없습니다.')
    } else {
      throw new Error('Failed to fetch gugun names')
    }
  }
}

// 특정 시/도와 구군에 해당하는 동 목록을 가져오는 함수
export const fetchDongNames = async (sidoName: string, gugunName: string) => {
  try {
    const response = await axiosInstance.get('members/dongNames', {
      params: { sidoName, gugunName },
    })
    return response.data // 동 이름 목록 (List<String>)
  } catch (error: any) {
    console.error('Error fetching dong names:', error.response || error)
    if (error.response && error.response.status === 404) {
      throw new Error('해당 시/도와 구군에 동 정보를 찾을 수 없습니다.')
    } else {
      throw new Error('Failed to fetch dong names')
    }
  }
}

// 사용자 정보를 가져오는 함수
export const fetchUserInfo = async () => {
  try {
    const response = await axiosInstance.get('members/get-member')
    console.log(response.data)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch user information')
  }
}

// 사용자 정보를 업데이트하는 함수
export const updateUserInfo = async (userInfo: any) => {
  try {
    const memberUpdateRequestDTO = {
      email: userInfo.email,
      name: userInfo.name,
      nickname: userInfo.nickname,
      birthday: userInfo.birthday,
      sidoName: userInfo.sidoName,
      gugunName: userInfo.gugunName,
      dongName: userInfo.dongName,
      profileUrl: userInfo.profileUrl, // 기존 프로필 URL을 유지
    }

    const formData = new FormData()
    formData.append(
      'memberUpdateRequestDTO',
      new Blob([JSON.stringify(memberUpdateRequestDTO)], {
        type: 'application/json',
      })
    )

    // 이미지가 있을 경우에만 FormData에 추가
    if (userInfo.image) {
      formData.append('image', userInfo.image)
    }

    const response = await axiosInstance.put(
      'members/update-member',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to update user info')
  }
}

// 비밀번호 수정 기능
export const changePassword = async (passwordData: {
  currentPassword: string
  newPassword: string
}) => {
  try {
    const response = await axiosInstance.post(
      'members/change-password',
      passwordData
    )
    return response.data
  } catch (error: any) {
    console.error('Error response:', error.response)
    throw new Error('Failed to update user info')
  }
}

// 진단 데이터 받아오는 함수
export const fetchHealthReports = async () => {
  try {
    const response = await axiosInstance.get('members/self-assessment')
    return response.data // List<HealthReportResponseDTO> 반환
  } catch (error) {
    console.error('Error fetching health reports:', error)
    throw error
  }
}

export const HealthReportCheck = async () => {
  try {
    const response = await axiosInstance.get('members/self-assessment/check')
    return response.data
  } catch (error) {
    console.error('Error fetching health reports:', error)
    throw error
  }
}

export const kakaoLogin = async () => {
  window.location.href = "https://i11b105.p.ssafy.io/api/auth/kakao/login";
}

export const googleLogin = async () => {
  window.location.href = "https://i11b105.p.ssafy.io/api/auth/google/login";
}