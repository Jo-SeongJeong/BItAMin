import { useCallback, useEffect, useState } from 'react'
import styles from 'styles/healthup/HealthUpListPage.module.css'
import { useNavigate } from 'react-router-dom'
import homeExerciseImg from 'assets/image/homeExercise.png'
import YogaExerciseImg from 'assets/image/YogaExercise.png'

const UP: React.FC = () => {
  const navigate = useNavigate()
  // 하루요가
  const onYogaClick = useCallback(() => {
    console.log('Navigating to HealthUP with level 1')

    navigate('/healthup', { state: { level: 1 } }) // level 1: 하루 요가
  }, [navigate])

  // 하루홈트
  const onHomeTrainingClick = useCallback(() => {
    navigate('/healthup', { state: { level: 2 } }) // level 2: 하루 홈트
  }, [navigate])

  return (
    <div className={styles.up}>
      <div className={styles.upChild} />
      {/* 하루 요가 영역 */}
      <div className={styles.groupChildht} onClick={onYogaClick} />
      <div className={styles.groupChildht3} />
      <div className={styles.homet}>
        <div className={`${styles.div2} SMN_effect-46`}>
          <a href="#" onClick={onYogaClick}>
            하루 요가
          </a>
        </div>
        <img
          className={styles.homeExerciseImg}
          alt="하루 요가"
          src={homeExerciseImg}
          onClick={onYogaClick} // 이미지 클릭 시 onYogaClick 호출
        />
      </div>
      {/* 하루 홈트 영역 */}
      <div className={styles.groupChild} onClick={onHomeTrainingClick} />
      <div className={styles.groupChild3} />
      <div className={styles.homet}>
        <div className={`${styles.div1} SMN_effect-46`}>
          <a href="#" onClick={onHomeTrainingClick}>
            하루 홈트
          </a>
        </div>
        <img
          className={styles.YogaExerciseImg}
          alt="하루 홈트"
          src={YogaExerciseImg}
        />
      </div>
    </div>
  )
}

export default UP
