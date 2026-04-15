import type { SkipOption, WasteType } from './types';

export async function lookupPostcode(postcode: string) {
  return fetch('/api/postcode/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postcode }),
  }).then(async (response) => {
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || 'Postcode lookup failed');
    }
    return body as { postcode: string; addresses: Array<{ id: string; line1: string; city: string }> };
  });
}

export async function submitWasteSelection(data: { heavyWaste: boolean; plasterboard: boolean; plasterboardOption: string | null }) {
  return fetch('/api/waste-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || 'Waste type submission failed');
    }
    return body as { ok: true };
  });
}

export async function fetchSkips(postcode: string, heavyWaste: boolean) {
  const normalized = postcode.toUpperCase().replace(/\s+/g, '');
  return fetch(`/api/skips?postcode=${encodeURIComponent(normalized)}&heavyWaste=${heavyWaste}`)
    .then(async (response) => {
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || 'Skip selection failed');
      }
      return body as { skips: SkipOption[] };
    });
}

export async function confirmBooking(payload: {
  postcode: string;
  addressId: string;
  heavyWaste: boolean;
  plasterboard: boolean;
  skipSize: string;
  price: number;
}) {
  return fetch('/api/booking/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(async (response) => {
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.error || 'Booking confirmation failed');
    }
    return body as { status: string; bookingId: string };
  });
}
