import {classNames} from "@/lib/utils.ts";

const colors = [
  {
    bg: 'bg-teal-50',
    fg: 'text-teal-700',
  },
  {
    bg: 'bg-purple-50',
    fg: 'text-purple-700',
  },
  {
    bg: 'bg-sky-50',
    fg: 'text-sky-700',
  },
  {
    bg: 'bg-yellow-50',
    fg: 'text-yellow-700',
  },
  {
    bg: 'bg-rose-50',
    fg: 'text-rose-700',
  },
  {
    bg: 'bg-indigo-50',
    fg: 'text-indigo-700',
  },
]

function getRandomColor(): { bg: string; fg: string } {
  return colors[Math.floor(Math.random() * colors.length)]
}

interface Props {
  title: string;
  description: string;
  icon: JSX.Element;
  index: number;
  totalCards: number;
  onClick: () => void;
}

export default function SelfServiceCard({title, description, icon, index, totalCards, onClick}: Props) {
  const {bg: iconBackground, fg: iconForeground} = getRandomColor()

  return (
    <div>
      <div
        key={title}
        className={classNames(
          index === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
          index === 1 ? 'sm:rounded-tr-lg' : '',
          index === totalCards - 2 ? 'sm:rounded-bl-lg' : '',
          index === totalCards - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
          'group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
        )}
      >
        <div>
            <span
              className={classNames(
                iconBackground,
                iconForeground,
                'inline-flex rounded-lg p-3 ring-4 ring-white'
              )}
            >
            {icon}
            </span>
        </div>
        <div className="mt-8">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            <a href="#" className="focus:outline-none" onClick={onClick}>
              {/* Extend touch target to entire panel */}
              <span className="absolute inset-0" aria-hidden="true"/>
              {title}
            </a>
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        </div>
        <span
          className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
          aria-hidden="true"
        >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"/>
            </svg>
          </span>
      </div>
    </div>
  )
}
