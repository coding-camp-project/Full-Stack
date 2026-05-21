const USER_DATA_KEY = "userData";

export const USER_DATA_UPDATED_EVENT = "userDataUpdated";

export function getUserData() {
  try {
    return JSON.parse(
      localStorage.getItem(USER_DATA_KEY) ||
      sessionStorage.getItem(USER_DATA_KEY) ||
      "{}"
    );
  } catch {
    return {};
  }
}

export function getUserToken() {
  return localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
}

/** True when user has finished onboarding personalization. */
export function isPersonalizationCompleted() {
  return getUserData().isPersonalized === true;
}

/** True when user must complete personalization before other dashboard features. */
export function isOnboardingRequired() {
  const data = getUserData();
  // Onboarding is only required if the user is actually logged in (has an email) but hasn't completed personalization yet
  return data && data.email && data.isPersonalized === false;
}

export function updateUserData(partial) {
  const current = getUserData();
  const next = { ...current, ...partial };
  
  // Update in whichever storage currently has the user data
  if (localStorage.getItem(USER_DATA_KEY)) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(next));
  } else {
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(next));
  }
  
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED_EVENT));
  return next;
}

export function setUserSession(token, userData, rememberMe) {
  if (rememberMe) {
    localStorage.setItem("userToken", token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem(USER_DATA_KEY);
  } else {
    sessionStorage.setItem("userToken", token);
    sessionStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    localStorage.removeItem("userToken");
    localStorage.removeItem(USER_DATA_KEY);
  }
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED_EVENT));
}

export function clearUserSession() {
  localStorage.removeItem("userToken");
  localStorage.removeItem(USER_DATA_KEY);
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem(USER_DATA_KEY);
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED_EVENT));
}

export function markPersonalizationCompleted(overrides = {}) {
  return updateUserData({ isPersonalized: true, ...overrides });
}

export function markPersonalizationIncomplete() {
  return updateUserData({ isPersonalized: false });
}
