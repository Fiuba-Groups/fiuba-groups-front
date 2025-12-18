import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    isAuthenticated: boolean,
    children: ReactNode
}

export function ProtectedRoute ({ isAuthenticated, children}: ProtectedRouteProps) {
    if (!isAuthenticated) {
        return (
            <Navigate to="/login" replace/>
        )
    }
    return (
        <>
        {children}
        </>
    )
}