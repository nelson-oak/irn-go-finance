import { renderHook, act } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'
import { logInAsync } from 'expo-google-app-auth'

import { AuthProvider, useAuth } from './auth'

jest.mock('expo-google-app-auth')

describe('Auth Hook', () => {
  it('should be able to sign in with Google account', async () => {
    const googleMocked = mocked(logInAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'success',
      user: {
        id: 'user-id',
        email: 'user-email',
        name: 'user-name',
        photo: 'user-photo',
      }
    })

    const { result } = renderHook(
      () => useAuth(),
      {
        wrapper: AuthProvider
      }
    )

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user.email).toBe('user-email')
  })

  it('should not be able to sign in with Google account if the user cancel the authentication', async () => {
    const googleMocked = mocked(logInAsync as any)
    googleMocked.mockReturnValueOnce({
      type: 'cancel'
    })

    const { result } = renderHook(
      () => useAuth(),
      {
        wrapper: AuthProvider
      }
    )

    await act(() => result.current.signInWithGoogle())

    expect(result.current.user).not.toHaveProperty('id')
  })

  // Falta aprender a fazer teste com erros
  // it('should be able to throw a error if Google authentication throws', async () => {
  //   const googleMocked = mocked(logInAsync)
  //   googleMocked.mockImplementationOnce(() => {
  //     throw new Error('teste')
  //   })

  //   const { result } = renderHook(
  //     () => useAuth(),
  //     {
  //       wrapper: AuthProvider
  //     }
  //   )

  //   expect(
  //     await act(() => result.current.signInWithGoogle())
  //   ).toThrow()
  // })
})