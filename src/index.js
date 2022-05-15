$(document).ready(() => {
    init();
})

const init = () => {
    $('#production-year-label').text($('#production-year').val());

    $('#add-date-label')
        .text(dateParser($('#add-date')
            .attr('min', 315532800000)
            .attr('max', new Date().getTime()).val()));

    $.getJSON('/assets/movies-mocks.json', function (movies) {
        for(const movie of movies) {
            $('#movies-list').append(movieFactory(movie))
        }
    })

    watchers();
}

const watchers = () => {
    $('#production-year').on('input', function() {
        $('#production-year-label').text($(this).val());
    })

    $('#add-date').on('input', function() {
        const date = dateParser($(this).val());
        $('#add-date-label').text(date);
    })
}

/**
 *
 * @param timestamp of date to parse
 * @returns {string} date in YYYY-MM-DD format
 */
const dateParser = (timestamp) => {
    if(typeof timestamp === 'string') timestamp = parseInt(timestamp);
    const date = new Date(timestamp);

    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth()}-${(date.getDate()) < 10 ? `0${date.getDate()}` : date.getDate()}`;
}

/**
 *
 * @param {{title: string, genre: string, productionCountry: string, productionYear: string, addDate: string, director: string}} movie
 */
const movieFactory = (movie) => {
    return `
        <div class="movie-info">
            <span class="movie-title">${movie.title || ''}</span>
            <div class="movie-description">
                <div class="key-value">
                    <span>
                        gatunek
                    </span>
                    <span>
                        ${movie.genre || ''}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        kraj produkcji
                    </span>
                    <span>
                        ${movie.productionCountry || ''}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        rok produkcji
                    </span>
                    <span>
                        ${movie.productionYear || ''}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        data dodania
                    </span>
                    <span>
                        ${movie.addDate || ''}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        reżyser
                    </span>
                    <span>
                        ${movie.director || ''}
                    </span>
                </div>
            </div>
        </div>`
}