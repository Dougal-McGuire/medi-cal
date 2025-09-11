interface NephrologyIconProps {
  className?: string
}

export default function NephrologyIcon({ className = "h-4 w-4" }: NephrologyIconProps) {
  return (
    <span 
      className={`material-symbols-outlined ${className}`}
      style={{ 
        fontSize: 'inherit',
        width: '1em',
        height: '1em',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      nephrology
    </span>
  )
}