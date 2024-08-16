import ConsultationListPa from 'stories/organisms/ConsultationListPa'
import { useState, useCallback } from 'react'
import styles from 'styles/counsultation/CounsultationListPage.module.css'

const ConsultationListPage: React.FC = () => {
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
      <ConsultationListPa />
      {/* <CreateRoomPage /> */}
      {/*<div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.item} />
        <div className={styles.inner} />
        <div className={styles.rectangleDiv} />
        <div className={styles.child1} />
        <div className={styles.child2} onClick={openFrame} />
        <div className={styles.child3} onClick={onRectangleClick} />
        <div className={styles.child4} onClick={onRectangleClick} />
        <div className={styles.child5} />
        <div className={styles.child6} />
        <b className={styles.b}>입장</b>
        <b className={styles.b1}>입장</b>
        <b className={styles.b2}>입장</b>
        <b className={styles.b3}>입장</b>
        <img className={styles.squareIcon} alt="" src="square.svg" />
        <img className={styles.plus02Icon} alt="" src="plus-02.svg" />
        <div className={styles.div1}>새로운 방을 생성하세요</div>
        <div className={styles.div2}>어디로 들어가야 할 지 모르겠다면?</div>
        <div className={styles.clickHere} onClick={openFrame1}>
          click here !
        </div>
        <div className={styles.wrapper}>
          <div className={styles.div3}>독서</div>
        </div>
        <div className={styles.div4}>15:00</div>
        <div className={styles.div5}>3 / 5</div>
        <div className={styles.div6}>책 얘기해바요바요</div>
        <img className={styles.lockOpen02Icon} alt="" src="lock-open-02.svg" />
        <div className={styles.container}>
          <div className={styles.div3}>그림</div>
        </div>
        <div className={styles.div8}>15:00</div>
        <div className={styles.div9}>3 / 5</div>
        <div className={styles.div10}>그림 그릴래요?</div>
        <img className={styles.lockOpen02Icon1} alt="" src="lock-open-02.svg" />
        <div className={styles.frame}>
          <b className={styles.div3}>전체</b>
        </div>
        <div className={styles.frameDiv} />
        <div className={styles.child7} />
        <div className={styles.child8} />
        <div className={styles.child9} />
        <div className={styles.inner1}>
          <div className={styles.parent}>
            <b className={styles.b5}>독서</b>
            <b className={styles.b6}>영화</b>
            <b className={styles.b7}>그림</b>
            <b className={styles.b8}>음악</b>
            <b className={styles.b9}>대화</b>
          </div>
        </div>
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onRectangleClick}>
            BItAMin
          </div>
          <div className={styles.group}>
            <div className={styles.div11} onClick={onRectangleClick}>
              <div className={styles.wrapper1}>
                <div className={styles.div3}>상담</div>
              </div>
              <div className={styles.child10} />
            </div>
            <div className={styles.div13} onClick={onRectangleClick}>
              <div className={styles.wrapper1}>
                <div className={styles.div3}>미션</div>
              </div>
              <div className={styles.child11} />
            </div>
            <div className={styles.div13} onClick={onRectangleClick}>
              <div className={styles.parent1}>
                <div className={styles.div3}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child11} />
            </div>
            <div className={styles.div13} onClick={onRectangleClick}>
              <div className={styles.wrapper1}>
                <div className={styles.div3}>관리자</div>
              </div>
              <div className={styles.child11} />
            </div>
          </div>
          <div className={styles.div19}>
            <div className={styles.frameParent}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameGroup}>
                  <div className={styles.wrapper4}>
                    <div className={styles.div20}>
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
              <div className={styles.wrapper5} onClick={onRectangleClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.div21}>제재 사용자의 모달</div>
      </div>*/}
      {/* {isFrameOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeFrame}
        >
          <Frame2 onClose={closeFrame} />
        </PortalPopup>
      )}
      {isFrame1Open && (
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

export default ConsultationListPage
