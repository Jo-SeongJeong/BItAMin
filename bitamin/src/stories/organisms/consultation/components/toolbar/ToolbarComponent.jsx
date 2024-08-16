import React, { Component } from 'react'
import './ToolbarComponent.css'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

import Mic from '@material-ui/icons/Mic'
import MicOff from '@material-ui/icons/MicOff'
import Videocam from '@material-ui/icons/Videocam'
import VideocamOff from '@material-ui/icons/VideocamOff'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import SwitchVideoIcon from '@material-ui/icons/SwitchVideo'
import PictureInPicture from '@material-ui/icons/PictureInPicture'
import ScreenShare from '@material-ui/icons/ScreenShare'
import StopScreenShare from '@material-ui/icons/StopScreenShare'
import Tooltip from '@material-ui/core/Tooltip'
import PowerSettingsNew from '@material-ui/icons/PowerSettingsNew'
import QuestionAnswer from '@material-ui/icons/QuestionAnswer'
import ChatIcon from '@material-ui/icons/Chat'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import IconButton from '@material-ui/core/IconButton'
import { useChatStore } from '../../../../../store/useChatStore' // GPT 상태 관리 불러오기
import { withNavigate } from '../withNavigate' // withNavigate HOC 임포트

class ToolbarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = { fullscreen: false }
    this.camStatusChanged = this.camStatusChanged.bind(this)
    this.micStatusChanged = this.micStatusChanged.bind(this)
    this.screenShare = this.screenShare.bind(this)
    this.stopScreenShare = this.stopScreenShare.bind(this)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.switchCamera = this.switchCamera.bind(this)
    this.leaveSession = this.leaveSession.bind(this)
    this.toggleChat = this.toggleChat.bind(this)
    this.state = {
      showGptInput: false,
      gptInput: '',
    }
    this.toggleGptInput = this.toggleGptInput.bind(this)
    this.handleGptInputChange = this.handleGptInputChange.bind(this)
    this.handleSendGptRequest = this.handleSendGptRequest.bind(this)
    this.consultationId = this.consultationId
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

  toggleFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen })
    this.props.toggleFullscreen()
  }

  switchCamera() {
    this.props.switchCamera()
  }

  leaveSession() {
    console.log('Leaving session')
    const mySession = this.props.session

    if (mySession) {
      mySession.disconnect()
    }

    // 페이지 이동
    this.props.navigate('/consultationlist')
  }

  toggleChat() {
    this.props.toggleChat()
  }

  toggleGptInput() {
    this.setState({ showGptInput: !this.state.showGptInput })
  }

  handleGptInputChange(event) {
    this.setState({ gptInput: event.target.value })
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
    const mySessionId = this.props.sessionId
    const localUser = this.props.user
    const { showGptInput, gptInput } = this.state
    this.consultationId = this.props.consultationId
    return (
      <AppBar className="toolbar" id="header">
        <Toolbar className="toolbar">
          <div id="navSessionInfo">
            {this.props.sessionId && (
              <div id="titleContent">
                <span id="session-title">{mySessionId}</span>
              </div>
            )}
          </div>

          <div className="buttonsContent">
            <IconButton
              color="inherit"
              className="navButton"
              id="navMicButton"
              onClick={this.micStatusChanged}
            >
              {localUser !== undefined && localUser.isAudioActive() ? (
                <Mic />
              ) : (
                <MicOff color="secondary" />
              )}
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              id="navCamButton"
              onClick={this.camStatusChanged}
            >
              {localUser !== undefined && localUser.isVideoActive() ? (
                <Videocam />
              ) : (
                <VideocamOff color="secondary" />
              )}
            </IconButton>

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.screenShare}
            >
              {localUser !== undefined && localUser.isScreenShareActive() ? (
                <PictureInPicture />
              ) : (
                <ScreenShare />
              )}
            </IconButton>

            {localUser !== undefined && localUser.isScreenShareActive() && (
              <IconButton onClick={this.stopScreenShare} id="navScreenButton">
                <StopScreenShare color="secondary" />
              </IconButton>
            )}

            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.switchCamera}
            >
              <SwitchVideoIcon />
            </IconButton>
            <IconButton
              color="inherit"
              className="navButton"
              onClick={this.toggleFullscreen}
            >
              {localUser !== undefined && this.state.fullscreen ? (
                <FullscreenExit />
              ) : (
                <Fullscreen />
              )}
            </IconButton>
            <IconButton
              color="secondary"
              className="navButton"
              onClick={this.leaveSession}
              id="navLeaveButton"
            >
              <PowerSettingsNew />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={this.toggleChat}
              id="navChatButton"
            >
              {this.props.showNotification && <div id="point" className="" />}
              <Tooltip title="Chat">
                <QuestionAnswer />
              </Tooltip>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={this.toggleGptInput}
              id="navGptButton"
            >
              <Tooltip title="GPT">
                <ChatIcon />
              </Tooltip>
            </IconButton>

            {showGptInput && (
              <div className="gptInputContainer">
                <TextField
                  value={gptInput}
                  onChange={this.handleGptInputChange}
                  placeholder="Ask GPT..."
                  variant="outlined"
                  size="small"
                />
                <Button
                  onClick={this.handleSendGptRequest}
                  color="primary"
                  variant="contained"
                  size="small"
                >
                  Send
                </Button>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withNavigate(ToolbarComponent)
