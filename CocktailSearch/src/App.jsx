import React, { useState } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCocktail, setSelectedCocktail] = useState(null);  

  const mapQuery = (input) => {
    const queryMap = {
      'cocktail': 'alc',
      'mocktail': 'nalc',
      'recommend': 'optalc'
    };
    return queryMap[input.toLowerCase()] || input; 
  };

  const handleSearch = async () => {
    if (!query) return;

    const transformedQuery = mapQuery(query);

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3000/api/search?query=${transformedQuery}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result || []);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectCocktail = (cocktail) => {
    setSelectedCocktail(cocktail);
  };

  const handleCloseModal = () => {
    setSelectedCocktail(null);
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-overlay') {
      handleCloseModal();
    }
  };

  const getIngredients = (cocktail) => {
    if (Array.isArray(cocktail.ingredients)) {
      return cocktail.ingredients;
    }
    return cocktail.ingredients ? cocktail.ingredients.split(',') : [];
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://media.gettyimages.com/id/1269922836/video/free-stage-with-blur-colorful-lights.jpg?s=640x640&k=20&c=9XIx580aMC4erxXCg4_go11GiC7Ly2PAsdfL47L0aWI=)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Blur Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
          backdropFilter: 'blur(8px)',           // Blurs only the background
          zIndex: 0,
        }}
      />

      {/* Page Content */}
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 relative z-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          🍹 Search Cocktail Here!
        </h1>

        {/* Search Bar */}
        <div className="flex items-center space-x-3 mb-6">
          <input
            type="text"
            placeholder="Input your query here..."
            className="w-full px-5 py-3 text-lg border rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className={`px-6 py-3 text-lg font-medium text-white rounded-lg transition duration-300 ${loading
              ? 'bg-indigo-300'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300'
              }`}
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-5 transition transform hover:scale-105 cursor-pointer"
                onClick={() => handleSelectCocktail(entry)}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                  {entry.strDrink || 'No title'}
                </h2>
                <p className="text-center text-gray-600 mb-4">
                  {entry.strAlcoholic || 'No description'}
                </p>
                <img
                  src={entry.strDrinkThumb || 'https://via.placeholder.com/150'}
                  alt={entry.strDrink}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-center text-gray-500 text-lg">
                No results found.
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedCocktail && (
        <div
          id="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          onClick={handleClickOutside} 
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-fit h-fit overflow-auto flex">
            <div className="w-1/3 flex justify-center items-center">
              <img
                src={selectedCocktail.strDrinkThumb || 'https://via.placeholder.com/150'}
                alt={selectedCocktail.strDrink}
                className="object-contain max-h-80"  
              />
            </div>
            <div className="w-2/3 pl-6">
              <h2 className="text-3xl font-semibold text-center mb-4">{selectedCocktail.strDrink}</h2>
              <p className="text-lg text-gray-700 mb-4"><strong>Category:</strong> {selectedCocktail.strCategory}  |  {selectedCocktail.strGlass}</p>
              <p className="text-lg text-gray-700 mb-4"><strong>IBA:</strong> {selectedCocktail.strIBA}</p>
              <p className="text-lg text-gray-700 mb-4"><strong>Alcoholic:</strong> {selectedCocktail.strAlcoholic}</p>
              <p className="text-lg text-gray-700 mb-4"><strong>Ingredients:</strong></p>
              <ul className="list-disc pl-5 mb-4">
                {getIngredients(selectedCocktail).map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
              <p className="text-lg text-gray-700"><strong>Instructions:</strong> {selectedCocktail.strInstructions}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
