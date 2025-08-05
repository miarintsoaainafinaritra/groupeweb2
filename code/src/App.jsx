import { useState, useEffect } from 'react'
import { Search, Star, Heart, Zap, Shield, Sword, Sun, Moon } from 'lucide-react'
import pokeballIcon from './assets/pokemon.png'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState([])
  const [filteredPokemon, setFilteredPokemon] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
 
  const [favorites, setFavorites] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)

 
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  
  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
        const data = await response.json()
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url)
            const detail = await detailResponse.json()
            return {
              id: detail.id,
              name: detail.name,
              image: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default,
              types: detail.types.map(type => type.type.name),
              height: detail.height,
              weight: detail.weight,
              stats: detail.stats,
              abilities: detail.abilities.map(ability => ability.ability.name)
            }
          })
        )
        
        setPokemon(pokemonDetails)
        setFilteredPokemon(pokemonDetails)
        
      } catch (error) {
        console.error('Error fetching Pokemon:', error)
     
      }
    }

    fetchPokemon()
  }, [])

  
  useEffect(() => {
    const filtered = pokemon.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredPokemon(filtered)
  }, [searchTerm, pokemon])

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev => 
      prev.includes(pokemonId) 
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    )
  }

  const getTypeColor = (type) => {
    const colors = {
      normal: 'type-normal',
      fire: 'type-fire',
      water: 'type-water',
      electric: 'type-electric',
      grass: 'type-grass',
      ice: 'type-ice',
      fighting: 'type-fighting',
      poison: 'type-poison',
      ground: 'type-ground',
      flying: 'type-flying',
      psychic: 'type-psychic',
      bug: 'type-bug',
      rock: 'type-rock',
      ghost: 'type-ghost',
      dragon: 'type-dragon',
      dark: 'type-dark',
      steel: 'type-steel',
      fairy: 'type-fairy'
    }
    return colors[type] || 'type-normal'
  }

  const getStatIcon = (statName) => {
    switch(statName) {
      case 'hp': return <Heart size={16} />
      case 'attack': return <Sword size={16} />
      case 'defense': return <Shield size={16} />
      case 'speed': return <Zap size={16} />
      default: return <Star size={16} />
    }
  }

 

  return (
    <div className={`app-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-logo">
            <img src={pokeballIcon} alt="Pokeball" className="logo-image" />
            <h1 className="app-title">Pokemon Explorer</h1>
          </div>
          <div className="header-controls">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search Pokemon or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <span className="pokemon-count">
              {filteredPokemon.length} Pokemon
            </span>
          </div>
        </div>
      </header>

      <div className="main-content">
        {selectedPokemon ? (
          /* Pokemon Detail View */
          <div className="pokemon-detail-container">
            <button 
              onClick={() => setSelectedPokemon(null)}
              className="back-button"
            >
              ← Back to List
            </button>
            
            <div className="pokemon-detail-card">
              <div className="detail-header">
                <div className="detail-title">
                  <h2 className="pokemon-name">{selectedPokemon.name}</h2>
                  <button
                    onClick={() => toggleFavorite(selectedPokemon.id)}
                    className="favorite-button"
                  >
                    <Heart 
                      size={24}
                      className={favorites.includes(selectedPokemon.id) ? 'favorite-active' : ''} 
                    />
                  </button>
                </div>
                <div className="type-container">
                  {selectedPokemon.types.map(type => (
                    <span key={type} className={`type-badge ${getTypeColor(type)}`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="detail-content">
                <div className="pokemon-image-section">
                  <img 
                    src={selectedPokemon.image} 
                    alt={selectedPokemon.name}
                    className="detail-image"
                  />
                  <div className="pokemon-stats">
                    <div className="stat-item">
                      <p className="stat-label">Height</p>
                      <p className="stat-value">{selectedPokemon.height / 10} m</p>
                    </div>
                    <div className="stat-item">
                      <p className="stat-label">Weight</p>
                      <p className="stat-value">{selectedPokemon.weight / 10} kg</p>
                    </div>
                  </div>
                </div>
                
                <div className="pokemon-info">
                  <h3 className="section-title">Stats</h3>
                  <div className="stats-container">
                    {selectedPokemon.stats.map(stat => (
                      <div key={stat.stat.name} className="stat-row">
                        {getStatIcon(stat.stat.name)}
                        <span className="stat-name">{stat.stat.name}</span>
                        <div className="stat-bar">
                          <div 
                            className="stat-bar-fill"
                            style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                          />
                        </div>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="section-title">Abilities</h3>
                  <div className="abilities-container">
                    {selectedPokemon.abilities.map(ability => (
                      <span key={ability} className="ability-badge">
                        {ability.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
        
          <div className="pokemon-grid">
            {filteredPokemon.map(p => (
              <div 
                key={p.id} 
                className="pokemon-card"
                onClick={() => setSelectedPokemon(p)}
              >
                <div className="card-header">
                  <span className="pokemon-number">
                    #{p.id.toString().padStart(3, '0')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(p.id)
                    }}
                    className="favorite-button"
                  >
                    <Heart 
                      size={16}
                      className={favorites.includes(p.id) ? 'favorite-active' : ''} 
                    />
                  </button>
                </div>
                <div className="card-content">
                  <img 
                    src={p.image} 
                    alt={p.name}
                    className="pokemon-image"
                  />
                  <h3 className="pokemon-name">{p.name}</h3>
                  <div className="type-container">
                    {p.types.map(type => (
                      <span key={type} className={`type-badge ${getTypeColor(type)}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`app-footer ${isDarkMode ? 'dark-footer' : 'light-footer'}`}>
        <div className="footer-content">
          <p>Pokemon Explorer © {new Date().getFullYear()}</p>
          
          <div className="footer-links">
            <a href="/about">About</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App;
