import axios from 'axios';

/** Pull a human-readable message out of an axios/API error. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  return fallback;
}
