import React from 'react'
import useAuthStore from 'store/useAuthStore'
import { fetchMessages } from 'api/messageAPI'

const ComponentPage: React.FC = () => {
  const {
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    clearAuth,
  } = useAuthStore()

  const handleFetchMessages = async () => {
    try {
      const messages = await fetchMessages()
      console.log('Messages:', messages)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  return (
    <div>
      <button onClick={() => setAccessToken('newAccessToken')}>
        Set Access Token
      </button>
      <button onClick={() => setRefreshToken('newRefreshToken')}>
        Set Refresh Token
      </button>
      <button onClick={clearAuth}>Clear Tokens</button>
      <button onClick={handleFetchMessages}>Fetch Messages</button>
      <p>Current Access Token: {accessToken}</p>
      <p>Current Refresh Token: {refreshToken}</p>
    </div>
  )
}

export default ComponentPage
