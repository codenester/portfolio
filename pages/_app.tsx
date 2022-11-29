import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import {CookiesProvider} from 'react-cookie'

export default function App({ Component, pageProps }: AppProps) {
  return <CookiesProvider>
  <Layout>
    <Component {...pageProps} />
  </Layout>
</CookiesProvider>
}
