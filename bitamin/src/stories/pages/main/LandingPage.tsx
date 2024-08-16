import React, { useEffect, useState } from 'react'
import AppRouter from '@/router/AppRouter'
import styles from 'styles/main/LandingPage.module.css'
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const typingDuration = 3000 // 타이핑 애니메이션 지속 시간 (3초)
    const waitDuration = 2000 // 타이핑 완료 후 대기 시간 (2초)
    const fadeOutDuration = 3000 // 페이드 아웃 애니메이션 시간 (3초)

    const timer = setTimeout(() => {
      setFadeOut(true) // 페이드아웃
      setTimeout(() => {
        navigate('/loginex') // 로그인 전 페이지 이동
      }, fadeOutDuration)
    }, typingDuration + waitDuration)

    return () => clearTimeout(timer)
  })

  return (
    <div className={`${styles.div} ${fadeOut ? styles.fadeOutBox : ''}`}>
      <div className={`${styles.betterTomorrowBetter} ${styles.typingDemo}`}>
        Better tomorrow, Better Mind
      </div>
      <div className={styles.bitamim}>BItAMin은 당신을 응원합니다</div>
      <div className={styles.child} />
      <div className={styles.item} />
    </div>
  )
}

export default LandingPage
