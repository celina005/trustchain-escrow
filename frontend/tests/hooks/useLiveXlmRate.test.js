import { renderHook, waitFor } from '@testing-library/react';
import { useLiveXlmRate } from '../../hooks/useLiveXlmRate';

describe('useLiveXlmRate', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete global.fetch;
  });

  it('returns an error when currency input is empty', async () => {
    const { result } = renderHook(() => useLiveXlmRate(''));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Currency is required');
    expect(result.current.rate).toBeNull();
  });

  it('surfaces an error on malformed rate data (missing/NaN rate field)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ symbol: 'XLM' }), // no `rate` field
    });

    const { result } = renderHook(() => useLiveXlmRate('USD'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Malformed rate response');
    expect(result.current.rate).toBeNull();
  });

  it('surfaces an error on the unhappy path when the request fails (non-OK response)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    });

    const { result } = renderHook(() => useLiveXlmRate('USD'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Rate request failed with status 503');
    expect(result.current.rate).toBeNull();
  });

  it('surfaces an error on the unhappy path when fetch rejects (network failure)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network down'));

    const { result } = renderHook(() => useLiveXlmRate('USD'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('network down');
    expect(result.current.rate).toBeNull();
  });

  it('sets the rate on a well-formed successful response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rate: 0.11 }),
    });

    const { result } = renderHook(() => useLiveXlmRate('USD'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.rate).toBe(0.11);
  });
});
