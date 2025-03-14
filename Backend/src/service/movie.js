const Movie = require('../model/movie')
const mongoose = require("mongoose")

const createMovie = async(movieData)=>{
    try{
        const show = new Movie(movieData)
        await show.save()
        return show
    }catch(error){
        throw new Error("Error creating movie")
    }
}

const updateMovie = async(movieId, updatedData)=>{
    try {
        const movie = await Movie.findByIdAndUpdate(movieId, updatedData,{
            new: true,
            runValidators: true,
        })
        if(!movie) throw new Error("movie not found")
        return movie
    } catch (error) {
        throw new Error("Error updating movie")
    }
}

const deleteMovie = async(movieId)=>{
    try {
        const movie = await Movie.findByIdAndDelete(movieId)
        if(!movie) throw new Error("Movie not found")
        return movie
    } catch (error) {
        throw new Error("Error deleting movie")
    }
}

const getMovieByName = async (movieName) => {
    try {
        console.log("Searching for movie with name:", movieName); 

        const movie = await Movie.findOne({
            title: { $regex: new RegExp("^" + movieName + "$", "i") } 
        });

        console.log("MongoDB Query Result:", movie); 

        if (!movie) throw new Error("Movie not found");
        movie.availableSeats = movie.availableSeats || { premium: {}, regular: {}, recliner: {} };
        movie.bookedSeats = movie.bookedSeats || [];
        
        if(typeof(movie)===Array) return movie;
        else return [movie]
        
    } catch (error) {
        console.error("Error fetching movie:", error.message);
        throw new Error("Error fetching movie");
    }
};



const getMovies = async (query) => {
    try {
        const movie = await Movie.find(query)
        console.log("movie found:", movie)
        if(movie.length === 0){
            throw new Error("no movies found with the given criteria")
        } 
        return movie
    } catch (error) {
        console.error("Error fetching movies:", error)
        throw new Error("Error fetching movie:", +error.message)
    }
}
const bookSeat = async (movieName, seatCategory, row, seatNumber, userId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const movie = await Movie.findOne({ title: { $regex: new RegExp("^" + movieName + "$", "i") } }).session(session);
        if (!movie) {
            throw new Error("Movie not found");
        }

        if (!movie.availableSeats?.[seatCategory]?.[row]) {
            throw new Error(`Row "${row}" in category "${seatCategory}" not found`);
        }

        const seatPath = `availableSeats.${seatCategory}.${row}`;
        const bookedSeat = `${row}${seatNumber}`;

        const seatIndex = movie.availableSeats[seatCategory][row].indexOf(String(seatNumber));

        if (seatIndex === -1) {
            throw new Error(`Seat ${seatNumber} in row "${row}" is already booked or does not exist`);
        }

        movie.availableSeats[seatCategory][row].splice(seatIndex, 1);
        movie.bookedSeats.push(bookedSeat);

        await movie.save({ session });
        await session.commitTransaction(); 
        session.endSession();

        return { message: "Seat booked successfully", movie };
    } catch (error) {
        await session.abortTransaction(); 
        session.endSession();
        throw new Error(error.message);
    }
};

module.exports = {createMovie, updateMovie, deleteMovie, getMovieByName, getMovies, bookSeat}