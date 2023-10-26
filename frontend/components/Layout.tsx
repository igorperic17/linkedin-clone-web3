import { ReactNode } from 'react'
import Head from 'next/head'
import Nav from './Nav'
import Link from 'next/link'
import Image from 'next/image';


export default function Layout({ children }: { children: ReactNode }) {




  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.png" />
        </Head>

        <Nav />
        <main className="z-10 relative flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center ">
          {children}
        </main>
        <footer className="flex items-center justify-center w-full h-20 border-t text-neutral">
          <Link
            target="_blank" rel="noreferrer"
            className=""
            href="/education"
          >
            <a className="hover:text-primary">Education</a>
          </Link>
          <span className="px-10"> | </span>
          <Link
            className=""
            href="/event"
          >
            <a className="hover:text-primary">Events</a>
          </Link>
          <span className="px-10"> | </span>
          <Link
            className=""
            href="/employment"
          >
            <a className="hover:text-primary">Employment</a>
          </Link>
        </footer>
      </div>
    </div>

  )
}
