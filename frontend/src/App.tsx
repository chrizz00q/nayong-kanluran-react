import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CitizensList } from './pages/inhabitants/CitizensList';
import { HouseholdsList } from './pages/inhabitants/HouseholdsList';
import { CertificatesList } from './pages/certification/CertificatesList';
import { PopulationsDemographic } from './pages/demographics/PopulationsDemographic';
import { HouseholdsDemographic } from './pages/demographics/HouseholdsDemographic';
import { PetsList } from './pages/extras/PetsList';
import { ReportsHub } from './pages/reports/ReportsHub';
import { HouseholdReport } from './pages/reports/HouseholdReport';
import { VotersListReport } from './pages/reports/VotersListReport';
import { PopulationByAgeReport } from './pages/reports/PopulationByAgeReport';
import { PopulationBySectorReport } from './pages/reports/PopulationBySectorReport';
import { PopulationByStreetReport } from './pages/reports/PopulationByStreetReport';

function Protected({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/inhabitants/citizens" element={<Protected><CitizensList /></Protected>} />
        <Route path="/inhabitants/households" element={<Protected><HouseholdsList /></Protected>} />
        <Route path="/certification" element={<Protected><CertificatesList /></Protected>} />
        <Route path="/demographic/populations" element={<Protected><PopulationsDemographic /></Protected>} />
        <Route path="/demographic/households" element={<Protected><HouseholdsDemographic /></Protected>} />
        <Route path="/extras/pets" element={<Protected><PetsList /></Protected>} />
        <Route path="/reports" element={<Protected><ReportsHub /></Protected>} />
        <Route path="/reports/household" element={<Protected><HouseholdReport /></Protected>} />
        <Route path="/reports/voters" element={<Protected><VotersListReport /></Protected>} />
        <Route path="/reports/population-by-age" element={<Protected><PopulationByAgeReport /></Protected>} />
        <Route path="/reports/population-by-sector" element={<Protected><PopulationBySectorReport /></Protected>} />
        <Route path="/reports/population-by-street" element={<Protected><PopulationByStreetReport /></Protected>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
