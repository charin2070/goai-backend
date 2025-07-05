interface StatProps {
  title: string
  value: string
  change: string
}

export function Stat({ title, value, change }: StatProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="mt-2 flex items-baseline">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      </div>
    </div>
  )
}