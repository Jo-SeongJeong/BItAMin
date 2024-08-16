import React, { useState, useEffect } from 'react'
import { getExperience } from '@/api/missionAPI'
import axios from 'axios'
import styles from '/src/styles/mission/MissionPage.module.css'

import sunnyImg from '@/assets/weatherImage/sunny.png'
import blueCloudImg from '@/assets/weatherImage/blue_cloud.png'
import darkCloudImg from '@/assets/weatherImage/dark_cloud.png'
import rainyImg from '@/assets/weatherImage/rainy.png'
import snowImg from '@/assets/weatherImage/snow.png'

import sunnyBg from '@/assets/weatherImage/sunnybg.png'
import cloudyBg from '@/assets/weatherImage/darkcloudybg.jpg'
import rainyBg from '@/assets/weatherImage/rainybg.png'
import snowyBg from '@/assets/weatherImage/snowbg.png'
import blueCloudBg from '@/assets/weatherImage/bluecloudybg.jpg'

import { fetchUserInfo } from '@/api/userAPI'

import level1Gif from '@/assets/plant/level1.gif'
import level2Gif from '@/assets/plant/level2.gif'
import level3Gif from '@/assets/plant/level3.gif'

import exin from '@/assets/plant/exin.png'
import speech from '@/assets/plant/speech.png'
import clickme from '@/assets/image/clickme.png'

const MyPlant: React.FC = () => {
  const [experience, setExperience] = useState<number | null>(null)
  const [level, setLevel] = useState<number | null>(null)
  const [weatherSky, setWeatherSky] = useState<string | null>(null)
  const [weatherPty, setWeatherPty] = useState<string | null>(null)
  const [weatherImage, setWeatherImage] = useState<string | undefined>(undefined)
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined)
  const [tmp, setTmp] = useState<number | null>(null)
  const [pop, setPop] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [xCoordinate, setXCoordinate] = useState<number | null>(null)
  const [yCoordinate, setYCoordinate] = useState<number | null>(null)
  const [levelGif, setLevelGif] = useState<string | null>(null) // 레벨별 GIF 상태 추가
  const [showInfo, setShowInfo] = useState<boolean>(false) // 정보 표시 여부 상태 추가

  useEffect(() => {
    const calculateLevel = (experience: number) => {
      if (experience >= 0 && experience <= 45) return 1
      if (experience >= 50 && experience <= 95) return 2
      if (experience >= 100) return 3
      return null
    }

    const fetchExperience = async () => {
      try {
        const response = await getExperience()
        if (response && response.data) {
          const exp = response.data.experience
          setExperience(exp)
          const calculatedLevel = calculateLevel(exp)
          setLevel(calculatedLevel)

          // 레벨에 따른 GIF 설정
          switch (calculatedLevel) {
            case 1:
              setLevelGif(level1Gif)
              break
            case 2:
              setLevelGif(level2Gif)
              break
            case 3:
              setLevelGif(level3Gif)
              break
            default:
              setLevelGif(null)
              break
          }
        } else {
          console.error('Invalid response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching experience:', error)
      }
    }

    fetchExperience()
  }, [])

  useEffect(() => {
    const fetchAndSetUserInfo = async () => {
      try {
        const data = await fetchUserInfo()
        const xCoordinate = data.xcoordinate
        const yCoordinate = data.ycoordinate
        setXCoordinate(xCoordinate)
        setYCoordinate(yCoordinate)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }

    fetchAndSetUserInfo()
  }, [])

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (xCoordinate === null || yCoordinate === null) return // 좌표가 없으면 함수 종료

      const API_URL = import.meta.env.VITE_APP_WEATHER_URL

      const today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + 1
      let day = today.getDate()
      // @ts-ignore
      month = month < 10 ? `0${month}` : month
      // @ts-ignore
      day = day < 10 ? `0${day}` : day
      const todayStr = `${year}${month}${day}`

      const times = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300']

      const getClosestTime = () => {
        const now = today.getHours() * 100 + today.getMinutes()
        return times.reduce((prev, curr) => Math.abs(Number(curr) - now) < Math.abs(Number(prev) - now) ? curr : prev)
      }

      const closestTime = getClosestTime()
      const ServiceKey = import.meta.env.VITE_APP_WEATHER_KEY
      try {
        const response = await axios.get(API_URL, {
          params: {
            ServiceKey: ServiceKey,
            dataType: 'JSON',
            base_date: todayStr,
            base_time: closestTime,
            numOfRows: 15,
            nx: xCoordinate,
            ny: yCoordinate,
          },
          responseType: 'json',
        })

        if (response.data.response?.body?.items?.item) {
          const data = response.data.response.body.items.item
          data.forEach((item: any) => {
            switch (item.category) {
              case 'TMP':
                setTmp(Number(item.fcstValue))
                break
              case 'SKY':
                switch (item.fcstValue) {
                  case '1':
                    setWeatherSky('맑음')
                    setWeatherImage(sunnyImg)
                    setBackgroundImage(sunnyBg)
                    break
                  case '3':
                    setWeatherSky('구름많음')
                    setWeatherImage(blueCloudImg)
                    setBackgroundImage(blueCloudBg)
                    break
                  case '4':
                    setWeatherSky('흐림')
                    setWeatherImage(darkCloudImg)
                    setBackgroundImage(cloudyBg)
                    break
                }
                break
              case 'PTY':
                switch (item.fcstValue) {
                  case '0':
                    setWeatherPty('없음')
                    break
                  case '1':
                    setWeatherPty('비')
                    setWeatherImage(rainyImg)
                    setBackgroundImage(rainyBg)
                    break
                  case '2':
                    setWeatherPty('비/눈')
                    setWeatherImage(rainyImg)
                    setBackgroundImage(rainyBg)
                    break
                  case '3':
                    setWeatherPty('눈')
                    setWeatherImage(snowImg)
                    setBackgroundImage(snowyBg)
                    break
                  case '4':
                    setWeatherPty('소나기')
                    setWeatherImage(rainyImg)
                    setBackgroundImage(rainyBg)
                    break
                  default:
                    setWeatherPty('알 수 없음')
                }
                break
              case 'POP':
                setPop(Number(item.fcstValue))
                break
            }
          })
        } else {
          console.log('응답데이터 없음')
        }
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }

    fetchWeatherData()
  }, [xCoordinate, yCoordinate]) // xCoordinate와 yCoordinate가 변경될 때마다 호출

  const handleImageClick = () => {
    setShowInfo(!showInfo) // 클릭 시 showInfo 상태 반전
  }

  return (
    <div className={styles.plantBox} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <img src={clickme} alt="" className={styles.clickme}/>
      <img
        src={exin}
        alt="experienceInfoImg"
        className={styles.experienceInfoImg}
        onClick={handleImageClick} // 이미지를 클릭할 때 handleImageClick 함수 실행
      />
      {showInfo && (
        <>
          <div className={styles.postitContainer}>
            <img src={speech} alt="Post-it" />
            <div className={styles.textOverlay}>
              <h3>내 식물 정보🎍</h3>
              <p>레벨: {level}</p>
              <p>경험치: {experience}exp</p>
              <h3>오늘의 날씨🌈</h3>
              <p>하늘 상태: {weatherSky}</p>
              <p>기온: {tmp}℃</p>
            </div>
          </div>
        </>
      )}
      <img
        src={levelGif ?? undefined}  // null일 경우 undefined로 변환
        alt={`레벨 ${level} GIF`}
        className={`${styles.levelGif} ${level === 2 ? styles.level2Gif : ''}`}
      />
    </div>
  )
}

export default MyPlant
