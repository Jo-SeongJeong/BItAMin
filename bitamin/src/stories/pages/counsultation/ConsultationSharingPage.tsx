import { useState, useCallback } from 'react'
import styles from 'styles/counsultation/CounsultationSharingPage.module.css'

const ConsultationSharingPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <div className={styles.div}>
        <div className={styles.child} />
        <div className={styles.inner}>
          <div className={styles.groupChild} />
        </div>
        <img className={styles.item} alt="" src="Rectangle 4081.svg" />
        <div className={styles.rectangleDiv} />
        <div className={styles.rectangleParent}>
          <div className={styles.groupItem} />
          <b className={styles.b}>나가기</b>
        </div>
        <div className={styles.videoOffParent}>
          <img className={styles.videoOffIcon} alt="" src="video-off.svg" />
          <div className={styles.div1}>비디오 중지</div>
        </div>
        <div className={styles.microphoneOff01Parent}>
          <img
            className={styles.microphoneOff01Icon}
            alt=""
            src="microphone-off-01.svg"
          />
          <div className={styles.div2}>음소거</div>
        </div>
        <div className={styles.child1} />
        <div className={styles.child2} />
        <div className={styles.child3} />
        <div className={styles.child4} />
        <div className={styles.child5} />
        <div className={styles.child6} />
        <div className={styles.child7} />
        <div className={styles.div3}>가나다라</div>
        <div className={styles.div4}>가나다라</div>
        <div className={styles.div5}>가나다라</div>
        <div className={styles.div6}>가나다라</div>
        <div className={styles.div7}>가나다라</div>
        <div className={styles.child8} />
        <div className={styles.child9} />
        <div className={styles.div8}>참여 리스트</div>
        <div className={styles.div9}>채팅</div>
        <div className={styles.child10} />
        <div className={styles.child11} />
        <div className={styles.ellipseDiv} />
        <div className={styles.child12} />
        <div className={styles.child13} />
        <div className={styles.div10}>다 같이 인사를 해볼까요?</div>
        <div className={styles.wrapper}>
          <div className={styles.div11}>안녕하세요 반갑습니다!</div>
        </div>
        <div className={styles.container}>
          <div className={styles.div12}>오늘 하루는 다들 어땠어요?</div>
        </div>
        <div className={styles.frame}>
          <div className={styles.div13}>
            오늘은 서로 그림 실력을 뽐내볼까요?
          </div>
        </div>
        <div className={styles.div14}>반갑습니다!</div>
        <img className={styles.ellipseIcon} alt="" src="Ellipse 131.png" />
        <img className={styles.child14} alt="" src="Ellipse 135.png" />
        <img className={styles.child15} alt="" src="Ellipse 136.png" />
        <div className={styles.child16} />
        <div className={styles.div15}>텍스트를 입력하세요</div>
        <div className={styles.rectangleGroup}>
          <div className={styles.groupInner} />
          <b className={styles.b1}>전송</b>
        </div>
        <div className={styles.child17} />
        <div className={styles.presentation03Parent}>
          <img
            className={styles.presentation03Icon}
            alt=""
            src="presentation-03.svg"
          />
          <div className={styles.div2}>화면 공유</div>
        </div>
        <b className={styles.b2}>그림</b>
        <div className={styles.div17}>그림 그릴래요?</div>
        <img className={styles.vectorIcon} alt="" src="Vector 37.svg" />
        <img className={styles.child18} alt="" src="Vector 38.svg" />
        <img className={styles.lockOpen02Icon} alt="" src="lock-open-02.svg" />
        <img className={styles.rectangleIcon} alt="" src="Rectangle 4123.png" />
        <img className={styles.child19} alt="" src="Rectangle 4107.png" />
        <img className={styles.child20} alt="" src="Rectangle 4108.png" />
        <img className={styles.child21} alt="" src="Rectangle 4110.png" />
        <img className={styles.child22} alt="" src="Rectangle 4105.png" />
        <img className={styles.child23} alt="" src="Rectangle 4104.png" />
        <img
          className={styles.sirenIcon}
          alt=""
          src="Siren.png"
          onClick={openFrame}
        />
        <img
          className={styles.sirenIcon1}
          alt=""
          src="Siren.png"
          onClick={openFrame}
        />
        <img
          className={styles.sirenIcon2}
          alt=""
          src="Siren.png"
          onClick={openFrame}
        />
        <img
          className={styles.sirenIcon3}
          alt=""
          src="Siren.png"
          onClick={openFrame}
        />
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onBItAMinTextClick}>
            BItAMin
          </div>
          <div className={styles.parent}>
            <div className={styles.div18} onClick={onBItAMinTextClick}>
              <div className={styles.frameDiv}>
                <div className={styles.div19}>상담</div>
              </div>
              <div className={styles.child24} />
            </div>
            <div className={styles.div20} onClick={onBItAMinTextClick}>
              <div className={styles.frameDiv}>
                <div className={styles.div19}>미션</div>
              </div>
              <div className={styles.child25} />
            </div>
            <div className={styles.div20} onClick={onBItAMinTextClick}>
              <div className={styles.group}>
                <div className={styles.div19}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child25} />
            </div>
          </div>
          <div className={styles.div24}>
            <div className={styles.frameParent}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameGroup}>
                  <div className={styles.wrapper2}>
                    <div className={styles.div25}>
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
                      className={styles.vectorIcon1}
                      alt=""
                      src="Vector.svg"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.wrapper3} onClick={onBItAMinTextClick}>
                <img className={styles.icon} alt="" src="쪽지 버튼.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {isFrameOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeFrame}
        >
          <Frame1 onClose={closeFrame} />
        </PortalPopup>
      )} */}
    </>
  )
}

export default ConsultationSharingPage
