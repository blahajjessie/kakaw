import Image from 'next/image'
import { Inter } from 'next/font/google'

import logo from '../public/logo.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">

        <form className="bg-gray-300 rounded-lg w-full p-10 mb-2 shadow-heavy">
          <div className="text-center text-lg mb-2">Upload Quiz</div>
          <div className="flex flex-row justify-center px-1">
            <button className="bg-white hover:bg-gray-50 border-1 border-gray-300 rounded-lg w-full p-2 mx-2 text-gray-100 text-center text-lg shadow-md" type="button">
              Select File
            </button>
            <button className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-300 rounded-lg w-full p-2 mx-2 text-white text-center text-lg shadow-md" type="button">
              Upload
            </button>
          </div>
        </form>

      </div>
    </main>
  )
}
