type ButtonProps = {
  type: 'text' | 'default' | 'pure-text' | 'outlined' | 'alpha',
  status: 'success' | 'warning' | 'error' | 'default' | 'secondary' | 'primary',
  corner: 'circle' | 'default' | 'round',
  children?: any
}
export default function RButton({ corner = 'default', type = 'default', status = 'default', children }: ButtonProps) {
  return (
    <button className={`${type} ${status} ${corner}`}>
      {children}
    </button>
  )
}
