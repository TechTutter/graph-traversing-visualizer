import { cn } from '@lib/utils/cn';
import { Outlet } from 'react-router-dom';

export const FullscreenLayout = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  return <div className={cn('h-screen w-screen', 'bg-black/90', className)}>{children ? children : <Outlet />}</div>;
};
