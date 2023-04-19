import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="bg-indigo-800 flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-white text-6xl text-center font-bold my-8 select-none">
          Kakaw
        </div>
        <form className="bg-white shadow-md rounded p-8 my-8">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            You are...
          </label>
          <input className="appearance-none border rounded w-full py-2 px-3 mb-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Name" maxLength={30} required />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Play!
          </button>
        </form>
        <form className="bg-white shadow-md rounded p-8 my-8">
          <div className="block text-gray-700 text-sm font-bold mb-2 cursor-default">
            Or upload a quiz:
          </div>
          <div className="flex flex-row items-center">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline" type="button">
              Upload
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Host!
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
