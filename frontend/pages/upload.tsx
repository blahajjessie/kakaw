import Image from 'next/image'
import { Inter } from 'next/font/google'
import MatchMediaWrapper from '../components/MatchMediaWrapper'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const mobileContent = (
    <main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">

        <div className="bg-gray-100 rounded-xl w-2/5 px-8 py-2 -mb-2 font-mono text-4xl text-center font-extrabold shadow-heavy">
          404
        </div>
        <div className="bg-gray-100 rounded-xl w-4/5 px-8 py-4 mb-2 text-lg text-center shadow-heavy">
          Feature not supported on mobile devices :&#40;
        </div>

      </div>
    </main>
  )

  const desktopContent = (
    <main className="bg-purple-100 flex min-h-screen flex-col items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">

        <form className="bg-gray-100 rounded-xl w-full p-10 mb-2 shadow-heavy">
          <div className="text-center text-lg mb-2">Upload Quiz</div>
          <div className="flex flex-row justify-center px-1">
            <button className="bg-white hover:bg-gray-50 border-1 border-gray-200 rounded-xl w-full p-2 mx-2 text-gray-100 text-center text-lg shadow-md" type="button">
              Select File
            </button>
            <button className="bg-orange-200 hover:bg-orange-100 border-1 border-gray-200 rounded-xl w-full p-2 mx-2 text-white text-center text-lg shadow-md" type="button">
              Upload
            </button>
          </div>
        </form>

      </div>
    </main>
  )

  return <MatchMediaWrapper mobileContent={mobileContent} desktopContent={desktopContent}/>
}
