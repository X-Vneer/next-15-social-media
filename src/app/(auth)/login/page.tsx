import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { signInImage } from "@/assets"

import LoginForm from "./login-form"

export const metadata: Metadata = {
  title: "signIn",
}
export default function Page() {
  return (
    <>
      <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
        <h1 className="text-center text-3xl font-bold">Login to bugbook</h1>
        <div className="space-y-5">
          {/* <GoogleSignInButton /> */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-muted" />
            <span>OR</span>
            <div className="h-px flex-1 bg-muted" />
          </div>
          <LoginForm />
          <Link href="/signup" className="block text-center hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
      <Image src={signInImage} alt="" className="hidden w-1/2 object-cover md:block" />
    </>
  )
}
