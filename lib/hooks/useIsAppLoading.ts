import { useEffect, useState } from "react";

export const useIsAppLoading = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);
  }, []);
 
  return isAppLoading;
};

