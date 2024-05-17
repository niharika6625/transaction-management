import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp

//Q: How is this file and index.js connected? this file is not being used anywhere 
//Q: tailwind import ?