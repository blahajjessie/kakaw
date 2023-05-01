import Image from 'next/image';
import logo2 from '../public/logo2.png';
import { Inter } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function playerWaiting() {
    return (
        <main className={`${inter.variable} font-sans bg-purple-100 flex min-h-screen flex-col items-center justify-center`}>
            <div className="flex w-full max-w-sm flex-col items-center justify-center font-extrabold">
                <Image
                        alt="Kakaw logo"
                        src={logo2}
                        width={189}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                />
                <div className= "text-orange-200 text-4xl text-center">
                    You entered a game!
                </div>
                <div className= "text-black text-2xl text-center">
                    Your quiz will start soon...
                </div>
            </div>
        </main>
    );
}
