import { useState, useRef } from 'react'
import { useOnClickOutside } from '../hooks'

interface DropdownOption {
  value: string
  label: string
  icon?: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  disabled,
  className = '',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(dropdownRef, () => setIsOpen(false))

  const selectedOption = options.find((opt) => opt.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`dropdown-wrapper ${className}`}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-container" ref={dropdownRef}>
        <button
          type="button"
          className="dropdown-button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <span className="dropdown-selected">
            {selectedOption ? (
              <>
                {selectedOption.icon && <span>{selectedOption.icon}</span>}
                {selectedOption.label}
              </>
            ) : (
              <span className="dropdown-placeholder">{placeholder}</span>
            )}
          </span>
          <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`dropdown-option ${
                  value === option.value ? 'selected' : ''
                } ${option.disabled ? 'disabled' : ''}`}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
              >
                {option.icon && <span className="dropdown-icon">{option.icon}</span>}
                {option.label}
                {value === option.value && <span className="dropdown-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

