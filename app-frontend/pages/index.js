import Head from 'next/head'
import Footer from "../components/Footer";
import Header from "../components/Header";
import TransactionPage from '../components/TransactionPage';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Frontend Boilerplate React/NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <Header />
        <TransactionPage />
      </main>
      <Footer />
    </div>
  )
}
