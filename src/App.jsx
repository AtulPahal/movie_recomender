import { useState } from 'react'
import Select from 'react-select'
import data from './movies_data.json'
import './index.css'

function App() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  const movies = data.movie_list
  const recMap = data.recommendations
  const API_KEY = data.api_key

  // Prepare options for react-select
  const options = movies.map(m => ({ value: m.title, label: m.title }))

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: state.isFocused ? '#e50914' : '#333',
      color: 'white',
      padding: '5px',
      boxShadow: state.isFocused ? '0 0 0 1px #e50914' : 'none',
      ':hover': {
        borderColor: '#e50914'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1f1f1f',
      border: '1px solid #333',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#e50914'
        : state.isFocused
          ? 'rgba(255, 255, 255, 0.1)'
          : 'transparent',
      color: 'white',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#e50914'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white'
    }),
    input: (provided) => ({
      ...provided,
      color: 'white'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#b3b3b3'
    })
  }

  const fetchPosters = async (recs) => {
    const promises = recs.map(async (movie) => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${movie.movie_id}?api_key=${API_KEY}&language=en-US`
        const response = await fetch(url)
        const movieData = await response.json()
        const posterPath = movieData.poster_path
        return {
          ...movie,
          poster_url: posterPath ? `https://image.tmdb.org/t/p/w500/${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Poster'
        }
      } catch (error) {
        console.error("Error fetching poster:", error)
        return {
          ...movie,
          poster_url: 'https://via.placeholder.com/500x750?text=Error'
        }
      }
    })
    return Promise.all(promises)
  }

  const handleRecommend = async () => {
    if (!selectedOption) return

    setLoading(true)
    const rawRecs = recMap[selectedOption.value] || []
    const recsWithPosters = await fetchPosters(rawRecs)
    setRecommendations(recsWithPosters)
    setLoading(false)
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="header">
          <h1>Movie Recommender</h1>
          <p>Discover your next favorite film</p>
        </header>

        <main>
          <div className="selection-area">
            <div style={{ flex: 1, minWidth: '300px' }}>
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                styles={customStyles}
                placeholder="Type to search movies..."
                isClearable
                className="movie-select-container"
              />
            </div>

            <button
              onClick={handleRecommend}
              className="recommend-btn"
              disabled={!selectedOption || loading}
            >
              {loading ? 'Finding Gems...' : 'Recommend'}
            </button>
          </div>

          <div className="results-grid">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="movie-card">
                <div className="poster-wrapper">
                  <img src={rec.poster_url} alt={rec.title} />
                </div>
                <div className="movie-info">
                  <h3>{rec.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {recommendations.length === 0 && !loading && selectedOption && (
            <div className="placeholder-text">
              Hit "Recommend" to see results!
            </div>
          )}
        </main>
      </div>
      <div className="background-overlay"></div>
    </div>
  )
}

export default App
