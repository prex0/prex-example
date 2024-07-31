export const LoadingIndicator = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-ping h-2 w-2 bg-white rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-white rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-white rounded-full"></div>
    </div>
  )
}

export const LoadingIndicatorDark = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-ping h-2 w-2 bg-zinc-900 rounded-full"></div>
      <div className="animate-ping h-2 w-2 bg-zinc-900 rounded-full mx-4"></div>
      <div className="animate-ping h-2 w-2 bg-zinc-900 rounded-full"></div>
    </div>
  )
}
