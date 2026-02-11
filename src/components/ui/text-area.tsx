import * as React from "react"

import { cn } from "@/lib/utils"
import { CircleExclamationFill } from "@/components/icons"

interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "children"> {
  /** 입력 필드 위 라벨 텍스트 */
  label?: string
  /** 입력 필드 아래 도움말 텍스트 */
  helperText?: string
  /** 유효성 상태 (default: 기본, error: 오류) */
  status?: "default" | "error"
  /** 최대 글자수 (설정 시 글자수 카운터 표시) */
  maxLength?: number
  /** 하단 우측 텍스트 버튼 라벨 (미설정 시 버튼 비표시) */
  actionLabel?: string
  /** 텍스트 버튼 클릭 콜백 */
  onAction?: () => void
}

function TextArea({
  className,
  label,
  helperText,
  status = "default",
  maxLength,
  actionLabel,
  onAction,
  required,
  disabled,
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  rows = 3,
  ref,
  ...textareaProps
}: TextAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? "",
  )
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // 외부 ref(react-hook-form 등)와 내부 ref 병합
  const mergedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        (
          ref as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node
      }
    },
    [ref],
  )

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const charCount = String(currentValue).length
  const hasValue = charCount > 0

  // Figma 스펙: negative + (focused|active) → 에러 아이콘
  const showErrorIcon =
    status === "error" && (isFocused || hasValue) && !disabled

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  const hasBottomBar =
    maxLength !== undefined || actionLabel || showErrorIcon

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* Label — TextField과 동일 */}
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

      {/* Content */}
      <div className="flex w-full flex-col gap-1">
        {/* 테두리 컨테이너 — TextField과 동일한 border 로직 */}
        <div
          className={cn(
            "flex w-full cursor-text rounded-xl border border-solid transition-[border-color,border-width]",
            // Default
            "border-line-neutral",
            // Focus (normal)
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
          onClick={() => !disabled && textareaRef.current?.focus()}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-4 px-3 pb-3 pt-3.5">
            {/* 텍스트 영역 */}
            <div className="px-1">
              <textarea
                ref={mergedRef}
                className={cn(
                  "w-full resize-none bg-transparent outline-none",
                  "text-[16px] font-semibold leading-[1.3]",
                  "placeholder:text-label-assistive",
                  "text-label-normal",
                  disabled &&
                    "cursor-not-allowed text-label-disabled placeholder:text-label-disabled",
                )}
                disabled={disabled}
                required={required}
                maxLength={maxLength}
                rows={rows}
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
                {...textareaProps}
              />
            </div>

            {/* Bottom: 글자수 카운터 + 트레일링 콘텐츠 */}
            {hasBottomBar && (
              <div className="flex items-center gap-2">
                {/* LeadingContent: 글자수 카운터 */}
                {maxLength !== undefined && (
                  <div className="flex flex-1 items-center gap-0.5 px-1 text-[14px] font-medium leading-[1.4] tracking-[-0.035px] text-label-assistive">
                    <span>{charCount}</span>
                    <span>/{maxLength}</span>
                  </div>
                )}

                {/* 카운터 없을 때 spacer */}
                {maxLength === undefined && <div className="flex-1" />}

                {/* TrailingContent: 에러 아이콘 OR 텍스트 버튼 */}
                {showErrorIcon ? (
                  <CircleExclamationFill
                    className="shrink-0 size-5 text-status-negative"
                    aria-hidden="true"
                  />
                ) : actionLabel ? (
                  <button
                    type="button"
                    className={cn(
                      "shrink-0 rounded-3xl py-1 text-[16px] font-semibold leading-[1.3]",
                      disabled
                        ? "cursor-not-allowed text-label-disabled"
                        : "cursor-pointer text-primary-strong",
                    )}
                    disabled={disabled}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      if (!disabled) onAction?.()
                    }}
                    tabIndex={-1}
                  >
                    {actionLabel}
                  </button>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Helper text — TextField과 동일 */}
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

export { TextArea }
export type { TextAreaProps }
