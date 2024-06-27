document.addEventListener('DOMContentLoaded', function() {
    const movieData = JSON.parse(localStorage.getItem('movieData'));
    const movieResult = document.getElementById('movieResult');
    const apiKey = '20eaf186fc938f42bde4e719c8ccfc03'; // Clave API de TMDB
    const language = 'es-MX'; // Cambiado a español latinoamericano

    function displayMovie(data) {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');

        // Actualizar el título del HTML
        document.title = `CineFlicks - ${data.title}`;

        // Crear el elemento h2
        const movieTitle = document.createElement('h2');
        movieTitle.classList.add('movie-title');
        movieTitle.innerText = `${data.title} (${data.release_date.split('-')[0]})`;

        // Crear el div contenedor para la imagen
        const movieImage = document.createElement('div');
        movieImage.classList.add('movie-image');
        movieImage.innerHTML = `<img src="https://image.tmdb.org/t/p/w200${data.poster_path}" alt="${data.title}">`;
        
        const movieP = document.createElement('div');
        movieP.classList.add('movie-p');
        movieP.innerHTML = `
            <p><strong>Género:</strong> ${data.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Director:</strong> ${data.credits.crew.find(person => person.job === 'Director').name}</p>
            <p><strong>Actores:</strong> ${data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')}</p>
            <p><strong>Trama:</strong> ${data.overview}</p>
            <p><strong>Rating TMDB:</strong> ${data.vote_average} / 10 ⭐</p>
        `;

        // Crear el div contenedor para los párrafos
        const movieDetails = document.createElement('div');
        movieDetails.classList.add('movie-details');
        movieDetails.appendChild(movieP);

        // Agregar el h2, la imagen y el div de detalles al elemento movieItem
        movieItem.appendChild(movieImage);
        movieItem.appendChild(movieDetails);

        // Agregar el título y el elemento movieItem al contenedor movieResult
        movieResult.appendChild(movieTitle);
        movieResult.appendChild(movieItem);
    }

    if (movieData) {
        const movieUrl = `https://api.themoviedb.org/3/movie/${movieData.id}?api_key=${apiKey}&append_to_response=credits&language=${language}`;
        fetch(movieUrl)
            .then(response => response.json())
            .then(data => displayMovie(data))
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                movieResult.innerHTML = '<p>Error al obtener los datos</p>';
            });
    } else {
        movieResult.innerHTML = '<p>No se encontraron datos de la película.</p>';
    }

    document.getElementById('movieForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const movie = document.getElementById('movie').value;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie)}&language=${language}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    // Limpiar resultados anteriores
                    movieResult.innerHTML = '';
                    const movieId = data.results[0].id;
                    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits&language=${language}`;
                    fetch(movieUrl)
                        .then(response => response.json())
                        .then(data => {
                            // Mostrar nueva película
                            displayMovie(data);
                            // Almacenar los datos de la película en localStorage
                            localStorage.setItem('movieData', JSON.stringify(data));
                        });
                } else {
                    alert('Película no encontrada.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                movieResult.innerHTML = '<p>Error al obtener los datos</p>';
            });
    });
});
