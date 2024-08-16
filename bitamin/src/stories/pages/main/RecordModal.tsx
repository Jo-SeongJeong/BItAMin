import React from 'react'
import styles from 'styles/main/RecordModal.module.css'
interface RecordModalProps {
  onClose: () => void
}

const RecordModal: React.FC<RecordModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <p className={styles.content}>자신의 목소리로 긍정적인 메시지를 녹음하고 반복해서 들어보세요!<br />
          익숙한 자신의 목소리로 긍정적인 에너지를 불어넣으면 더 효과적이라고 해요.<br />
          또, 자존감을 높이고 스트레스와 불안을 덜어주는 데 큰 도움이 될 거예요!<br />
          귤귤이와 함께 신나게 녹음해볼까요?</p>
        <p className={styles.info}>※ 녹음은 하루에 한번만 저장할 수 있습니다.</p>
        <button className={styles.closeButton} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  )
}

export default RecordModal
