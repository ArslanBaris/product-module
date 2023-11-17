import { Inter } from 'next/font/google'
import Dashboard from '@/components/dashboard/Dashboard'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className='d-flex p-4'>
        <Dashboard />
     </div>
  )
}
