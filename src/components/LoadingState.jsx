import { MapPin, Loader2, Search } from 'lucide-react'

const steps = [
  { icon: MapPin,   label: 'Getting your location…' },
  { icon: Search,   label: 'Finding nearby shops…' },
  { icon: Loader2,  label: 'Preparing results…' },
]

export default function LoadingState({ step = 0 }) {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-600/40 flex items-center justify-center animate-pulse">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full animate-ping" />
      </div>

      <div className="flex flex-col items-center gap-3">
        {steps.map(({ icon: Icon, label }, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 text-sm font-medium transition-all duration-500 ${
              i < step ? 'text-emerald-400' : i === step ? 'text-blue-300' : 'text-slate-600'
            }`}
          >
            <Icon className={`w-4 h-4 ${i === step ? 'animate-spin' : ''}`} />
            {label}
            {i < step && ' ✓'}
          </div>
        ))}
      </div>
    </div>
  )
}
