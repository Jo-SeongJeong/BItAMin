// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainPage from 'stories/pages/main/MainPage'
import MissionPage from 'stories/pages/mission/MissionPage'
import LoginPage from 'stories/pages/account/LoginPage'
import SignUpPage from 'stories/pages/account/SignUpPage'
import SurveyPage from 'stories/pages/account/SurveyPage'
import ConsultationListPage from 'stories/pages/counsultation/ConsultationListPage'
import ConsultationPage from 'stories/pages/counsultation/ConsultationPage'
import VideoRoomComponent from 'stories/organisms/consultation/components/VideoRoomComponent'
import ConsultationSharingPage from 'stories/pages/counsultation/ConsultationSharingPage'
import HealthUpListPage from 'stories/pages/healthup/HealthUpListPage'
import HealthUpPage from 'stories/pages/healthup/HealthUpPage'
import MessageListMainPage from 'stories/pages/message/MessageListMainPage'
import MessageDetailPage from 'stories/organisms/MessageDetailPage'
import ParticipantListPage from 'stories/pages/message/ParticipantListPage'
import ReplyPage from 'stories/pages/message/ReplyPage'
import AdiminPage from 'stories/pages/admin/AdiminPage'
import AdiminDetail from '@/stories/pages/admin/AdminDetail'
import LandingPage from 'stories/pages/main/LandingPage'
import ExLogin from 'stories/pages/account/ExLogin'
import MyPage from 'stories/pages/account/MyPage'
import ComponentPage from 'stories/pages/ComponentPage'
import PrivateRoute from './PrivateRouter'
import PasswordChangePage from '@/stories/pages/account/PasswordChangePage'
import CompleteMission from '@/stories/pages/mission/CompleteMission.tsx'
import MyPlant from '@/stories/pages/mission/MyPlant.tsx'
import ModalExampleUsage from '@/stories/organisms/ModalExampleUsage'

const getCurrentDate = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* 인증 여부 없이도 접속 가능한 페이지 */}
      <Route path="" element={<LandingPage />} />
      <Route path="/component" element={<ComponentPage />} />
      <Route path="/modal" element={<ModalExampleUsage />} />
      <Route path="/home" element={<MainPage />} />

      {/* 인증 반드시 필요한 페이지 */}
      <Route element={<PrivateRoute authentication={true} />}>
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/change-password" element={<PasswordChangePage />} />
        <Route path="/consultationlist" element={<ConsultationListPage />} />
        <Route path="/consult" element={<VideoRoomComponent />} />
        <Route
          path="/counsultationsharing"
          element={<ConsultationSharingPage />}
        />
        <Route path="/healthuplist" element={<HealthUpListPage />} />
        <Route path="/healthup" element={<HealthUpPage />} />
        <Route path="/messagelist" element={<MessageListMainPage />} />
        <Route path="/messages/:messageId" element={<MessageDetailPage />} />
        <Route path="/participantlist" element={<ParticipantListPage />} />
        <Route path="/reply" element={<ReplyPage />} />
        <Route path="/mission" element={<MissionPage />} />
        {/* <Route path="/missionform" element={<MissionForm />} />
        <Route path="/complete" element={<CompleteMission />} /> */}
        <Route path="/plant" element={<MyPlant />} />

        {/* 관리자페이지 */}
        <Route
          path="/admin"
          element={
            <PrivateRoute authentication={true} requiredRole="ROLE_ADMIN">
              <AdiminPage />
            </PrivateRoute>
          }
        />
        <Route path="/admin/:id" element={<AdiminDetail />} />
      </Route>

      {/* 인증 하지 않아야만 가능한 페이지 */}
      <Route element={<PrivateRoute authentication={false} />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/loginex" element={<ExLogin />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      {/* <Route path="/auth" element={<AuthPage />} />  */}
      {/* <Route path="/counsult" element={<Counsult />} /> */}
    </Routes>
  )
}

export default AppRouter
