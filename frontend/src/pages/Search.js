import React, {useState} from 'react'
import useSearch from '../hooks/controller'
import '../style/search.css'

function Search() {
    const {SearchTheatre, SearchMovie} = useSearch()
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchingForMovie, setIsSearchingForMovie] = useState(false);
    const [isSearchingForTheatre, setIsSearchingForTheatre] = useState(false);

    const handleTheatreSearch = () => {
        if (searchQuery.trim() === '') {
            alert("Enter a theatre name to search!");
            return;
        }
        SearchTheatre({ theatreName: searchQuery });
    };
    
    const handleMovieSearch = async () => { 
        if (searchQuery.trim() === '') {
            alert("Enter a movie name to search!");
            return;
        }
        const movieData = await SearchMovie({ title: searchQuery });
    
        if (movieData?.theatres?.length > 0) {
            SearchTheatre({ theatreName: movieData.theatres[0].name }); 
        }
    };
    
    const handleSearch = async () => {
        if (isSearchingForMovie) {  
            await handleMovieSearch(); 
        } else if (isSearchingForTheatre) {  
            handleTheatreSearch();
        } else {  
            await handleMovieSearch(); 
            if (isSearchingForTheatre) {
                handleTheatreSearch(); 
            }
        }
    };
    
    
  return (
    <div className='search-container'>
        <h2>Search for Theatre or Movie</h2>
        <input type='text' placeholder='Enter movie name' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}/>
        <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default Search
