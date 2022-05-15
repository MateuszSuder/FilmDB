import {watchers} from "./slider.js";
import {dateParser} from "./utils.js";

$(document).ready(() => {
    init();
})

const init = () => {
    const productionSlider = $( "#production-year-slider" );
    const addDateSlider = $( "#add-date-slider" );
    $( "#production-year" ).text(productionSlider.slider( "values", 0 ) +
        " - " + productionSlider.slider( "values", 1 ) );
    $( "#add-date" ).text(dateParser(addDateSlider.slider( "values", 0 )) +
        " - " + dateParser(addDateSlider.slider( "values", 1 )));

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