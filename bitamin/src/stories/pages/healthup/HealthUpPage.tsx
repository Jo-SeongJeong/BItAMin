import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as tmPose from '@teachablemachine/pose'
import exerciseAPI from '@/api/exerciseAPI'
import styles from '@/styles/healthup/HealthUpPage.module.css'

interface execrciseModelInterface {
  id: number
  modelUrl: string
  firstExercise: number
  secondExercise: number
  thirdExercise: number
}

interface exerciseDescriptionInterface {
  id: number
  title: string
  description: string
  level: number
  exerciseUrl: string
}

const HealthUP: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [labelContainer, setLabelContainer] = useState<string[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  // location.state를 안전하게 처리
  const level = location.state?.level || 1

  const [execrciseModel, setExecrciseModel] = useState<execrciseModelInterface>(
    {
      id: 3,
      modelUrl: 'https://teachablemachine.withgoogle.com/models/3a3h7O3tf/',
      firstExercise: 10,
      secondExercise: 11,
      thirdExercise: 12,
    }
  )

  const [firstExercise, setFirstExercise] =
    useState<exerciseDescriptionInterface>({
      id: 0,
      title: '첫 번째 운동',
      description: '',
      level: 0,
      exerciseUrl: '',
    })

  const [secondExercise, setSecondExercise] =
    useState<exerciseDescriptionInterface>({
      id: 0,
      title: '두 번째 운동',
      description: '',
      level: 0,
      exerciseUrl: '',
    })

  const [thirdExercise, setThirdExercise] =
    useState<exerciseDescriptionInterface>({
      id: 0,
      title: '세 번째 운동',
      description: '',
      level: 0,
      exerciseUrl: '',
    })

  const [exerciseDescription, setExerciseDescription] =
    useState<exerciseDescriptionInterface>({
      id: 5,
      title: '자세 이름',
      description: '',
      level: 2,
      exerciseUrl:
        'https://bitamin-sassack.s3.ap-northeast-2.amazonaws.com/381495f2-8b15-46c9-b09f-0ae4407db89e_mainQuestImg.png',
    })

  const [predictContainer, setPredictContainer] = useState<number>(0)
  const [count, setCount] = useState<number>(500) // initialize count for the pose
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(1) // index to keep track of current model
  const modelRef = useRef<tmPose.CustomPoseNet | null>(null)
  const webcamRef = useRef<tmPose.Webcam | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  // const [buttonText, setButtonText] = useState<string>('시작 하기')

  useEffect(() => {
    const init = async () => {
      try {
        const response = await exerciseAPI.fetchExerciseModel(level)
        setExecrciseModel(response)

        const modelURL = response.modelUrl + 'model.json'
        const metadataURL = response.modelUrl + 'metadata.json'

        // 모델 세팅하기
        const model = await tmPose.load(modelURL, metadataURL)
        modelRef.current = model

        // 웹캠 세팅하기
        const webcam = new tmPose.Webcam(585, 485, true) // Increase width and height
        await webcam.setup() // request access to the webcam
        await webcam.play()
        webcamRef.current = webcam
        window.requestAnimationFrame(loop)

        const canvas = canvasRef.current
        if (canvas) {
          canvas.width = 897 // Increased width
          canvas.height = 897 // Increased height
          ctxRef.current = canvas.getContext('2d')
        }

        // 자세 이름 세팅하기
        const labels = await model.getClassLabels()
        setLabelContainer(labels)

        // 각 운동의 제목을 가져오기
        const firstExerciseInfo = await exerciseAPI.fetchExercise(
          response.firstExercise
        )
        setFirstExercise(firstExerciseInfo)

        const secondExerciseInfo = await exerciseAPI.fetchExercise(
          response.secondExercise
        )
        setSecondExercise(secondExerciseInfo)

        const thirdExerciseInfo = await exerciseAPI.fetchExercise(
          response.thirdExercise
        )
        setThirdExercise(thirdExerciseInfo)
      } catch (error) {
        console.error('Error during model initialization:', error)
        navigate('/healthuplist') // 에러 발생 시 에러 페이지로 리디렉션
      }
    }

    init()

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop()
      }
    }
  }, [level, navigate]) // 의존성 배열에 level과 navigate 추가

  // useEffect(() => {
  //   if (count === 0) {
  //     setButtonText('다음')
  //   }
  // }, [count])

  // const nextPose = async () => {
  //   setCurrentModelIndex((prevIndex) => prevIndex + 1)

  //   try {
  //     let description
  //     if (currentModelIndex === 1) {
  //       description = await exerciseAPI.fetchExercise(
  //         execrciseModel.firstExercise
  //       )
  //     } else if (currentModelIndex === 2) {
  //       description = await exerciseAPI.fetchExercise(
  //         execrciseModel.secondExercise
  //       )
  //     } else if (currentModelIndex === 3) {
  //       description = await exerciseAPI.fetchExercise(
  //         execrciseModel.thirdExercise
  //       )
  //     } else {
  //       // 마지막 운동 이후에 다른 곳으로 라우팅 시키기
  //       navigate('/healthuplist')
  //       return
  //     }

  //     setExerciseDescription(description)
  //     setCount(500)
  //     // setButtonText('다음')
  //   } catch (error) {
  //     console.error('Error fetching next exercise:', error)
  //   }
  // }

  const handleExit = () => {
    if (webcamRef.current) {
      webcamRef.current.stop() // 웹캠 중지
    }
    navigate('/healthuplist') // '나가기' 버튼을 클릭 시 healthuplist로 이동
  }

  const loop = async () => {
    if (webcamRef.current && modelRef.current) {
      webcamRef.current.update() // update the webcam frame
      await predict()
      window.requestAnimationFrame(loop)
    }
  }

  const predict = async () => {
    if (modelRef.current && webcamRef.current) {
      const { pose, posenetOutput } = await modelRef.current.estimatePose(
        webcamRef.current.canvas
      )
      const prediction = await modelRef.current.predict(posenetOutput)

      if (currentModelIndex < prediction.length) {
        const currentPrediction = prediction[currentModelIndex]

        if (currentPrediction && currentPrediction.probability > 0.7) {
          setCount((prevCount) => Math.max(prevCount - 1, 0))
          setPredictContainer(currentPrediction.probability)
        } else {
          console.error('Probability is undefined or below threshold')
          console.log('Probability Value:', currentPrediction?.probability)
        }
      } else {
        console.error('Prediction index out of bounds')
      }

      drawPose(pose)
    }
  }

  const drawPose = (pose: any) => {
    if (webcamRef.current && ctxRef.current) {
      ctxRef.current.drawImage(webcamRef.current.canvas, 0, 0)
    }
  }

  return (
    <div style={{ paddingTop: '6%' }}>
      <div className={styles.up}>
        <div className={styles.upChild} />
        <img
          className={styles.upItem}
          alt="운동url"
          src={exerciseDescription.exerciseUrl}
        />
        <div className={styles.rectangleParent}>
          <div className={styles.div}>{(count / 100).toFixed(2)}</div>
          <div className={styles.canvasContainer}>
            <canvas ref={canvasRef} className={styles.canvas} />
          </div>
        </div>
        <div className={styles.rectangleDiv} />
        <div className={styles.rectangleGroup} onClick={handleExit}>
          <div className={styles.groupItem} />
          <b className={styles.b}>나가기</b>
        </div>
        <b className={styles.b1}>{exerciseDescription.title}</b>
        <div style={{ bottom: 0 }}>
          <div
            className={styles.div2}
            onClick={() => setExerciseDescription(firstExercise)} // firstExercise의 정보를 가져오는 함수 연결
          >
            {firstExercise.title} {/* firstExercise의 title을 여기에 표시 */}
          </div>
          <div
            className={styles.div22}
            onClick={() => setExerciseDescription(secondExercise)} // firstExercise의 정보를 가져오는 함수 연결
          >
            {secondExercise.title} {/* SecondExercise의 title을 여기에 표시 */}
          </div>
          <div
            className={styles.div222}
            onClick={() => setExerciseDescription(thirdExercise)} // firstExercise의 정보를 가져오는 함수 연결
          >
            {thirdExercise.title} {/* firstExercise의 title을 여기에 표시 */}
          </div>
        </div>
        <div className={styles.div13}>
          <p className={styles.p}>{exerciseDescription.description}</p>
        </div>
        <div className={styles.upChild2} />
        <div className={styles.upChild3} />
        <div className={styles.div14}>하루 홈트</div>
        {/* <div className={styles.canvasContainer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div> */}
      </div>
    </div>
  )
}

export default HealthUP
