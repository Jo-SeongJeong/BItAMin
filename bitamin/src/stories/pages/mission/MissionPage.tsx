import React, { useEffect, useState } from 'react'
import MissionForm from '@/stories/pages/mission/MissionForm'
import Calendar from '@/stories/pages/mission/Calendar'
import CompleteMission from '@/stories/pages/mission/CompleteMission'
import { fetchMissionsByDate } from '@/api/missionAPI'
import styles from '/src/styles/mission/MissionPage.module.css'
import MyPlant from '@/stories/pages/mission/MyPlant'

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hasCompletedTodayMission, setHasCompletedTodayMission] = useState<boolean>(false)
  const todayDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '')

  useEffect(() => {
    const checkTodayMission = async () => {
      try {
        const response = await fetchMissionsByDate(todayDate)
        if (response.success && response.data) {
          setHasCompletedTodayMission(true)
        } else {
          setHasCompletedTodayMission(false)
        }
      } catch (error) {
        console.error('오늘 미션 데이터를 가져오는 중 오류가 발생했습니다.', error)
        setHasCompletedTodayMission(false)
      }
    }

    checkTodayMission()
  }, [todayDate])

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }
  return (
    <div className={styles.container}>
      <div className={styles.plant}>
        <MyPlant />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.calendar}>
          <Calendar onDateChange={handleDateChange} />
        </div>
        <div className={styles.missionSection}>
          <div className={styles.missionContainer}>
            {!hasCompletedTodayMission && selectedDate?.toISOString().split('T')[0] === todayDate && (
              <MissionForm onMissionComplete={() => setHasCompletedTodayMission(true)} />
            )}
            <CompleteMission selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
