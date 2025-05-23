import type { FunctionComponent } from 'react'

interface IMovieCardProps {
  movie: IMovie
}

export const MovieCard: FunctionComponent<IMovieCardProps> = ({
  movie,
}: IMovieCardProps) => {
  const { title, vote_average, poster_path, release_date, original_language } =
    movie
  return (
    <div className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : '/no-movie.png'
        }
      />
      <div className="mt-4">
        <h2>{title}</h2>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
          </div>
          <span>|</span>
          <p className="lang">{original_language}</p>
          <span>|</span>
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}
