import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { signInImage, signUpImage } from "@/assets"

import SignUpForm from "./sign-up-form"

export const metadata: Metadata = {
  title: "signUp",
}
export default function Page() {
  return (
    <>
      <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Sign up to bugbook</h1>
          <p className="text-muted-foreground">
            A place where even <span className="italic">you</span> can find a friend.
          </p>
        </div>
        <div className="space-y-5">
          <SignUpForm />
          <Link href="/login" className="block text-center hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>

      <Image src={signUpImage} alt="signUp" className="hidden object-cover md:block md:w-1/2" />
    </>
  )
}
