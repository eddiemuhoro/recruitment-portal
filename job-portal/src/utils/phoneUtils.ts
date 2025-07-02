/**
 * Phone number utilities for handling Kenyan phone numbers.
 * Normalizes phone numbers to international format (+254XXXXXXXX).
 */

/**
 * Normalize Kenyan phone number to international format (+254XXXXXXXX).
 *
 * Handles common formats:
 * - 0705982249 -> +254705982249
 * - 705982249 -> +254705982249
 * - +254705982249 -> +254705982249 (no change)
 * - 254705982249 -> +254705982249
 */
export function normalizeKenyanPhone(phone: string): string | null {
  if (!phone) return null;

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "").trim();

  if (!cleaned) return null;

  let normalized: string;

  // Handle different formats
  if (cleaned.startsWith("+254")) {
    // Already in international format
    normalized = cleaned;
  } else if (cleaned.startsWith("254")) {
    // Missing the + sign
    normalized = "+" + cleaned;
  } else if (cleaned.startsWith("0")) {
    // Replace leading 0 with +254
    normalized = "+254" + cleaned.slice(1);
  } else if (
    cleaned.length === 9 &&
    (cleaned.startsWith("7") || cleaned.startsWith("1"))
  ) {
    // Missing country code and leading 0 (e.g., 705982249)
    normalized = "+254" + cleaned;
  } else {
    // Unknown format
    return null;
  }

  // Validate final format: +254 followed by 9 digits starting with 7 or 1
  const isValid = /^\+254[71]\d{8}$/.test(normalized);
  return isValid ? normalized : null;
}

/**
 * Check if phone number is a valid Kenyan phone number.
 */
export function isValidKenyanPhone(phone: string): boolean {
  return normalizeKenyanPhone(phone) !== null;
}

/**
 * Format phone number for display (e.g., +254 705 982 249).
 */
export function formatPhoneForDisplay(phone: string): string {
  const normalized = normalizeKenyanPhone(phone);
  if (!normalized) return phone;

  // Format as +254 XXX XXX XXX
  return `${normalized.slice(0, 4)} ${normalized.slice(
    4,
    7
  )} ${normalized.slice(7, 10)} ${normalized.slice(10)}`;
}

/**
 * Generate WhatsApp URL for the given phone number.
 */
export function getWhatsAppUrl(
  phone: string,
  message: string = ""
): string | null {
  const normalized = normalizeKenyanPhone(phone);
  if (!normalized) return null;

  // Remove + for WhatsApp URL (WhatsApp expects just digits)
  const whatsappNumber = normalized.slice(1); // Remove the +

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  }

  return `https://wa.me/${whatsappNumber}`;
}

/**
 * Generate SMS URL for the given phone number.
 */
export function getSmsUrl(phone: string, message: string = ""): string | null {
  const normalized = normalizeKenyanPhone(phone);
  if (!normalized) return null;

  if (message) {
    const encodedMessage = encodeURIComponent(message);
    return `sms:${normalized}?body=${encodedMessage}`;
  }

  return `sms:${normalized}`;
}

/**
 * Validate and provide user-friendly feedback for phone number input.
 */
export function validatePhoneInput(phone: string): {
  isValid: boolean;
  message?: string;
  normalized?: string;
} {
  if (!phone.trim()) {
    return { isValid: true }; // Empty is OK if field is optional
  }

  const normalized = normalizeKenyanPhone(phone);

  if (!normalized) {
    return {
      isValid: false,
      message:
        "Please enter a valid Kenyan phone number (e.g., 0705982249 or +254705982249)",
    };
  }

  return {
    isValid: true,
    normalized,
  };
}
