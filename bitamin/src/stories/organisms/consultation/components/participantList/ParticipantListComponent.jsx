import React from 'react'
import './ParticipantListComponent.css' // 스타일을 추가하고 싶으면 별도의 CSS 파일을 만드세요

const ParticipantListComponent = ({ subscribers, localUser }) => {
  return (
    <div className="participant-list">
      <h3>Participants</h3>
      <ul>
        {localUser && (
          <li key={localUser.getConnectionId()}>
            {localUser.getNickname()} (You)
          </li>
        )}
        {subscribers.map((sub, index) => (
          <li key={sub.getConnectionId()}>{sub.getNickname()}</li>
        ))}
      </ul>
    </div>
  )
}

export default ParticipantListComponent
