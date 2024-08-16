import styles from 'styles/account/ExLogin.module.css'
import mainImg from 'assets/image/mainImg.png'
import loginexGgul from 'assets/image/loginexGgul.png'
import mypageImg from 'assets/image/mypageImg.png'
import healthPageImg from 'assets/image/health.png'

const ExLogin: React.FC = () => {

  return (
    <div>
      <div className={styles.innerSection}>
        <img className={styles.mainImg} alt="Main Image" src={mainImg} />
        <div className={styles.inner}>
          <div className={styles.div3}>
            <p className={styles.p}>오늘 하루도 최선을 다한 당신, 멋져요!</p>
          </div>
        </div>
      </div>

      <div className={styles.betterTomorrowBetterContainer}>
        <p className={styles.p}>{`better tomorrow, better mind `}</p>
        <p
          className={styles.p2}
        >{`더 나은 내가 되자는 의미를 담아 마음을 관리하며 서로 소통하는 페이지 입니다.  `}</p>
      </div>
      <div className={styles.div12}>비타민이 제안하는 마음 관리 솔루션</div>
      <div className={styles.child8} />
      <div className={styles.div13}>
        <span className={styles.span}>시작부터 관리까지</span>
        <span className={styles.span1}>
          <b className={styles.b}>{` `}</b>
          <span className={styles.span2}>비타민과 함께</span>
        </span>
        <span>
          <span className={styles.b}>{` `}</span>
          <span className={styles.span}>하세요.</span>
        </span>
      </div>

      {/* 여기 배경 추가하자 */}
      <div className={styles.backgroundContainer} />
      {/* 새로운 배경 컨테이너 */}
      <div className={styles.child9} />
      <div className={styles.div14}>
        <span className={styles.span2}>비타민</span>
        <span className={styles.span6}> 특징</span>
      </div>
      <div className={styles.cesDContainer}>
        <p className={styles.p}>{`매 주 CES-D 검사를 실시하여 `}</p>
        <p className={styles.p}>나의 마음 상태를 확인합니다</p>
      </div>
      <div className={styles.div15}>
        <p className={styles.p}>{`하루홈트의 모션 인식 기능을 활용해 `}</p>
        <p className={styles.p}>심신 안정과 건강을 함께 챙겨요</p>
      </div>
      <div className={styles.aiContainer}>
        <p className={styles.p}>AI와 함께 하는 집단 상담으로</p>
        <p className={styles.p}>좋아하는 주제에 대해 이야기해보아요</p>
      </div>

      {/* 여기까지 */}
      {/* <img className={styles.image77Icon} alt="" src="image 77.png" /> */}
      <div className={styles.div16}>지친 하루를 달래줄,</div>
      <div className={styles.child10} />
      <div className={styles.bitaminContainer}>
        <span>BItAMin</span>
        <b className={styles.b1}>과 함께 시작해 볼까요?</b>
      </div>
      <img className={styles.mypageImg} src={mypageImg} alt="MyPageImg" />
      <img className={styles.loginexGgul} src={loginexGgul} alt="" />
      <img className={styles.mainImg} alt="Main Image" src={mainImg} />
      <img
        className={styles.healthPageImg}
        src={healthPageImg}
        alt="건강up페이지"
      />

      <button
        onClick={() => (window.location.href = '/login')}
        className={styles.frameDiv}
      >
        지금 이용하러 가기
      </button>
    </div>
  )
}

export default ExLogin
