import { FunctionComponent } from 'react'

const Footer: FunctionComponent = () => {
  return (
    <footer className="w-full bg-gray-100 py-[1.6vh] px-[14vw] box-border text-left text-[0.9vw] text-gray-200 font-bagel-fat-one mt-auto">
      <div className="w-[60vw] flex flex-col items-center justify-start gap-[0.5vh]">
        <img className="w-[60vw] max-h-full" alt="" src="Vector 50.svg" />
        <div className="w-[59.5vw] flex flex-row items-start justify-between">
          <div className="w-[29vw] flex flex-col items-start justify-start gap-[0.7vh]">
            <div className="w-[16vw] flex flex-col items-start justify-start gap-[0.2vh]">
              <div className="self-stretch">BItAMin</div>
              <div className="self-stretch flex flex-row items-center justify-start gap-[0.3vw] text-[0.5vw] text-gray-300 font-nanumsquare">
                <div>이용약관</div>
                <div className="text-[0.9vw]">ㅣ</div>
                <div>개인정보처리방침</div>
                <div className="text-[0.9vw]">ㅣ</div>
                <div>사이트맵</div>
              </div>
            </div>
            <div className="self-stretch text-[0.5vw] font-nanumsquare text-gray-300">
              <p className="m-0 mb-[0.3vh]">
                고객센터 042-123-1234 (평일 상담시간 09:00 ~ 17:00)
              </p>
              <p className="m-0 mb-[0.3vh]">
                본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사,
                배포 등을 금합니다.
              </p>
              <p className="m-0">© 2024. BItAMin All Rights Reserved.</p>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start gap-[0.25vw]">
            {/* <img
              className="w-[1.5vw] h-[1.5vw] object-cover"
              alt=""
              src="Facebook.png"
            />
            <img
              className="w-[1.5vw] h-[1.5vw] object-cover"
              alt=""
              src="Instagram.png"
            />
            <img
              className="w-[1.5vw] h-[1.5vw] object-cover"
              alt=""
              src="YouTube.png"
            /> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
