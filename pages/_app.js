import '@/styles/globals.css'
import '@/styles/navbar.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "/node_modules/primeflex/primeflex.css"
import 'primeicons/primeicons.css';
import "primeflex/themes/primeone-light.css"   
import Topnav from '@/components/Topnav/Topnav';
import { PrimeReactProvider } from 'primereact/api';

export default function App({ Component, pageProps }) {
  return (
    <>
      <PrimeReactProvider>
        <div className='pr-4 pl-4'>
          <Topnav />
          <Component {...pageProps} />
          </div>
      </PrimeReactProvider>
    </>
  )
}
