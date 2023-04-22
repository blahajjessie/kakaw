import Image from 'next/image'
import { Inter } from 'next/font/google'

import logo from '../public/logo.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">

        <Image
          alt="Kakaw logo"
          src={logo}
          width={200}
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />

        <form className="p-8 mb-2 w-4/5 sm:w-full">
          <input className="bg-gray-100 border-1 border-gray-200 rounded-xl w-full px-4 py-2 mb-4 text-center text-lg shadow-md" id="code" type="text" placeholder="Code" maxLength={8} required />
          <input className="bg-gray-100 border-1 border-gray-200 rounded-xl w-full px-4 py-2 mb-4 text-center text-lg shadow-md" id="username" type="text" placeholder="Username" maxLength={30} required />
          <button className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl w-full px-4 py-2 text-white text-center text-lg shadow-md" type="button">
            Join
          </button>
        </form>

        <a href="/upload" className="text-white cursor-pointer hover:underline">
          Host your own Quiz!
        </a>
      </div>
    </main>
  )
}
