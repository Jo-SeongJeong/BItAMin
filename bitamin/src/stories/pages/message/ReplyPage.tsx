import { useState, useCallback } from 'react'
import styles from 'styles/message/ReplyPage.module.css'

const ReplyPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)
  const [isFrame1Open, setFrame1Open] = useState(false)

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const openFrame1 = useCallback(() => {
    setFrame1Open(true)
  }, [])

  const closeFrame1 = useCallback(() => {
    setFrame1Open(false)
  }, [])

  const onRectangleClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.div1}>2024.07.23 17:50:50</div>
        <div className={styles.item} />
        <div className={styles.inner} />
        <div className={styles.div2}>메롱이</div>
        <div className={styles.div3}>새싹이 (나)</div>
        <b className={styles.b}>2024-07-16</b>
        <b className={styles.b1}>06:00</b>
        <img className={styles.groupIcon} alt="" src="Group 368.svg" />
        <div className={styles.div4}>
          같이 이야기 나눌 수 있어서 너무 좋았어요
        </div>
        <div className={styles.div5}>오 좋아요 저 때 저도 참여할게요ㅎㅎ!</div>
        <div className={styles.rectangleDiv} />
        <img className={styles.child1} alt="" src="Group 337.png" />
        <div className={styles.arrowLeftParent}>
          <img className={styles.arrowLeftIcon} alt="" src="arrow-left.svg" />
          <img
            className={styles.trash01Icon}
            alt=""
            src="trash-01.svg"
            onClick={openFrame}
          />
          <img
            className={styles.trash01Icon}
            alt=""
            src="alert-triangle.svg"
            onClick={openFrame1}
          />
        </div>
        <div className={styles.child2} onClick={onRectangleClick} />
        <div className={styles.div6}>답장</div>
        <div className={styles.wrapper}>
          <b className={styles.b2}>전체</b>
        </div>
        <b className={styles.b3}>같이 영화 이야기 ㄱ?</b>
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onRectangleClick}>
            BItAMin
          </div>
          <div className={styles.parent}>
            <div className={styles.div7} onClick={onRectangleClick}>
              <div className={styles.container}>
                <div className={styles.b2}>상담</div>
              </div>
              <div className={styles.child3} />
            </div>
            <div className={styles.div7} onClick={onRectangleClick}>
              <div className={styles.container}>
                <div className={styles.b2}>미션</div>
              </div>
              <div className={styles.child3} />
            </div>
            <div className={styles.div7} onClick={onRectangleClick}>
              <div className={styles.group}>
                <div className={styles.b2}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child3} />
            </div>
          </div>
          <div className={styles.div13}>
            <div className={styles.frameParent}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameGroup}>
                  <div className={styles.frameDiv}>
                    <div className={styles.div14}>
                      <span className={styles.txt}>
                        <span>김싸피</span>
                        <span className={styles.span}>
                          <span>{` `}</span>
                          <span className={styles.span1}>님</span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className={styles.vectorWrapper}>
                    <img
                      className={styles.vectorIcon}
                      alt=""
                      src="Vector.svg"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.wrapper1} onClick={onRectangleClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.parent1}>
          <div className={styles.div15}>2024.07.23 17:50:50</div>
          <img className={styles.trash02Icon} alt="" src="trash-02.svg" />
        </div>
        <div className={styles.parent2}>
          <div className={styles.div15}>2024.07.23 17:50:50</div>
          <img className={styles.trash02Icon} alt="" src="trash-02.svg" />
        </div>
      </div>
      {/* {isFrameOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeFrame}
        >
          <Frame2 onClose={closeFrame} />
        </PortalPopup>
      )} */}
      {/* {isFrame1Open && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeFrame1}
        >
          <Frame1 onClose={closeFrame1} />
        </PortalPopup>
      )} */}
    </>
  )
}

export default ReplyPage
