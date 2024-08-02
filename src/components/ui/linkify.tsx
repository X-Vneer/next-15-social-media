"use client"

import Link from "next/link"
import { LinkIt, LinkItUrl } from "react-linkify-it"

type Props = {
  children: React.ReactNode
}

export const LinkifyUserName = ({ children }: Props) => {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        return (
          <Link key={key} href={`/users/${match.slice(1)}`} className="text-primary hover:underline">
            {match}
          </Link>
        )
      }}>
      {children}
    </LinkIt>
  )
}
export const LinkifyHashtag = ({ children }: Props) => {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        return (
          <Link key={key} href={`/hashtag/${match.slice(1)}`} className="text-primary hover:underline">
            {match}
          </Link>
        )
      }}>
      {children}
    </LinkIt>
  )
}

export const Linkify = ({ children }: Props) => {
  return (
    <LinkifyHashtag>
      <LinkifyUserName>
        <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
      </LinkifyUserName>
    </LinkifyHashtag>
  )
}
