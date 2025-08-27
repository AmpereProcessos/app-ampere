'use client'
import type { TGetSessionResponse } from '@/app/api/auth/session/route'
import type { TAuthSession } from '@/lib/authentication/types'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

async function fetchSession() {
  try {
    const { data } = await axios.get<TGetSessionResponse>('/api/auth/session')
    return data
  } catch (error) {
    console.error('Error fetching session:', error)
    return null
  }
}

type TUseSessionResponse =
  | {
      session: TAuthSession
      status: 'authenticated'
    }
  | {
      session: null
      status: 'unauthenticated'
    }
  | {
      session: null
      status: 'loading'
    }
export function useSession(): TUseSessionResponse {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 30 * 60 * 1000,
    refetchInterval: 30 * 60 * 1000,
  })

  function getStatus() {
    const isSessionDefined = !!data?.session
    if (isFetched && isSessionDefined) return 'authenticated'
    if (isFetched && !isSessionDefined) return 'unauthenticated'
    return 'loading'
  }
  const status = getStatus()
  if (status === 'authenticated') return { session: data as TAuthSession, status }
  if (status === 'unauthenticated') return { session: null, status }
  return { session: null, status }
}
