import { StoryObj, Meta } from '@storybook/react' // 경로 수정
import { Button } from '.'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    label: '추가',
  },
}

export const RedButton: Story = {
  args: {
    label: '삭제',
    color: '#eb0808',
  },
}

export const BlueButton: Story = {
  args: {
    label: '추가',
    color: '#304FFE',
  },
}
