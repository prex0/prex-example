import React from 'react'

export const Title = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-3 text-2xl font-bold">{children}</div>
}

export const SubTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-2 text-lg font-bold">{children}</div>
}
