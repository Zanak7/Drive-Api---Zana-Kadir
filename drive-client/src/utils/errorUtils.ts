// Utility to extract error messages from API responses or JS errors
export function getErrorMessage(err: any, fallback = 'An error occurred'): string {
  if (err?.response?.data?.message) return err.response.data.message;
  if (Array.isArray(err?.response?.data) && err.response.data[0]?.description) return err.response.data[0].description;
  if (err?.message) return err.message;
  return fallback;
}
