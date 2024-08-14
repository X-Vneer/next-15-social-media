import { Metadata } from "next"

import SearchResults from "./search-results"

interface PageProps {
  searchParams: { q: string }
}

export function generateMetadata({ searchParams: { q } }: PageProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  }
}

export default function Page({ searchParams: { q } }: PageProps) {
  return (
    <>
      <div className="rounded-2xl bg-card p-5 shadow-sm">
        <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
          Search results for &quot;{q}&quot;
        </h1>
      </div>
      <SearchResults query={q} />
    </>
  )
}
