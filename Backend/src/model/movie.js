const mongoose = require('../config/database');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  posterURL: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String, required: true },
  cast: [{ type: String }],
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: Number, required: true },
  language: { type: String, required: true },

  theatres: [
    {
      name: { type: String, required: true }, 
      location: { type: String, required: true }, 
      showTimes: [
        {
          time: { type: String, required: true },
          availableSeats: {
            premium: { rowA: [{ type: String }], rowB: [{ type: String }] },
            regular: { rowC: [{ type: String }], rowD: [{ type: String }], rowE: [{ type: String }] },
            recliner: { rowF: [{ type: String }] }
          },
          bookedSeats: {
            premium: { rowA: [{ type: String }], rowB: [{ type: String }] },
            regular: { rowC: [{ type: String }], rowD: [{ type: String }], rowE: [{ type: String }] },
            recliner: { rowF: [{ type: String }] }
          }
        }
      ]
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
