import * as React from "react"

import { cn } from "@/lib/utils"
import {
  CircleCheckFill,
  CircleCloseFill,
  CircleExclamationFill,
} from "@/components/icons"

interface TextFieldProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  /** 입력 필드 위 라벨 텍스트 */
  label?: string
  /** 입력 필드 아래 도움말 텍스트 */
  helperText?: string
  /** 유효성 상태 (default: 기본, success: 성공, error: 오류) */
  status?: "default" | "success" | "error"
  /** 값이 있고 포커스 상태일 때 지우기(X) 버튼 표시 */
  clearable?: boolean
  /** 지우기 버튼 클릭 콜백 */
  onClear?: () => void
}

function TextField({
  className,
  label,
  helperText,
  status = "default",
  clearable = true,
  onClear,
  required,
  disabled,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  type,
  ref,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? "",
  )
  const inputRef = React.useRef<HTMLInputElement>(null)

  // 외부 ref(react-hook-form 등)와 내부 ref 병합
  const mergedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current =
          node
      }
    },
    [ref],
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const hasValue = String(currentValue).length > 0

  const showClearIcon = clearable && hasValue && isFocused && !disabled
  const showStatusIcon = !showClearIcon && !disabled

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue("")
    }
    onClear?.()
    inputRef.current?.focus()
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-0.5">
          <span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.07px] text-label-normal">
            {label}
          </span>
          {required && (
            <span className="text-[14px] font-semibold leading-[1.3] text-status-negative">
              *
            </span>
          )}
        </div>
      )}

      {/* Input + Helper */}
      <div className="flex w-full flex-col gap-1">
        {/* Input container */}
        <div
          className={cn(
            "flex w-full cursor-text items-center rounded-xl border border-solid transition-[border-color,border-width]",
            // Default
            "border-line-neutral",
            // Focus (normal / success)
            isFocused &&
              status !== "error" &&
              "border-[1.8px] border-primary/50",
            // Focus (error)
            isFocused &&
              status === "error" &&
              "border-[1.8px] border-status-negative/50",
            // Error (not focused)
            !isFocused &&
              status === "error" &&
              "border-status-negative/50",
            // Disabled
            disabled &&
              "cursor-not-allowed border-line-alt bg-fill-disabled",
          )}
          onClick={() => !disabled && inputRef.current?.focus()}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-3.5">
            {/* Input text area */}
            <div className="flex h-6 min-w-0 flex-1 items-center px-1">
              <input
                ref={mergedRef}
                type={type}
                className={cn(
                  "min-w-0 flex-1 bg-transparent outline-none",
                  "text-[16px] font-semibold leading-[1.3]",
                  "placeholder:text-label-assistive",
                  "text-label-normal",
                  disabled &&
                    "cursor-not-allowed text-label-disabled placeholder:text-label-disabled",
                )}
                disabled={disabled}
                required={required}
                value={isControlled ? value : internalValue}
                onChange={handleChange}
                onFocus={(e) => {
                  setIsFocused(true)
                  onFocus?.(e)
                }}
                onBlur={(e) => {
                  setIsFocused(false)
                  onBlur?.(e)
                }}
                {...inputProps}
              />
            </div>

            {/* Clear icon (focused + has value) */}
            {showClearIcon && (
              <button
                type="button"
                className="shrink-0 text-label-alternative transition-colors hover:text-label-neutral"
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleClear()
                }}
                tabIndex={-1}
                aria-label="입력 내용 지우기"
              >
                <CircleCloseFill className="size-6" />
              </button>
            )}

            {/* Success icon */}
            {showStatusIcon && status === "success" && (
              <CircleCheckFill
                className={cn(
                  "shrink-0 size-6",
                  disabled ? "text-label-disabled" : "text-primary",
                )}
                aria-hidden="true"
              />
            )}

            {/* Error icon */}
            {showStatusIcon && status === "error" && (
              <CircleExclamationFill
                className="shrink-0 size-6 text-status-negative"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Helper text */}
        {helperText && (
          <div className="flex items-center px-1">
            <p
              className={cn(
                "text-[12px] font-medium leading-[1.3] tracking-[-0.06px]",
                status === "error"
                  ? "text-status-negative"
                  : "text-label-alternative",
              )}
            >
              {helperText}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export { TextField }
export type { TextFieldProps }
