import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import HealthDataForm from './components/HealthDataForm';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import MorningReview from './components/MorningReview';
import ClinicalTestResults from './components/ClinicalTestResults';
import QnA from './components/QnA';
import RecentQuestions from './components/RecentQuestions';
import Settings from './components/Settings';
import Information from './components/Information';
import AdminDashboard from './components/AdminDashboard';
import AdminDashboardLayout from './components/AdminDashboardLayout';
import AdminUsers from './components/AdminUsers';
import AdminUserDetails from './components/AdminUserDetails';
import AdminQnA from './components/AdminQnA';
import AdminMessages from './components/AdminMessages';
import './tailwind.css'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/morning-review" element={<MorningReview />} />
        <Route path="/dashboard/clinical-test-results" element={<ClinicalTestResults />} />
        <Route path="/dashboard/healthdata-form" element={<HealthDataForm />} />
        <Route path="/dashboard/qna" element={<QnA />} />
        <Route path="/dashboard/recent-questions" element={<RecentQuestions />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/information" element={<Information />} />
        <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="user-details/:userId" element={<AdminUserDetails />} />
          <Route path="qna" element={<AdminQnA />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
