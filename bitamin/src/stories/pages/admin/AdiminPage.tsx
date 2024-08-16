import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from 'styles/admin/AdiminPage.module.css'
import { fetchComplaintList } from '@/api/complaintsAPI'
import useAuthStore from '@/store/useAuthStore'

interface Complaint {
  id: number
  complainantNickname: string
  respondentNickname: string
  sendDate: string
}

const AdiminPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()

  useEffect(() => {
    const getComplaints = async () => {
      try {
        const complaintsData = await fetchComplaintList()
        setComplaints(complaintsData)
        console.log('Complaints Data:', complaintsData) // 콘솔에 출력
      } catch (error) {
        console.error('Failed to fetch complaints', error)
      }
    }

    if (accessToken) {
      getComplaints()
    }
  }, [accessToken])

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  const onContainerClick = useCallback(() => {
    navigate('/')
  }, [navigate])
  const handleComplaintClick = (id: number) => {
    navigate(`/admin/${id}`)
  }

  return (
    <>
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.inner}>
          <div className={styles.wrapper}>
            <div className={styles.text}>신고 내역</div>
          </div>
        </div>
        {complaints.length === 0 ? (
          <div className={styles.noData}>신고 내역이 없습니다.</div>
        ) : (
          <div className={styles.table} onClick={openFrame}>
            <div className={styles.column0}>
              <div className={styles.textWrapper}>
                <div className={styles.text}>비고</div>
              </div>
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={styles.column0Inner}
                  onClick={() => handleComplaintClick(complaint.id)}
                >
                  <div className={styles.textContainer}>
                    <div className={styles.text}>{complaint.id}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.column1}>
              <div className={styles.textWrapper15}>
                <div className={styles.text}>신고자</div>
              </div>
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={styles.column1Inner}
                  onClick={() => handleComplaintClick(complaint.id)}
                >
                  <div className={styles.textWrapper16}>
                    <div className={styles.text}>
                      {complaint.complainantNickname}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.column2}>
              <div className={styles.textWrapper15}>
                <div className={styles.text}>피신고자</div>
              </div>
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={styles.column1Inner}
                  onClick={() => handleComplaintClick(complaint.id)}
                >
                  <div className={styles.textWrapper16}>
                    <div className={styles.text}>
                      {complaint.respondentNickname}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.column2}>
              <div className={styles.textWrapper15}>
                <div className={styles.text}>신고일시</div>
              </div>
              {complaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className={styles.column1Inner}
                  onClick={() => handleComplaintClick(complaint.id)}
                >
                  <div className={styles.textWrapper16}>
                    <div className={styles.text}>
                      {new Date(complaint.sendDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdiminPage
