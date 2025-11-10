import { useLocation } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface PageWrapperProps {
    children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
    const location = useLocation();

    const isHomePage = location.pathname === '/' || location.pathname === '/kk';
    const paddingClass = isHomePage ? 'pt-[114px]' : 'pt-[57px]';

    return (
        <div className={paddingClass}>
            {children}
        </div>
    );
}