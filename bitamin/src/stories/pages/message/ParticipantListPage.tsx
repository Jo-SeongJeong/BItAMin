import { useState, useCallback } from 'react'
import styles from 'styles/message/ParticipantListPage.module.css'
import ParticipantsListWithMessageCreate from 'stories/organisms/ParticipantListPage'

const ParticipantListPage: React.FC = () => {
  const [isFrameOpen, setFrameOpen] = useState(false)

  const openFrame = useCallback(() => {
    setFrameOpen(true)
  }, [])

  const closeFrame = useCallback(() => {
    setFrameOpen(false)
  }, [])

  const onFrameContainerClick = useCallback(() => {
    // Add your code here
  }, [])

  return (
    <>
      <ParticipantsListWithMessageCreate />
      <br />
      <div className={styles.div}>
        <div className={styles.child} />
        <img className={styles.item} alt="" src="Vector 33.svg" />
        <img className={styles.inner} alt="" src="Vector 34.svg" />
        <img className={styles.vectorIcon} alt="" src="Vector 35.svg" />
        <div className={styles.rectangleDiv} />
        <div className={styles.child1} />
        <div className={styles.frameParent}>
          <div className={styles.wrapper} onClick={onFrameContainerClick}>
            <b className={styles.b}>쪽지함</b>
          </div>
          <div className={styles.container}>
            <b className={styles.b}>같이 한 사람</b>
          </div>
        </div>
        <div className={styles.child2} />
        <div className={styles.child3} />
        <div className={styles.child4} />
        <div className={styles.child5} />
        <div className={styles.child6} />
        <div className={styles.child7} />
        <div className={styles.child8} />
        <div className={styles.child9} />
        <div className={styles.child10} />
        <div className={styles.child11} />
        <div className={styles.child12} />
        <div className={styles.div1}>2024-07-17</div>
        <div className={styles.div2}>2024-07-16</div>
        <div className={styles.div3}>2024-07-14</div>
        <div className={styles.parent}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.group}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.frameDiv}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent1}>
          <div className={styles.b}>가나다</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent2}>
          <div className={styles.b}>메롱이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent3}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent4}>
          <div className={styles.b}>바바바</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent5}>
          <div className={styles.b}>가나다</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent6}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent7}>
          <div className={styles.b}>다다다</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <div className={styles.parent8}>
          <div className={styles.b}>새싹이</div>
          <img
            className={styles.send01Icon}
            alt=""
            src="send-01.svg"
            onClick={openFrame}
          />
        </div>
        <img className={styles.groupIcon} alt="" src="Group 337.png" />
        <div className={styles.navbar}>
          <div className={styles.bitamin} onClick={onFrameContainerClick}>
            BItAMin
          </div>
          <div className={styles.parent9}>
            <div className={styles.div15} onClick={onFrameContainerClick}>
              <div className={styles.frame}>
                <div className={styles.b}>상담</div>
              </div>
              <div className={styles.child13} />
            </div>
            <div className={styles.div15} onClick={onFrameContainerClick}>
              <div className={styles.frame}>
                <div className={styles.b}>미션</div>
              </div>
              <div className={styles.child13} />
            </div>
            <div className={styles.div15} onClick={onFrameContainerClick}>
              <div className={styles.parent10}>
                <div className={styles.b}>건강</div>
                <div className={styles.upWrapper}>
                  <div className={styles.up}>UP !</div>
                </div>
              </div>
              <div className={styles.child13} />
            </div>
          </div>
          <div className={styles.div21}>
            <div className={styles.frameGroup}>
              <div className={styles.personcircleParent}>
                <img
                  className={styles.personcircleIcon}
                  alt=""
                  src="PersonCircle.svg"
                />
                <div className={styles.frameContainer}>
                  <div className={styles.wrapper2}>
                    <div className={styles.div22}>
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
              <div className={styles.wrapper3} onClick={onFrameContainerClick}>
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

export default ParticipantListPage
