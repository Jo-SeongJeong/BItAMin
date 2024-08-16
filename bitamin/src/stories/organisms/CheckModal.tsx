import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import * as RiIcons from 'react-icons/ri'
import * as FiIcons from 'react-icons/fi'
import alert from '@/assets/image/alert.png'
import room from '@/assets/image/room.png'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2101;
`

interface StyledModalContainerProps {
  width?: string
  height?: string
}

const StyledModalContainer = styled.div<StyledModalContainerProps>`
  position: relative;
  background-color: #fff;
  border-radius: 23px;
  box-shadow: 3px 4px 4px rgba(0, 0, 0, 0.25);
  width: ${({ width }) => width || '28.25rem'};
  height: ${({ height }) => height || '18.938rem'};
  overflow: hidden;
`

interface StyledModalHeaderProps {
  backgroundColor?: string
}

const StyledModalHeader = styled.div<StyledModalHeaderProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || '#ff713c'};
  height: 2.25rem;
  border-radius: 23px 23px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalTitle = styled.b`
  color: #fff;
  font-size: 1.25rem;
`

const ModalContent = styled.div`
  padding: 1rem;
  text-align: center;
  color: #ff713c;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
`

const ModalButton = styled.button`
  background-color: #fff;
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;
  width: 120px;
`

interface StyledModalButtonProps {
  borderColor?: string
  textColor?: string
}

const StyledModalButton = styled(ModalButton)<StyledModalButtonProps>`
  border: 1px solid ${({ borderColor }) => borderColor || '#ff713c'};
  color: ${({ textColor }) => textColor || '#ff713c'};
`

const StyledSecondaryButton = styled(StyledModalButton)<StyledModalButtonProps>`
  background-color: ${({ textColor }) => textColor || '#ff713c'};
  color: #fff;
`

interface StyledModalContentProps {
  textColor?: string
}

const StyledModalContent = styled(ModalContent)<StyledModalContentProps>`
  color: ${({ textColor }) => textColor || '#ff713c'};
`

interface ModalProps {
  title: string
  content: string
  iconSrc?: string
  confirmText?: string
  onConfirm?: () => void
  onClose: () => void
  width?: string
  height?: string
  headerBackgroundColor?: string
  buttonBorderColor?: string
  buttonTextColor?: string
  imgSize?: number
  imgColor?: string
  secondaryButtonText?: string
  onSecondaryAction?: () => void
}

const getIconComponent = (iconSrc: string, size: number) => {
  const [library, iconName] = iconSrc.split('.')
  if (library === 'ri') {
    return (RiIcons as any)[iconName]
  } else if (library === 'fi') {
    return (FiIcons as any)[iconName]
  } else if (library === 'src') {
    return (props: any) => (
      <img src={alert} width={size} {...props} />
    )
  }
  return null
}

const CheckModal: FunctionComponent<ModalProps> = ({
  title,
  content,
  iconSrc,
  confirmText = '확인',
  onConfirm,
  onClose,
  width,
  height,
  headerBackgroundColor,
  buttonBorderColor,
  buttonTextColor,
  imgSize = 100,
  imgColor,
  secondaryButtonText = '취소',
  onSecondaryAction,
}) => {
  const IconComponent = iconSrc ? getIconComponent(iconSrc, imgSize) : null

  return (
    <ModalOverlay onClick={onClose}>
      <StyledModalContainer
        width={width}
        height={height}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        <StyledModalHeader backgroundColor={headerBackgroundColor}>
          <ModalTitle>{title}</ModalTitle>
        </StyledModalHeader>
        <StyledModalContent textColor={buttonTextColor}>
          <IconContainer>
            {IconComponent && <IconComponent size={imgSize} color={imgColor} />}
          </IconContainer>
          <p>{content}</p>
        </StyledModalContent>
        <ModalFooter>
          <StyledModalButton
            borderColor={buttonBorderColor}
            textColor={buttonTextColor}
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </StyledModalButton>
          <StyledSecondaryButton
            borderColor={buttonTextColor}
            textColor={buttonBorderColor}
            onClick={onSecondaryAction || onClose}
          >
            {secondaryButtonText}
          </StyledSecondaryButton>
        </ModalFooter>
      </StyledModalContainer>
    </ModalOverlay>
  )
}

export default CheckModal
