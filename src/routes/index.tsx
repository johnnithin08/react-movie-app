import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'react-use'

import { Search } from '@/components/Search'
import { MovieCard } from '@/components/MovieCard'
import { Spinner } from '@/components/Spinner'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const API_BASE_URL = 'https://api.themoviedb.org/3'

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('')

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 300, [searchTerm])

  const { data, isFetching, error, refetch } = useQuery<IMovieResponse>({
    queryKey: ['movies'],
    queryFn: async () => {
      const endpoint = debouncedSearchTerm
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(debouncedSearchTerm)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      console.log('sea', searchTerm, endpoint)
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { Authorization: `Bearer ${API_KEY}` },
      })
      const responseJson = await response.json()
      console.log('resp', responseJson)
      return responseJson
    },
  })

  useEffect(() => {
    refetch()
  }, [debouncedSearchTerm])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {data &&
                data.results.map((eachMovie, eachindex) => {
                  return (
                    <li key={eachMovie.id}>
                      <p>{eachindex + 1}</p>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${eachMovie.poster_path}`}
                        alt={eachMovie.title}
                      />
                    </li>
                  )
                })}
            </ul>
          </section>
          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>
            {isFetching ? (
              <Spinner />
            ) : error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              <ul>
                {data &&
                  data.results.map((eachMovie) => {
                    return <MovieCard key={eachMovie.id} movie={eachMovie} />
                  })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/')({
  component: App,
})
