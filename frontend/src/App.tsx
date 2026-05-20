import { Router, Route } from 'wouter';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Dashboard from './pages/dashboard';
import Scan from './pages/scan';
import ScanHistory from './pages/scan-history';
import ScanSessionDetail from './pages/scan-session-detail';
import Domeny from './pages/domeny';
import DomainDetail from './pages/domain-detail';
import Integrations from './pages/integrations';
import Pipeline from './pages/pipeline';
import Prompt from './pages/prompt';
import Configure from './pages/configure';
import Install from './pages/install';
import NotFound from './pages/not-found';

import AppLayout from './components/layout/AppLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router base="">
        <AppLayout>
          <Route path="/" component={Dashboard} />
          <Route path="/scan" component={Scan} />
          <Route path="/scan-history" component={ScanHistory} />
          <Route path="/scan/session/:id" component={ScanSessionDetail} />
          <Route path="/domeny" component={Domeny} />
          <Route path="/domeny/:id" component={DomainDetail} />
          <Route path="/integrations" component={Integrations} />
          <Route path="/pipeline" component={Pipeline} />
          <Route path="/prompt" component={Prompt} />
          <Route path="/configure" component={Configure} />
          <Route path="/install" component={Install} />
          <Route component={NotFound} />
        </AppLayout>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
