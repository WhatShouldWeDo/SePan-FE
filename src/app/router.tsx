import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "@/app/layouts/AuthLayout";
import { RootLayout } from "@/app/layouts/RootLayout";
import { ProtectedRoute } from "@/app/layouts/ProtectedRoute";
import { LoginPage } from "@/app/routes/LoginPage";
import { SignupPage } from "@/app/routes/SignupPage";
import { DashboardPage } from "@/app/routes/DashboardPage";
import { RegionResultPage } from "@/app/routes/RegionResultPage";
import { PledgesOverviewPage } from "@/app/routes/PledgesOverviewPage";
import { PresidentialPledgesPage } from "@/app/routes/PresidentialPledgesPage";
import { ParliamentaryPledgesPage } from "@/app/routes/ParliamentaryPledgesPage";
import { LocalElectionPledgesPage } from "@/app/routes/LocalElectionPledgesPage";
import { CandidateDetailPage } from "@/app/routes/CandidateDetailPage";
import { PledgesPlaceholderPage } from "@/app/routes/PledgesPlaceholderPage";
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
					{ path: "/region", element: <RegionResultPage /> },
					{ path: "/pledges", element: <PledgesOverviewPage /> },
					{ path: "/pledges/presidential", element: <PresidentialPledgesPage /> },
					{ path: "/pledges/parliamentary", element: <ParliamentaryPledgesPage /> },
					{ path: "/pledges/local", element: <LocalElectionPledgesPage /> },
					{ path: "/pledges/:electionType/:candidateId", element: <CandidateDetailPage /> },
					{ path: "/pledges/:type", element: <PledgesPlaceholderPage /> },
					{ path: "/test", element: <TestPage /> },
				],
			},
		],
	},
	// 404
	{ path: "*", element: <NotFoundPage /> },
]);
