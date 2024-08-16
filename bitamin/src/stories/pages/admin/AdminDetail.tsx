import { useState, useEffect } from 'react'
import styles from 'styles/admin/AdiminPage.module.css'
import {
  fetchComplaintDetail,
  updateComplaintStopDate,
} from '@/api/complaintsAPI'
import useAuthStore from '@/store/useAuthStore'
import { useParams } from 'react-router-dom'

interface ComplaintDetail {
  id: number
  complainantNickname: string
  respondentNickname: string
  content: string
  category: number
  sendDate: string
  stopDate: number
  judgementCount: number
  judgementDate: number
}

const AdminDetail: React.FC = () => {
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null)
  const { id } = useParams<{ id: string }>()
  const { accessToken } = useAuthStore()
  const [selectedStopDate, setSelectedStopDate] = useState<number | null>(null)
  const [updateMessage, setUpdateMessage] = useState<string | null>(null)

  useEffect(() => {
    const getComplaintDetail = async () => {
      try {
        if (id) {
          const complaintData = await fetchComplaintDetail(parseInt(id))
          setComplaint(complaintData)
          setSelectedStopDate(complaintData.stopDate)
          console.log('Complaint Detail:', complaintData) // 콘솔에 출력
        }
      } catch (error) {
        console.error('Failed to fetch complaint detail', error)
      }
    }

    if (accessToken) {
      getComplaintDetail()
    }
  }, [id, accessToken])
  const handleStopDateChange = async (newStopDate: number) => {
    if (id) {
      try {
        await updateComplaintStopDate(parseInt(id), newStopDate)
        setSelectedStopDate(newStopDate)
        setUpdateMessage('정지 기간이 성공적으로 업데이트되었습니다.')
        console.log(
          `Updated stop date for complaint ID ${id} to ${newStopDate}`
        )
      } catch (error) {
        setUpdateMessage('정지 기간 업데이트에 실패했습니다.')
        console.error('Failed to update stop date', error)
      }
    }
  }

  if (!complaint) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.detailContainer}>
      <h1>신고 상세 내역</h1>
      <p>신고 ID: {complaint.id}</p>
      <p>신고자: {complaint.complainantNickname}</p>
      <p>피신고자: {complaint.respondentNickname}</p>
      <p>신고 내용: {complaint.content}</p>
      <p>카테고리: {complaint.category}</p>
      <p>신고일시: {new Date(complaint.sendDate).toLocaleDateString()}</p>
      <p>
        정지 기간:
        <select
          value={selectedStopDate ?? complaint.stopDate}
          onChange={(e) => handleStopDateChange(parseInt(e.target.value))}
        >
          <option value={0}>전과 동일</option>
          <option value={1}>1일</option>
          <option value={3}>3일</option>
          <option value={7}>7일</option>
        </select>
      </p>
      <p>판결 수: {complaint.judgementCount}</p>
      <p>판결일시: {complaint.judgementDate}</p>
    </div>
  )
}

export default AdminDetail
