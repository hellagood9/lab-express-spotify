require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render("artists", { artist: data.body.artists.items, host: process.env.HOST });  
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    res.render("albums", { albums: data.body.items })
  })
  .catch(err => {
    console.log("The error while searching albums occurred: ", err);
  });
});

app.get("/tracks/:id", (req, res) => {
  spotifyApi
  .getAlbumTracks(req.params.id)
  .then(data => {
    
    res.render("tracks", { tracks: data.body.items })
  })
  .catch(err => {
    console.log("The error while searching albums occurred: ", err);
  });
});


app.listen(3000, () =>
  console.log(
    "My Spotify project running on port 3000 🎧 🥁 🎸 🔊"
  )
);
