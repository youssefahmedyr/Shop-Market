'use client'

import {useAutoRefreshAll} from '../_hooks/use-api-query'

export default function AutoRefreshWrapper({
  children
}: {
  children: React.ReactNode
}) {
  useAutoRefreshAll()
  return <>{children}</>
}
