import { StoryObj, Meta } from '@/storybook/react/*'
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

export const BuleButton: Story = {
  args: {
    label: '추가',
    color: '#304FFE',
  },
}
