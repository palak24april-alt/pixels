const DEVICE_ID_KEY = "aurora.device-id"

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  // fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Anonymous device identity — generated once on first load and reused after.
 * This replaces email/password auth: saves persist on this device with zero login.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server"
  let id = window.localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = uuid()
    window.localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}
