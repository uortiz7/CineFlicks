document.getElementById('movieForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const movie = document.getElementById('movie').value;
    const apiKey = '2d17ba1a'; // Sustituye 'TU_API_KEY' con tu clave API de OMDB
    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movie)}&apikey=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const movieResult = document.getElementById('movieResult');
            movieResult.innerHTML = ''; // Limpiar resultados anteriores
            if (data.Response === 'True') {
                const movieItem = document.createElement('div');
                movieItem.classList.add('movie-item');
                movieItem.innerHTML = `
                    <h2>${data.Title} (${data.Year})</h2>
                    <img src="${data.Poster}" alt="${data.Title}">
                    <p><strong>Género:</strong> ${data.Genre}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                    <p><strong>Actores:</strong> ${data.Actors}</p>
                    <p><strong>Trama:</strong> ${data.Plot}</p>
                    <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
                `;
                movieResult.appendChild(movieItem);
            } else {
                movieResult.innerHTML = '<p>Película no encontrada.</p>';
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
            document.getElementById('movieResult').innerHTML = '<p>Error al obtener los datos</p>';
        });
});
