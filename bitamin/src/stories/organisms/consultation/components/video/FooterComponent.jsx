import React, { Component } from 'react'
import Mic from '@material-ui/icons/Mic'
import MicOff from '@material-ui/icons/MicOff'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'
import PictureInPicture from '@material-ui/icons/PictureInPicture'
import ScreenShare from '@material-ui/icons/ScreenShare'
import StopScreenShare from '@material-ui/icons/StopScreenShare'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { withNavigate } from '../withNavigate'

class FooterComponent extends Component {
  constructor(props) {
    super(props)
    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.camStatusChanged = this.camStatusChanged.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.handleSendGptRequest = this.handleSendGptRequest.bind(this)
    this.consultationId = this.consultationId
    this.category = this.category
  }

  micStatusChanged() {
    this.props.micStatusChanged()
  }

  camStatusChanged() {
    this.props.camStatusChanged()
  }

  screenShare() {
    this.props.screenShare()
  }

  stopScreenShare() {
    this.props.stopScreenShare()
  }

  leaveSession() {
    const mySession = this.props.session

    if (mySession) {
      mySession.disconnect()
    }

    this.props.navigate('/consultationlist')
  }

  async handleSendGptRequest() {
    const { gptInput } = this.state
    if (gptInput.trim() !== '') {
      try {
        const { sendMessage } = useChatStore.getState() // GPT 메시지 전송 함수 가져오기
        await sendMessage('test1', gptInput, this.consultationId) // 예시로 'user1'을 사용
      } catch (error) {
        console.error('Failed to send GPT request:', error)
      } finally {
        this.setState({ showGptInput: false, gptInput: '' })
      }
    }
  }

  render() {
    const localUser = this.props.user
    const category = this.props.category

    return (
      <div className="fixed bottom-0 left-0 w-full flex justify-between items-center p-4 bg-white border-t-2 border-gray-200">
        <div className="flex space-x-6">
          <div className="text-center">
            <IconButton onClick={this.micStatusChanged}>
              {localUser !== undefined && localUser.isAudioActive() ? (
                <Mic />
              ) : (
                <MicOff />
              )}
            </IconButton>
            <p className="text-sm">음소거</p>
          </div>
          <div className="text-center">
            <IconButton onClick={this.camStatusChanged}>
              {localUser !== undefined && localUser.isVideoActive() ? (
                <Videocam />
              ) : (
                <VideocamOff />
              )}
            </IconButton>
            <p className="text-sm">비디오 중지</p>
          </div>
          <div className="text-center">
            <IconButton onClick={this.screenShare}>
              {localUser !== undefined && localUser.isScreenShareActive() ? (
                <PictureInPicture />
              ) : (
                <ScreenShare />
              )}
            </IconButton>
            <p className="text-sm">화면 공유</p>
          </div>
        </div>
        <div className="text-center">
          <span className="text-orange-500 font-bold">{category}</span>
        </div>
        <div className="flex">
          <Button
            onClick={this.leaveSession}
            color="secondary"
            variant="contained"
            size="small"
            className="bg-red-500 text-white ml-4"
          >
            나가기
          </Button>
        </div>
      </div>
    )
  }
}

export default withNavigate(FooterComponent)
