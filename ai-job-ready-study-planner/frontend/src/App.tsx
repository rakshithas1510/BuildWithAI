import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import StudyPlanPage from './pages/StudyPlanPage';
import SkillGapPage from './pages/SkillGapPage';
import { useActor } from './hooks/useActor';
import { useQuery } from '@tanstack/react-query';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: DashboardPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const studyPlanRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/study-plan',
  component: StudyPlanPage,
});

const skillGapRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/skill-gap',
  component: SkillGapPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([indexRoute, studyPlanRoute, skillGapRoute]),
  onboardingRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
