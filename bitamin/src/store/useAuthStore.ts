import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  role: string | null
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  setRole: (role: string) => void
  clearAuth: () => void
}

function base64UrlDecode(str: string): string {
  try {
    // Base64URL 특수 문자 대체
    str = str.replace(/-/g, '+').replace(/_/g, '/')
    // Base64 디코딩을 위한 패딩 추가
    const pad = str.length % 4
    if (pad) {
      if (pad === 1) {
        throw new Error('Invalid Base64URL string')
      }
      str += new Array(5 - pad).join('=')
    }
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch (e) {
    console.error('Base64URL decoding failed', e)
    return ''
  }
}

function parseJwt(token: string): any {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    console.log('JWT parts:', parts)

    const base64Payload = parts[1]
    const payload = base64UrlDecode(base64Payload)
    console.log('Decoded Payload:', payload)

    return JSON.parse(payload)
  } catch (e) {
    console.error('JWT parsing failed', e)
    return null
  }
}

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      setAccessToken: (token) => {
        let role = null
        if (token) {
          const decodedToken = parseJwt(token)
          role = decodedToken ? decodedToken.role : null
        }
        set({ accessToken: token, role })
      },
      setRefreshToken: (token) => set({ refreshToken: token }),
      setRole: (role) => set({ role }),

      // 모두 null로 설정해서 사용자 로그아웃 상태로 변경
      clearAuth: () =>
        set({ accessToken: null, refreshToken: null, role: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 사용할 스토리지 (기본값은 localStorage)
    }
  )
)

export default useAuthStore
