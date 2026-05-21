import { useState, useEffect } from "react";
import {
  getUserData,
  isOnboardingRequired,
  isPersonalizationCompleted,
  USER_DATA_UPDATED_EVENT,
} from "../utils/userSession";

export function useUserSession() {
  const [userData, setUserData] = useState(getUserData);

  useEffect(() => {
    const sync = () => setUserData(getUserData());
    window.addEventListener("storage", sync);
    window.addEventListener(USER_DATA_UPDATED_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(USER_DATA_UPDATED_EVENT, sync);
    };
  }, []);

  return {
    userData,
    isPersonalized: isPersonalizationCompleted(),
    isOnboardingRequired: isOnboardingRequired(),
  };
}
