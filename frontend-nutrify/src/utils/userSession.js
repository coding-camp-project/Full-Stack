const USER_DATA_KEY = "userData";

export const USER_DATA_UPDATED_EVENT = "userDataUpdated";

export function getUserData() {
  try {
    return JSON.parse(localStorage.getItem(USER_DATA_KEY) || "{}");
  } catch {
    return {};
  }
}

/** True when user has finished onboarding personalization. */
export function isPersonalizationCompleted() {
  return getUserData().isPersonalized === true;
}

/** True when user must complete personalization before other dashboard features. */
export function isOnboardingRequired() {
  return getUserData().isPersonalized === false;
}

export function updateUserData(partial) {
  const current = getUserData();
  const next = { ...current, ...partial };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED_EVENT));
  return next;
}

export function markPersonalizationCompleted(overrides = {}) {
  return updateUserData({ isPersonalized: true, ...overrides });
}

export function markPersonalizationIncomplete() {
  return updateUserData({ isPersonalized: false });
}
