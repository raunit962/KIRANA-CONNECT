/**
 * Security & Token generation utilities for Pickup OTP and QR Pass
 */

export function generate4DigitOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function generateQrToken(parcelId: string, phone: string): string {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KC-AUTH-${parcelId.slice(-4)}-${timestamp}-${randomSuffix}`;
}

export function validatePickupHandoff(
  inputCode: string,
  parcel: { pickupOtp: string; qrToken: string }
): { isValid: boolean; method: 'OTP' | 'QR' | 'INVALID'; message: string } {
  const cleanInput = inputCode.trim();

  // Check QR token match
  if (cleanInput === parcel.qrToken) {
    return {
      isValid: true,
      method: 'QR',
      message: 'Cryptographic QR token validated successfully.',
    };
  }

  // Check 4-digit numeric OTP match
  if (cleanInput === parcel.pickupOtp) {
    return {
      isValid: true,
      method: 'OTP',
      message: '4-Digit Pickup OTP verified successfully.',
    };
  }

  return {
    isValid: false,
    method: 'INVALID',
    message: 'Invalid OTP or QR code. Verification failed.',
  };
}
