import { Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import { AuthLayout } from "@/app/layouts/AuthLayout"
import { RootLayout } from "@/app/layouts/RootLayout"
import { ProtectedRoute } from "@/app/layouts/ProtectedRoute"
import { GuestRoute } from "@/app/layouts/GuestRoute"
import { ChunkErrorBoundary } from "@/components/ChunkErrorBoundary"
import TestPage from "./routes/TestPage"

// Loading fallback element (not a component — avoids react-refresh lint)
const pageLoadingFallback = (
	<div className="flex min-h-[50vh] items-center justify-center">
		<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
	</div>
)

// Suspense + ErrorBoundary wrapper
function suspense(Component: React.LazyExoticComponent<React.ComponentType>) {
	return (
		<ChunkErrorBoundary>
			<Suspense fallback={pageLoadingFallback}>
				<Component />
			</Suspense>
		</ChunkErrorBoundary>
	)
}

// Lazy page imports (named exports → default adapter)
const LoginPage = lazy(() =>
	import("@/app/routes/LoginPage").then((m) => ({ default: m.LoginPage }))
)
const SignupPage = lazy(() =>
	import("@/app/routes/SignupPage").then((m) => ({ default: m.SignupPage }))
)
const DashboardPage = lazy(() =>
	import("@/app/routes/DashboardPage").then((m) => ({
		default: m.DashboardPage,
	}))
)
const RegionResultPage = lazy(() =>
	import("@/app/routes/RegionResultPage").then((m) => ({
		default: m.RegionResultPage,
	}))
)
const PledgesOverviewPage = lazy(() =>
	import("@/app/routes/PledgesOverviewPage").then((m) => ({
		default: m.PledgesOverviewPage,
	}))
)
const PresidentialPledgesPage = lazy(() =>
	import("@/app/routes/PresidentialPledgesPage").then((m) => ({
		default: m.PresidentialPledgesPage,
	}))
)
const ParliamentaryPledgesPage = lazy(() =>
	import("@/app/routes/ParliamentaryPledgesPage").then((m) => ({
		default: m.ParliamentaryPledgesPage,
	}))
)
const LocalElectionPledgesPage = lazy(() =>
	import("@/app/routes/LocalElectionPledgesPage").then((m) => ({
		default: m.LocalElectionPledgesPage,
	}))
)
const CandidateDetailPage = lazy(() =>
	import("@/app/routes/CandidateDetailPage").then((m) => ({
		default: m.CandidateDetailPage,
	}))
)
const PledgesPlaceholderPage = lazy(() =>
	import("@/app/routes/PledgesPlaceholderPage").then((m) => ({
		default: m.PledgesPlaceholderPage,
	}))
)
const PolicyPage = lazy(() =>
	import("@/app/routes/PolicyPage").then((m) => ({ default: m.PolicyPage }))
)
const AiRecommendationsPage = lazy(() =>
	import("@/app/routes/AiRecommendationsPage").then((m) => ({
		default: m.AiRecommendationsPage,
	}))
)
const MyPledgesPage = lazy(() =>
	import("@/app/routes/MyPledgesPage").then((m) => ({
		default: m.MyPledgesPage,
	}))
)
const NotFoundPage = lazy(() =>
	import("@/app/routes/NotFoundPage").then((m) => ({
		default: m.NotFoundPage,
	}))
)

export const router = createBrowserRouter([
	// 비인증 전용 라우트 (로그인 상태에서 접근 차단)
	{
		element: <GuestRoute />,
		children: [
			{ path: "/login", element: suspense(LoginPage) },
			{
				element: <AuthLayout />,
				children: [{ path: "/signup", element: suspense(SignupPage) }],
			},
		],
	},
	// 인증 필요 라우트
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <RootLayout />,
				children: [
					{ path: "/", element: suspense(DashboardPage) },
					{ path: "/region", element: suspense(RegionResultPage) },
					{ path: "/policy", element: suspense(PolicyPage) },
					{
						path: "/policy/recommendations",
						element: suspense(AiRecommendationsPage),
					},
					{ path: "/policy/my-pledges", element: suspense(MyPledgesPage) },
					{ path: "/pledges", element: suspense(PledgesOverviewPage) },
					{
						path: "/pledges/presidential",
						element: suspense(PresidentialPledgesPage),
					},
					{
						path: "/pledges/parliamentary",
						element: suspense(ParliamentaryPledgesPage),
					},
					{
						path: "/pledges/local",
						element: suspense(LocalElectionPledgesPage),
					},
					{
						path: "/pledges/:electionType/:candidateId",
						element: suspense(CandidateDetailPage),
					},
					{
						path: "/pledges/:type",
						element: suspense(PledgesPlaceholderPage),
					},
					...(import.meta.env.DEV
						? [{ path: "/test", element: <TestPage /> }]
						: []),
				],
			},
		],
	},
	// 404
	{ path: "*", element: suspense(NotFoundPage) },
])
