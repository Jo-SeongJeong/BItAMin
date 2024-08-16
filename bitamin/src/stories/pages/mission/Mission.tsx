import React, { useCallback } from 'react'
import styles from '/src/styles/mission/quest2.module.css'

const Mission: React.FC = () => {
  const onContainerClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <div className={styles.child} />
      <div className={styles.item} />
      <div className={styles.div1} onClick={onContainerClick}>
        <b className={styles.b}>작성</b>
      </div>
      <div className={styles.inner}>
        <div className={styles.vectorParent}>
          <img className={styles.frameChild} alt="" src="Vector 39.svg" />
          <img className={styles.frameChild} alt="" src="Vector 41.svg" />
          <img className={styles.frameChild} alt="" src="Vector 42.svg" />
          <img className={styles.frameChild} alt="" src="Vector 43.svg" />
          <img className={styles.frameChild} alt="" src="Vector 44.svg" />
          <img className={styles.frameChild} alt="" src="Vector 45.svg" />
          <img className={styles.frameChild} alt="" src="Vector 46.svg" />
          <img className={styles.frameChild} alt="" src="Vector 47.svg" />
          <img className={styles.frameChild} alt="" src="Vector 48.svg" />
          <img className={styles.frameChild} alt="" src="Vector 49.svg" />
          <img className={styles.frameChild} alt="" src="Vector 40.svg" />
        </div>
      </div>

      <div className={styles.frameGroup}>
        <div className={styles.parent6}>
          <b className={styles.b}>25</b>
          <div className={styles.div92}>일 미션</div>
        </div>
        <div className={styles.frameWrapper}>
          <div className={styles.parent7}>
            <div className={styles.div93}>산책하기</div>
            <img
              className={styles.chevronLeftIcon}
              alt=""
              src="arrow-rotate-left-01.svg"
            />
          </div>
        </div>
      </div>
      <div className={styles.inner1}>
        <div className={styles.imageAddParent}>
          <img className={styles.imageAddIcon} alt="" src="image-add.svg" />
          <div className={styles.div94}>사진을 첨부해주세요</div>
        </div>
      </div>
      <img className={styles.frameIcon} alt="" src="Frame 448.png" />
    </>
  )
}

export default Mission
