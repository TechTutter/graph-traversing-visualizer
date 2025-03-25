import { cn } from '@lib/utils/cn';
import { Outlet } from 'react-router-dom';

export const MainLayout = ({
  children,
  wrapperClassName,
  mainClassName,
}: {
  children?: React.ReactNode;
  wrapperClassName?: string;
  mainClassName?: string;
}) => {
  return (
    <div className={cn('h-screen w-screen flex flex-col', wrapperClassName)}>
      <main className={cn('grow', mainClassName)}>{children ? children : <Outlet />}</main>
    </div>
  );
};
