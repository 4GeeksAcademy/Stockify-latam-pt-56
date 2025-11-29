const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { store } = useGlobalReducer();
    const token = store.token;
    const userData = store.userData;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Si se requiere un rol específico
    if (requiredRole) {
        const userRole = userData?.role;

        // Verificar acceso según jerarquía
        let hasAccess = false;

        switch (requiredRole) {
            case 'master':
                // Solo usuarios master
                hasAccess = userRole === 'master';
                break;
            case 'Administrator':
                // Administrador: dashboard + productos/categorías
                hasAccess = userRole === 'Administrator';
                break;
            case 'Seller':
                // Vendedor: dashboard para órdenes
                hasAccess = userRole === 'Seller';
                break;
            case 'Dashboard':
                // Dashboard: Vendedor Y Administrador
                hasAccess = userRole === 'Seller' || userRole === 'Administrator';
                break;
            default:
                hasAccess = userRole === requiredRole;
        }

        if (!hasAccess) {
            // Redirigir según el rol del usuario
            if (userRole === 'Seller' || userRole === 'Administrador') {
                return <Navigate to="/dashboard" replace />;
            } else if (userRole === 'master') {
                return <Navigate to="/masterview" replace />;
            } else {
                return <Navigate to="/" replace />;
            }
        }
    }

    return children;
};