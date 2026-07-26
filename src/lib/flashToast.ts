const STORAGE_KEY = "zowasel-flash-toast";

type FlashToastType = "success" | "error";

interface FlashToast {
  message: string;

  type: FlashToastType;
}

export function setFlashToast(
  message: string,
  type: FlashToastType = "success"
) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ message, type } satisfies FlashToast)
  );
}

export function consumeFlashToast(): FlashToast | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);

  if (!raw) return null;

  sessionStorage.removeItem(STORAGE_KEY);

  try {
    return JSON.parse(raw) as FlashToast;
  } catch {
    return null;
  }
}
