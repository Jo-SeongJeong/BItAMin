import React from 'react'
import Button from '../atoms/Button'

interface FormFieldProps {
  label: string
  onSubmit: () => void
}

const FormField: React.FC<FormFieldProps> = ({ label, onSubmit }) => {
  return (
    <div>
      <label>{label}</label>
      <Button label="Submit" onClick={onSubmit} />
    </div>
  )
}

export default FormField
