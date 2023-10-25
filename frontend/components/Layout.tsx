import { ReactNode } from 'react'
import Head from 'next/head'
import Nav from './Nav'
import Link from 'next/link'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 text-base-content">
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_TITLE}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Nav />
      <main className="flex flex-col items-center justify-center w-full flex-1 p-2 md:px-20 text-center">
        {children}
      </main>
      <footer className="flex items-center justify-center w-full h-24 border-t">
        <Link
          target="_blank" rel="noreferrer"
          className="pl-1 link link-primary link-hover"
          href="/education"
        >
          Education
        </Link>
        <span className="pl-1 pr-1"> | </span>
        <Link
          className="pl-1 link link-primary link-hover"
          href="/hackaton"
        >
          Hackathon
        </Link>
        <span className="pl-1 pr-1"> | </span>
        <Link
          className="pl-1 link link-primary link-hover"
          href="/employment"
        >
          Work experience
        </Link>
      </footer>
    </div>
  )
}
