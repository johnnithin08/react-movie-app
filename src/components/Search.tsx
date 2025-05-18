import type { FunctionComponent } from 'react'

interface ISearchProps {
  searchTerm: string
  setSearchTerm: (search: string) => void
}

export const Search: FunctionComponent<ISearchProps> = ({
  searchTerm,
  setSearchTerm,
}: ISearchProps) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
