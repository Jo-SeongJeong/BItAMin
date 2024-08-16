// import { FunctionComponent, useCallback } from 'react'
// import styled from 'styled-components'

// const HeaderBeforeLoginContainer = styled.div`
//   @apply w-full relative flex flex-col items-start justify-start py-0 px-10 box-border text-center text-sm text-brand-primary font-nanumgothic;
// `

// const Header = styled.div`
//   @apply self-stretch bg-white h-18.5 flex flex-row items-center justify-between;
// `

// const Logo = styled.div`
//   @apply w-34 relative text-2xl font-bagel-fat-one text-left inline-block shrink-0 cursor-pointer;
// `

// const Nav = styled.div`
//   @apply flex flex-row items-center justify-start gap-12.5 text-black;
// `

// const NavItem = styled.div`
//   @apply w-15 h-18.5 flex flex-col items-center justify-center p-1 box-border gap-1 cursor-pointer;
// `

// const NavText = styled.div`
//   @apply w-18 h-5.75 flex flex-row items-end justify-center;
// `

// const Underline = styled.div`
//   @apply w-12.5 relative rounded-sm bg-brand-sub h-0.5;
// `

// const UserSection = styled.div`
//   @apply w-31 h-24.5 flex flex-col items-start justify-end text-darkgray;
// `

// const UserInfo = styled.div`
//   @apply self-stretch flex flex-row items-center justify-start gap-1.5;
// `

// const UserImage = styled.img`
//   @apply w-4.75 relative h-4.75 overflow-hidden shrink-0;
// `

// const UserName = styled.div`
//   @apply w-18 h-4.75 flex flex-row items-center justify-start gap-1;
// `

// const UserDropdown = styled.div`
//   @apply w-2.25 h-4.75 flex flex-col items-center justify-end py-1 px-0 box-border;
// `

// const UserMessage = styled.div`
//   @apply h-6 flex flex-row items-start justify-end cursor-pointer;
// `

// const MessageIcon = styled.img`
//   @apply w-4.75 relative h-4.875;
// `

// const UserMenu = styled.div`
//   @apply w-23 shadow-[4px_4px_25px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start mt-0.5 text-4xs text-gray;
// `

// const MenuItem = styled.div`
//   @apply self-stretch bg-white h-4.75 flex flex-col items-start justify-center py-1.5 px-6 box-border cursor-pointer;
// `

// const HeaderBeforeLogin: FunctionComponent = () => {
//   const onBItAMinTextClick = useCallback(() => {
//     // Add your code here
//   }, [])

//   return (
//     <HeaderBeforeLoginContainer>
//       <Header>
//         <Logo onClick={onBItAMinTextClick}>BItAMin</Logo>
//         <Nav>
//           {['상담', '미션', '건강', '관리자'].map((item, index) => (
//             <NavItem key={index} onClick={onBItAMinTextClick}>
//               <NavText>
//                 <div className="relative">{item}</div>
//                 {item === '건강' && (
//                   <div className="w-[1.688rem] h-[2.25rem] flex flex-row items-start justify-center ml-[-0.25rem] text-brand-primary font-ownglyph-ryuttung">
//                     <div className="w-[1.375rem] relative flex items-center justify-center h-[2.063rem] shrink-0">
//                       UP !
//                     </div>
//                   </div>
//                 )}
//               </NavText>
//               <Underline />
//             </NavItem>
//           ))}
//         </Nav>
//         <UserSection>
//           <UserInfo>
//             <UserImage alt="" src="PersonCircle.svg" />
//             <UserName>
//               <div className="h-[1.563rem] flex flex-row items-center justify-center">
//                 <div className="w-[3.313rem] relative flex items-center h-[1.5rem] shrink-0">
//                   <span className="w-full">
//                     <span>김싸피</span>
//                     <span className="font-nanumbarunpen text-[1.063rem]">
//                       <span>{` `}</span>
//                       <span className="text-[0.75rem]">님</span>
//                     </span>
//                   </span>
//                 </div>
//               </div>
//               <UserDropdown>
//                 <img
//                   className="w-[0.563rem] relative h-[0.375rem]"
//                   alt=""
//                   src="Vector.svg"
//                 />
//               </UserDropdown>
//             </UserName>
//             <UserMessage onClick={onBItAMinTextClick}>
//               <MessageIcon alt="" src="쪽지 버튼.svg" />
//             </UserMessage>
//           </UserInfo>
//           <UserMenu>
//             <MenuItem onClick={onBItAMinTextClick}>
//               <div className="w-[2.688rem] flex flex-col items-center justify-start">
//                 <div className="relative">마이페이지</div>
//               </div>
//             </MenuItem>
//             <MenuItem onClick={onBItAMinTextClick}>
//               <div className="w-[2.688rem] flex flex-col items-center justify-start">
//                 <div className="self-stretch relative">로그아웃</div>
//               </div>
//             </MenuItem>
//           </UserMenu>
//         </UserSection>
//       </Header>
//     </HeaderBeforeLoginContainer>
//   )
// }

// export default HeaderBeforeLogin

import { FunctionComponent, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const HeaderBeforeLogin: FunctionComponent = () => {
  const navigate = useNavigate()
  const onBItAMinTextClick = useCallback(() => {
    // Add your code here
  }, [])

  const onLoginTextClick = useCallback(() => {
    navigate('/login')
  }, [])

  const onSignupTextClick = useCallback(() => {
    navigate('/signup')
  }, [])

  return (
    <div className="w-full relative flex flex-col items-start justify-start py-[0rem] px-[2.5rem] box-border text-center text-[0.875rem] text-brand-primary font-nanumgothic">
      <div className="self-stretch bg-white h-[4.625rem] flex flex-row items-center justify-start gap-[5.875rem]">
        <div
          className="w-[8.5rem] relative text-[2rem] font-bagel-fat-one text-left inline-block shrink-0 cursor-pointer"
          onClick={onBItAMinTextClick}
        >
          BItAMin
        </div>
        <div className="flex-1 flex flex-row items-center justify-center gap-[5rem] text-gray">
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative">상담</div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem] opacity-[0]" />
          </div>
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-center">
              <div className="relative">미션</div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem] opacity-[0]" />
          </div>
          <div
            className="w-[3.75rem] h-[4.625rem] flex flex-col items-center justify-center p-[0.312rem] box-border gap-[0.312rem] cursor-pointer"
            onClick={onBItAMinTextClick}
          >
            <div className="w-[4.563rem] h-[1.438rem] flex flex-row items-end justify-end">
              <div className="relative">건강</div>
              <div className="w-[1.688rem] h-[2.25rem] flex flex-row items-start justify-center ml-[-0.25rem] text-brand-primary font-ownglyph-ryuttung">
                <div className="w-[1.375rem] relative flex items-center justify-center h-[2.063rem] shrink-0">
                  UP !
                </div>
              </div>
            </div>
            <div className="w-[3.125rem] relative rounded-sm bg-brand-sub h-[0.125rem] opacity-[0]" />
          </div>
        </div>
        <div className="w-[7.75rem] h-[6.125rem] flex flex-row items-center justify-center gap-[0.187rem] text-dimgray">
          <div
            className="w-[3.125rem] relative flex items-center justify-center h-[2rem] shrink-0"
            onClick={onLoginTextClick}
          >
            로그인
          </div>
          <div className="w-[1.25rem] relative text-black flex items-center justify-center h-[2rem] shrink-0">
            /
          </div>
          <div className="relative" onClick={onSignupTextClick}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderBeforeLogin
