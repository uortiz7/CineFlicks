document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '20eaf186fc938f42bde4e719c8ccfc03';
    const language = 'es-MX'; // Cambiado a español latinoamericano

    const genreIds = {
        'Action': 28,
        'Comedy': 35,
        'Drama': 18,
        'Horror': 27,
        'Romance': 10749
    };

    function fetchMoviesByGenre(genre, elementId) {
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreIds[genre]}&sort_by=popularity.desc&language=${language}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const carousel = document.getElementById(elementId);
                carousel.innerHTML = ''; // Limpiar resultados anteriores

                data.results.slice(0, 20).forEach(movie => {
                    const movieScroll = document.createElement('div');
                    movieScroll.classList.add('movie-scroll');
                    movieScroll.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                    `;
                    movieScroll.addEventListener('click', () => {
                        localStorage.setItem('movieData', JSON.stringify(movie));
                        window.location.href = 'info.html';
                    });
                    carousel.appendChild(movieScroll);
                });
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }
    
    if (window.innerWidth > 550) {
        let genreMovies = ["actionMovies", "comedyMovies", "horrorMovies", "dramaMovies", "romanceMovies"];

        // Crear botónes
        for (const genre of genreMovies) {
            const leftButton = document.createElement("button");
            const rightButton = document.createElement("button");

            leftButton.className = "carousel-btn left";
            rightButton.className = "carousel-btn right";
            
            // Asignar clase, id y contenido de texto
            leftButton.id = `${genre}-left`;
            rightButton.id = `${genre}-right`;

            leftButton.innerHTML = "&lt;"; // Esto agrega el símbolo "<" al botón
            rightButton.innerHTML = "&gt;"; // Esto agrega el símbolo ">" al botón
            
            // Insertarlo en el DOM (por ejemplo, en un contenedor específico)
            const container = document.getElementById(`${genre}-container`); // Contenedor específico para cada género
            container.appendChild(leftButton);
            container.appendChild(rightButton);

            console.log(container); // Agrega esto para verificar si el contenedor es encontrado
        }
        
        function setupCarouselScroll(carouselId, leftBtnId, rightBtnId) {
            const carousel = document.getElementById(carouselId);
            const leftBtn = document.getElementById(leftBtnId);
            const rightBtn = document.getElementById(rightBtnId);
            
            leftBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
            });
        }
        
        setupCarouselScroll('actionMovies', 'actionMovies-left', 'actionMovies-right');
        setupCarouselScroll('comedyMovies', 'comedyMovies-left', 'comedyMovies-right');
        setupCarouselScroll('dramaMovies', 'dramaMovies-left', 'dramaMovies-right');
        setupCarouselScroll('horrorMovies', 'horrorMovies-left', 'horrorMovies-right');
        setupCarouselScroll('romanceMovies', 'romanceMovies-left', 'romanceMovies-right');
    }
    
    fetchMoviesByGenre('Action', 'actionMovies');
    fetchMoviesByGenre('Comedy', 'comedyMovies');
    fetchMoviesByGenre('Drama', 'dramaMovies');
    fetchMoviesByGenre('Horror', 'horrorMovies');
    fetchMoviesByGenre('Romance', 'romanceMovies');

    document.getElementById('movieForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const movie = document.getElementById('movie').value;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie)}&language=${language}`;

        fetch(searchUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    // Almacenar los datos de la película en localStorage
                    localStorage.setItem('movieData', JSON.stringify(data.results[0]));
                    // Redirigir a result.html
                    window.location.href = 'info.html';
                } else {
                    alert('Película no encontrada.');
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
                alert('Error al obtener los datos');
            });
    });
});
