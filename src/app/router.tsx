import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { RootLayout } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/app/layouts/ProtectedRoute";
import { LoginPage } from "@/app/routes/LoginPage";
import { SignupPage } from "@/app/routes/SignupPage";
import { DashboardPage } from "@/app/routes/DashboardPage";
import { RegionPage } from "@/app/routes/RegionPage";
import { RegionResultPage } from "@/app/routes/RegionResultPage";
import { PolicyPage } from "@/app/routes/PolicyPage";
import { PolicyFormPage } from "@/app/routes/PolicyFormPage";
import { NotFoundPage } from "@/app/routes/NotFoundPage";
import TestPage from "./routes/TestPage";

export const router = createBrowserRouter([
	// 로그인 (자체 레이아웃)
	{ path: "/login", element: <LoginPage /> },
	// 회원가입 (AuthLayout)
	{
		element: <AuthLayout />,
		children: [{ path: "/signup", element: <SignupPage /> }],
	},
	// 인증 필요 라우트
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <RootLayout />,
				children: [
					{ path: "/", element: <DashboardPage /> },
					{ path: "/region", element: <RegionPage /> },
					{ path: "/region/:regionId", element: <RegionResultPage /> },
					{ path: "/policy", element: <PolicyPage /> },
					{ path: "/policy/new", element: <PolicyFormPage /> },
					{ path: "/policy/:id/edit", element: <PolicyFormPage /> },
					{ path: "/test", element: <TestPage /> },
				],
			},
		],
	},
	// 404
	{ path: "*", element: <NotFoundPage /> },
]);
