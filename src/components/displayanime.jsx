import { useState, useEffect } from "react";

const DisplayAnime = () => {
    const [query, setQuery] = useState(""); // Stores user input
    const [animeList, setAnimeList] = useState([]); // Full anime data
    const [filteredAnime, setFilteredAnime] = useState([]); // Search results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch anime data when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://myanimelist.p.rapidapi.com/anime/top/all?p=1", {
                    method: "GET",
                    headers: {
                        "X-Rapidapi-Key": "6f3f7b41bemsh63a072b8ff1a9a5p199a7ajsnaddb6ec59508",
                        "X-Rapidapi-Host": "myanimelist.p.rapidapi.com",
                    },
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setAnimeList(data); // Store full anime list
                setFilteredAnime(data); // Initially display all anime
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handles input change but does NOT filter immediately
    const handleChange = (e) => {
        setQuery(e.target.value); // Just updates the query state
    };

    // Filters when button is clicked
    const handleSearch = () => {
        const searchQuery = query.toLowerCase(); // Convert input to lowercase

        // Filter anime titles based on search query
        const filtered = animeList.filter((anime) =>
            anime.title.toLowerCase().includes(searchQuery)
        );

        setFilteredAnime(filtered); // Updates displayed results
    };

    return (
        <div className="search-container">
            <h1>Anime Popular</h1>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search anime..."
                value={query}
                onChange={handleChange} // Only updates state
            />
            <button onClick={handleSearch}>🔍 Search</button>

            {/* Display Results */}
            <div className="anime-grid">
                {loading ? (
                    <p>Loading anime...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : filteredAnime.length > 0 ? (
                    filteredAnime.map((anime, index) => (
                        <div key={index} className="anime-card">
                            <img src={anime.picture_url || "https://via.placeholder.com/150"} alt={anime.title} />
                            <div className="anime-info">
                                <h3>{anime.title}</h3>
                                <p>⭐ {anime.score || "N/A"}</p>
                                <p>📅 {anime.aired_on || "Unknown"}</p>
                                <p>🎥 {anime.type || "Unknown"}</p>
                                <a href={anime.myanimelist_url} target="_blank" rel="noopener noreferrer">
                                    View on MyAnimeList
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No anime found!</p>
                )}
            </div>
        </div>
    );
};

export default DisplayAnime;