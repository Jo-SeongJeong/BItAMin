import React, { Component } from 'react'
import Fab from '@material-ui/core/Fab'
import Send from '@material-ui/icons/Send'
import { Tooltip } from '@material-ui/core'

export default class SidebarComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      message: '',
    }
    this.chatScroll = React.createRef()

    this.handleChange = this.handleChange.bind(this)
    this.handlePressKey = this.handlePressKey.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.handleParticipantAction = this.handleParticipantAction.bind(this)
  }

  componentDidMount() {
    this.props.user
      .getStreamManager()
      .stream.session.on('signal:chat', (event) => {
        const data = JSON.parse(event.data)
        let messageList = this.state.messageList
        messageList.push({
          connectionId: event.from.connectionId,
          nickname: data.nickname,
          message: data.message,
        })

        const document = window.document
        setTimeout(() => {
          const userImg = document.getElementById(
            'userImg-' + (this.state.messageList.length - 1)
          )
          const video = document.getElementById('video-' + data.streamId)
          const avatar = userImg.getContext('2d')
          avatar.drawImage(video, 200, 120, 285, 285, 0, 0, 60, 60)
          this.props.messageReceived()
        }, 50)

        this.setState({ messageList: messageList })
        this.scrollToBottom()
      })
  }

  handleChange(event) {
    this.setState({ message: event.target.value })
  }

  handlePressKey(event) {
    if (event.key === 'Enter') {
      this.sendMessage()
    }
  }

  sendMessage() {
    if (this.props.user && this.state.message) {
      let message = this.state.message.replace(/ +(?= )/g, '')
      if (message !== '' && message !== ' ') {
        const data = {
          message: message,
          nickname: this.props.user.getNickname(),
          streamId: this.props.user.getStreamManager().stream.streamId,
        }
        this.props.user.getStreamManager().stream.session.signal({
          data: JSON.stringify(data),
          type: 'chat',
        })
      }
    }
    this.setState({ message: '' })
  }

  handleParticipantAction(participant) {
    console.log('Action button clicked for:', participant.nickname)
    // 여기서 participant에 대한 작업을 수행합니다.
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.chatScroll.current.scrollTop = this.chatScroll.current.scrollHeight
      } catch (err) {}
    }, 20)
  }

  render() {
    const localUser = this.props.user

    return (
      <div className="flex h-full">
        {/* 참여자 리스트 영역 */}
        {/* <div className="w-2/5 p-4 border-r border-gray-200">
          <h2 className="text-lg font-bold mb-4">참여자 리스트</h2>
          <ul className="space-y-2">
            {this.props.participants.map((participant, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
              >
                <span className="text-sm font-medium">
                  {participant.nickname}
                </span>
                {participant.getConnectionId() !==
                  localUser.getConnectionId() && (
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => this.handleParticipantAction(participant)}
                  >
                    Action
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div> */}

        {/* 채팅 영역 */}
        <div className="w-3/5 flex flex-col justify-between p-4">
          <div className="flex-1 overflow-y-auto" ref={this.chatScroll}>
            {this.state.messageList.map((data, i) => (
              <div
                key={i}
                className={`flex ${
                  data.connectionId !== this.props.user.getConnectionId()
                    ? 'justify-start'
                    : 'justify-end'
                } mb-2`}
              >
                <canvas
                  id={'userImg-' + i}
                  width="60"
                  height="60"
                  className="rounded-full"
                />
                <div className="ml-2">
                  <p className="font-bold">{data.nickname}</p>
                  <div className="bg-gray-200 rounded-lg p-2">
                    <p>{data.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center mt-4">
            <input
              className="flex-1 p-4 border border-gray-300 rounded-lg"
              placeholder="메시지 입력..."
              value={this.state.message}
              onChange={this.handleChange}
              onKeyPress={this.handlePressKey}
              style={{ height: '60px' }} // 입력창 높이를 늘림
            />
            <Tooltip title="메시지 전송">
              <Fab size="medium" className="ml-4" onClick={this.sendMessage}>
                <Send />
              </Fab>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}
