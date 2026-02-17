/**
 * Toast 알림 시스템 (sonner + Figma Toast 컴포넌트 통합)
 *
 * - sonner의 toast.custom()으로 Figma 스펙 Toast UI를 렌더링
 * - 애니메이션, auto-dismiss, 스태킹은 sonner가 처리
 * - 위치: top-center (Toaster에서 설정)
 */
import { toast as sonnerToast } from "sonner";
import { Toast } from "@/components/ui/toast";

export interface ToastOptions {
	/** Toast 지속 시간 (밀리초) */
	duration?: number;
	/** 사용자가 직접 닫을 수 있는지 여부 */
	dismissible?: boolean;
}

const DEFAULT_INFO_DURATION = 3000;
const DEFAULT_ERROR_DURATION = 4000;
const DEFAULT_SUCCESS_DURATION = 3000;
const DEFAULT_WARNING_DURATION = 4000;

export const toast = {
	success: (message: string, options?: ToastOptions) => {
		sonnerToast.custom(() => <Toast variant="success">{message}</Toast>, {
			duration: options?.duration ?? DEFAULT_SUCCESS_DURATION,
		});
	},

	error: (message: string, options?: ToastOptions) => {
		sonnerToast.custom(() => <Toast variant="error">{message}</Toast>, {
			duration: options?.duration ?? DEFAULT_ERROR_DURATION,
		});
	},

	info: (message: string, options?: ToastOptions) => {
		sonnerToast.custom(() => <Toast variant="info">{message}</Toast>, {
			duration: options?.duration ?? DEFAULT_INFO_DURATION,
		});
	},

	warning: (message: string, options?: ToastOptions) => {
		sonnerToast.custom(() => <Toast variant="warning">{message}</Toast>, {
			duration: options?.duration ?? DEFAULT_WARNING_DURATION,
		});
	},
};
