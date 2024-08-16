import React, { useState, useEffect, useCallback } from 'react'
import { fetchParticipants } from 'api/participantsAPI'
import MessageModal from './MessageModal'
import { BsSend } from 'react-icons/bs'

interface Participant {
  id: number
  memberId: number
  memberNickname: string
  consultationId: number
  consultationDate: string
}

const ParticipantListPage: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const loadParticipants = async () => {
      const data = await fetchParticipants()
      setParticipants(data)
    }

    loadParticipants()
  }, [])

  const openModal = useCallback((participant: Participant) => {
    setSelectedParticipant(participant)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  return (
    <div className="mx-auto" style={{ marginLeft: '20%', marginRight: '20%' }}>
      <div className="flex space-x-4 mb-4">
        <span className="text-gray-600">2024-07-17</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center border-b pb-4">
            <span
              className="font-semibold"
              onClick={() => openModal(participant)}
            >
              {participant.memberNickname}
            </span>
            <BsSend className="ml-2" onClick={() => openModal(participant)} />
          </div>
        ))}
      </div>
      {isModalOpen && selectedParticipant && (
        <MessageModal participant={selectedParticipant} onClose={closeModal} />
      )}
    </div>
  )
}

export default ParticipantListPage
