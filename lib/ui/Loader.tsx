import { FullscreenLayout } from '@lib/layouts/FullscreenLayout';

export const Loader = () => {
  return (
    <FullscreenLayout className="absolute top-0 left-0 z-50 flex justify-center items-center bg-black/90">
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </FullscreenLayout>
  );
};
