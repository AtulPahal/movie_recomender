import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Select from 'react-select'
import data from './movies_data.json'
import './index.css'

// Modal Component
function MovieModal({ movie, onClose, isLiked, onToggleLike }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${data.api_key}&language=en-US`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const movieData = await response.json()
        setDetails(movieData)
      } catch (err) {
        console.error("Error fetching movie details:", err)
        setError(err.message || 'Failed to load movie details')
      }
      setLoading(false)
    }
    fetchDetails()
  }, [movie.movie_id])

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const tmdbUrl = details?.id 
    ? `https://www.themoviedb.org/movie/${details.id}` 
    : `https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}`

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <button className="modal-close" onClick={onClose}>×</button>
      
      {loading ? (
        <div className="modal-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="modal-content">
          <div className="modal-error">
            <h3>⚠ Error</h3>
            <p>{error}</p>
            <button className="modal-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <div className="modal-content">
          <div className="modal-poster">
            <img 
              src={movie.poster_url} 
              alt={movie.title} 
            />
          </div>
          
          <div className="modal-details">
            <h2 className="modal-title">{movie.title}</h2>
            
            <div className="modal-meta">
              {details?.release_date && (
                <span className="modal-meta-item">
                  <strong>Release:</strong> {details.release_date.split('-')[0]}
                </span>
              )}
              {details?.runtime && (
                <span className="modal-meta-item">
                  <strong>Runtime:</strong> {details.runtime} min
                </span>
              )}
              {details?.vote_average && (
                <span className="modal-rating">
                  {details.vote_average.toFixed(1)} / 10
                </span>
              )}
              {details?.genres && details.genres.length > 0 && (
                <span className="modal-meta-item">
                  <strong>Genres:</strong> {details.genres.map(g => g.name).join(', ')}
                </span>
              )}
            </div>

            {details?.overview && (
              <div className="modal-overview">
                <h4>Overview</h4>
                <p>{details.overview}</p>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className={`modal-btn modal-btn-like ${isLiked ? 'liked' : ''}`}
                onClick={() => onToggleLike(movie.movie_id)}
              >
                {isLiked ? '♥ Liked' : '♡ Add to Likes'}
              </button>
              
              <a 
                href={tmdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn-link"
              >
                View on TMDB →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [likedMovies, setLikedMovies] = useState(() => {
    try {
      const saved = localStorage.getItem('likedMovies')
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error parsing likedMovies from localStorage:', error)
      return []
    }
  })

  const movies = data.movie_list
  const recMap = data.recommendations
  const API_KEY = data.api_key

  // Save liked movies to localStorage
  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies))
  }, [likedMovies])

  // Filter movies based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return movies
    const query = searchQuery.toLowerCase()
    return movies.filter(m => m.title.toLowerCase().includes(query))
  }, [searchQuery, movies])

  // Prepare options for react-select
  const options = filteredOptions.map(m => ({ 
    value: m.title, 
    label: m.title 
  }))

  // Custom styles matching RawBlock design
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f0f0f0',
      borderColor: state.isFocused ? '#000000' : '#000000',
      borderWidth: state.isFocused ? '5px' : '3px',
      borderRadius: '0px',
      boxShadow: 'none',
      minHeight: '44px',
      '&:hover': {
        borderColor: '#000000'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#ffffff',
      border: '3px solid #000000',
      borderRadius: '0px',
      marginTop: '4px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#000000' 
        : state.isFocused 
          ? '#e8e8e8' 
          : 'transparent',
      color: state.isSelected ? '#ffffff' : '#000000',
      cursor: 'pointer',
      padding: '12px',
      fontFamily: "'Work Sans', sans-serif",
      borderRadius: '0px',
      '&:active': {
        backgroundColor: state.isSelected ? '#000000' : '#e8e8e8'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#000000',
      fontFamily: "'Work Sans', sans-serif"
    }),
    input: (provided) => ({
      ...provided,
      color: '#000000',
      fontFamily: "'Work Sans', sans-serif"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999',
      fontFamily: "'Space Mono', monospace",
      fontSize: '15px'
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      color: '#666666'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#666666'
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#666666',
      cursor: 'pointer'
    })
  }

  // Track request to prevent race conditions using ref
  const requestIdRef = useRef(0)

  const fetchPosters = async (recs) => {
    const currentRequestId = requestIdRef.current
    
    const promises = recs.map(async (movie) => {
      // Check if this request is still valid (prevents race conditions)
      if (requestIdRef.current !== currentRequestId) {
        return null
      }
      try {
        const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${API_KEY}&language=en-US`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const movieData = await response.json()
        const posterPath = movieData.poster_path
        return {
          ...movie,
          poster_url: posterPath 
            ? `https://image.tmdb.org/t/p/w500/${posterPath}` 
            : 'https://via.placeholder.com/500x750?text=No+Poster'
        }
      } catch (error) {
        console.error("Error fetching poster:", error)
        return {
          ...movie,
          poster_url: 'https://via.placeholder.com/500x750?text=Error'
        }
      }
    })
    const results = await Promise.all(promises)
    // Filter out null results (cancelled requests)
    return results.filter(Boolean)
  }

  const handleRecommend = useCallback(async () => {
    if (!selectedOption) return

    // Increment request ID to cancel any pending requests
    requestIdRef.current += 1
    const currentRequestId = requestIdRef.current
    
    setLoading(true)
    setError(null) // Clear any previous errors
    
    const rawRecs = recMap[selectedOption.value] || []
    
    if (rawRecs.length === 0) {
      setRecommendations([])
      setLoading(false)
      return
    }
    
    const recsWithPosters = await fetchPosters(rawRecs)
    
    // Only update state if this is still the current request
    if (requestIdRef.current === currentRequestId) {
      setRecommendations(recsWithPosters)
      setLoading(false)
    }
  }, [selectedOption, recMap])



  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null)
  }, [])

  const handleToggleLike = (movieId) => {
    setLikedMovies(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId)
      } else {
        return [...prev, movieId]
      }
    })
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <header className="header">
          <h1>Movie<br/>Recommender</h1>
          <p>// FIND YOUR NEXT FAVORITE FILM</p>
        </header>

        {/* Search Section */}
        <div className="search-section">
          <div className="selection-area">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Select
                value={selectedOption}
                onChange={(option) => {
                  setSelectedOption(option)
                  if (option) setSearchQuery(option.label)
                }}
                onInputChange={(inputValue) => setSearchQuery(inputValue)}
                options={options}
                styles={customStyles}
                placeholder="SEARCH FOR A MOVIE..."
                isClearable
                className="movie-select-container"
                classNamePrefix="react-select"
                filterOption={(option, input) => {
                  if (!input) return true
                  return option.label.toLowerCase().includes(input.toLowerCase())
                }}
                // Attach keyboard handler to the input
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && selectedOption) {
                    handleRecommend()
                  }
                }}
              />
            </div>

            <button
              onClick={handleRecommend}
              className="recommend-btn"
              disabled={!selectedOption || loading}
            >
              {loading ? 'FINDING...' : 'RECOMMEND'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <section className="results-section">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <span className="loading-text">Finding movies...</span>
            </div>
          )}

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠</div>
              <h3>Error</h3>
              <p>{error}</p>
              <button className="recommend-btn" onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          {!loading && !error && recommendations.length > 0 && (
            <>
              <div className="section-header">
                <h2 className="section-title">Recommended</h2>
                <span className="results-count">{recommendations.length} // MOVIES FOUND</span>
              </div>
              
              <div className="results-grid">
                {recommendations.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="movie-card"
                    onClick={() => handleMovieClick(rec)}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="poster-wrapper">
                      <img src={rec.poster_url} alt={rec.title} loading="lazy" />
                    </div>
                    <div className="movie-info">
                      <h3>{rec.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && recommendations.length === 0 && selectedOption && (
            <div className="empty-state">
              <div className="empty-state-icon">▶</div>
              <h3>Ready to Discover</h3>
              <p>Press "RECOMMEND" to get your personalized movie list</p>
            </div>
          )}
          
          {!loading && !selectedOption && (
            <div className="empty-state">
              <div className="empty-state-icon">◼</div>
              <h3>Start Here</h3>
              <p>Search for a movie above to receive recommendations</p>
            </div>
          )}
        </section>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={handleCloseModal}
          isLiked={likedMovies.includes(selectedMovie.movie_id)}
          onToggleLike={handleToggleLike}
        />
      )}
    </div>
  )
}

export default App