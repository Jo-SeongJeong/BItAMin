// src/types/userTypes.ts
export interface User {
  email: string
  name: string
  nickname: string
  birthday: string
  sidoName: string
  gugunName: string
  dongName: string
  image: File | null // 새로 업로드할 파일
  profileUrl: string | null // 서버에서 받아온 이미지 URL
}
