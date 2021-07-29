import { renderHook, act } from '@testing-library/react-hooks'

import { AuthProvider, useAuth } from './auth'

jest.mock('expo-google-app-auth', () => {
  return {
    logInAsync() {
      return {
        type: 'success',
        user: {
          id: 'user-id',
          email: 'user-email',
          name: 'user-name',
          photo: 'user-photo',
        }
      }
    }
  }
})

describe('Auth Hook', () => {
  it('should be able to sign in with Google account', async () => {
    const { result } = renderHook(
      () => useAuth(),
      {
        wrapper: AuthProvider
      }
    )

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user.email).toBe('user-email')
  })
})