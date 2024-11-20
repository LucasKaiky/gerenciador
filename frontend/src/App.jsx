import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import TaskDashboard from './components/TaskDashboard/TaskDashboard';
import Perfil from './components/Perfil/Perfil';

const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <TaskDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/perfil" 
                        element={
                            <ProtectedRoute>
                                <Perfil />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
