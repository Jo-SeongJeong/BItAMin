import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import CheckModal from '@/stories/organisms/CheckModal'

const questions = [
  '평소에는 아무렇지도 않던 일들이 괴롭고 귀찮게 느껴졌다.',
  '먹고 싶지 않았고 식욕이 없었다.',
  '어느 누가 도와준다 하더라도, 나의 울적한 기분을 떨쳐버릴 수 없을 것 같았다.',
  '무슨 일을 하던 정신을 집중하기가 어려웠다.',
  '비교적 잘 지냈다.',
  '상당히 우울했다.',
  '모든 일들이 힘들게 느껴졌다.',
  '앞일이 암담하게 느껴졌다.',
  '지금까지의 내 인생은 실패작이라는 생각이 들었다.',
  '적어도 보통 사람들만큼의 능력은 있었다고 생각한다.',
  '잠을 설쳤다(잠을 잘 이루지 못했다).',
  '두려움을 느꼈다.',
  '평소에 비해 말수가 적었다.',
  '세상에 홀로 있는 듯한 외로움을 느꼈다.',
  '큰 불만 없이 생활했다.',
  '사람들이 나에게 차갑게 대하는 것 같았다.',
  '갑자기 울음이 나왔다.',
  '마음이 슬펐다.',
  '사람들이 나를 싫어하는 것 같았다.',
  '도무지 뭘 해 나갈 엄두가 나지 않았다.',
]

const SurveyPage: React.FC = () => {
  const [scores, setScores] = useState<number[]>(Array(20).fill(-1))
  const [canTakeSurvey, setCanTakeSurvey] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [isCheckModalOpen, setCheckModalOpen] = useState(false)

  const closeCheckModal = () => {
    setCheckModalOpen(false)
  }

  const handleConfirm = async () => {
    // 확인 버튼 클릭 시의 로직
    closeCheckModal()
    navigate('/mypage')
  }

  const handleSecondaryAction = () => {
    closeCheckModal()
    navigate('/home')
  }

  useEffect(() => {
    const checkSurveyEligibility = async () => {
      try {
        const response = await axiosInstance.get(
          '/members/self-assessment/check'
        )
        const { result } = response.data

        if (result === 0) {
          setCanTakeSurvey(true)
        } else {
          setCanTakeSurvey(false)
        }
      } catch (error) {
        console.error('Error checking survey eligibility:', error)
        setCanTakeSurvey(false)
      } finally {
        setLoading(false)
      }
    }

    checkSurveyEligibility()
  }, [])

  const handleScoreChange = useCallback((index: number, score: number) => {
    setScores((prevScores) => {
      const newScores = [...prevScores]
      newScores[index] = score
      return newScores
    })
  }, [])

  const handleSubmit = useCallback(async () => {
    if (scores.includes(-1)) {
      alert('모든 질문에 답변해 주세요.')
      return
    }

    const totalScore = scores.reduce((acc, score) => acc + score, 0)
    const data = { checkupScore: totalScore }

    try {
      await axiosInstance.post(
        '/members/self-assessment',
        data
      )
      setCheckModalOpen(true)
    } catch (error) {
      console.error('점수 전송 실패:', error)
      alert('점수 전송에 실패했습니다.')
    }
  }, [scores])

  if (loading) {
    return <div>로딩 중...</div>
  }

  if (!canTakeSurvey) {
    return (
      <div>
        이미 지난 일주일 동안 설문조사를 완료하셨습니다. 나중에 다시
        시도해주세요.
      </div>
    )
  }

  return (
    <>
      <div className="relative w-full min-h-[410vh] bg-white text-center font-nanumGothic">
        <div className="absolute top-0 left-0 w-full h-[15%] bg-[#f9ea9b]" />

        <div className="relative top-[calc(9/16*100vw*0.2)] left-[calc(50%-512px)] w-[1024px]">
          <div className="relative w-[80%] mx-auto">
            <div className="relative bg-white shadow-md rounded-lg p-8 mt-10">
              <div className="text-2xl font-bold">우울증 척도 (CES-D)</div>
              <b className="block text-sm mt-4 text-lg text-gray-600">
                지난 1주 동안 당신이 느끼고 행동한 것을 가장 잘 나타낸다고
                생각되는 답변에 체크해주세요.
              </b>
            </div>
            {questions.map((question, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-8 mt-10"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#ff713c] text-white rounded-full">
                    {index + 1}
                  </div>

                  <div className="ml-4 flex-1 text-left text-darkslategray">
                    {question}
                  </div>
                </div>
                <div className="flex mt-4 space-x-4 text-sm text-gray-600 justify-center items-center">
                  <button
                    className={`px-4 py-2 rounded ${scores[index] === 0 ? 'bg-[#ff713c] text-white' : 'bg-gray-200'}`}
                    onClick={() => handleScoreChange(index, 0)}
                  >
                    극히 드물게 (0점)
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${scores[index] === 1 ? 'bg-[#ff713c] text-white' : 'bg-gray-200'}`}
                    onClick={() => handleScoreChange(index, 1)}
                  >
                    가끔 (1점)
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${scores[index] === 2 ? 'bg-[#ff713c] text-white' : 'bg-gray-200'}`}
                    onClick={() => handleScoreChange(index, 2)}
                  >
                    자주 (2점)
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${scores[index] === 3 ? 'bg-[#ff713c] text-white' : 'bg-gray-200'}`}
                    onClick={() => handleScoreChange(index, 3)}
                  >
                    대부분 (3점)
                  </button>
                </div>
              </div>
            ))}

            {/* 버튼 위치 */}
            <div className="mt-10 flex justify-center space-x-4">
              <button
                className="w-[113px] h-[31px] bg-[#ff713c] text-white rounded-lg flex items-center justify-center"
                onClick={handleSubmit}
              >
                설문 완료
              </button>
              <button
                className="w-[113px] h-[31px] border border-[#ff713c] text-[#ff713c] rounded-lg flex items-center justify-center"
                onClick={() => navigate(-1)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCheckModalOpen && (
        <CheckModal
          title="검사 완료!"
          content="검사지 제출이 완료되었습니다."
          iconSrc="fi.FiEdit"
          confirmText="차트 보기"
          onConfirm={handleConfirm}
          onClose={closeCheckModal}
          width="400px"
          height="300px"
          headerBackgroundColor="#FF713C"
          buttonBorderColor="#FF713C"
          buttonTextColor="#FF713C"
          secondaryButtonText="닫기"
          onSecondaryAction={handleSecondaryAction}
        />
      )}
    </>
  )
}

export default SurveyPage
