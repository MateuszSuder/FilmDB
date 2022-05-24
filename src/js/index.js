import { dateParser } from "./utils.js";
import { slidersHandlers } from './slider.js'

// Run when document is loaded
$(document).ready(() => {
	slidersHandlers()
	init();
});

// Initialization function
const init = () => {
	// Get sliders
	const productionSlider = $("#production-year-slider");
	const addDateSlider = $("#add-date-slider");
	// Set basic values to sliders
	$("#production-year").text(
		productionSlider.slider("values", 0) +
			" - " +
			productionSlider.slider("values", 1)
	);

	// Get add-date element
	const addDateElement = $("#add-date");

	// Show slider value in add-date element
	addDateElement.text(
		dateParser(addDateSlider.slider("values", 0)) +
			" - " +
			dateParser(addDateSlider.slider("values", 1))
	);

	$.getJSON("/public/assets/movies-mocks.json", function (movies) {
		for (const movie of movies) {
			$("#movies-list").append(movieFactory(movie));
		}
	});

	buttonsHandlers();
	menuHandler();
};

const buttonsHandlers = () => {
	$("#logo, #login-button").click(function () {
		switch ($(this).attr("name")) {
			case "logo-button":
				location.replace("/");
				break;
			case "login-button":
				location.replace("/login");
				break;
			case "menu-button":
				$('#user-menu').toggleClass('d-none');
				break;
			default:
				location.replace("/");
				break;
		}
	});

	$("#search-container").click(function (event) {
		$("#search-modal-container").removeClass("d-none");
		event.stopPropagation();
	});

	$("#search-mask, #exit").click(function (event) {
		$("#search-modal-container").addClass("d-none");
		event.stopPropagation();
	});
};

function menuHandler() {
	$('#user-menu > .user-menu-item').click(function() {
		/**
		 *
		 * @type {'favorites' | 'add-movie' | 'dashboard' | 'logout'}
		 */
		const action = $(this).attr('name');
		switch (action) {
			case 'favorites':
				location.replace('/favorites');
				break;
			case 'add-movie':
				location.replace('/add-movie');
				break;
			case 'dashboard':
				location.replace('/dashboard');
				break;
			case 'logout':
				$.ajax({ url: '/logout', method: 'POST'})
					.done(function() {
						location.replace('/')
					})
		}
	})
}

/**
 *
 * @param {{title: string, genre: string, productionCountry: string, productionYear: string, addDate: string, director: string}} movie
 */
const movieFactory = (movie) => {
	return `
        <div class="movie-info">
            <span class="header-primary movie-title">${movie.title || ""}</span>
            <div class="movie-description">
                <div class="key-value">
                    <span>
                        gatunek
                    </span>
                    <span>
                        ${movie.genre || ""}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        kraj produkcji
                    </span>
                    <span>
                        ${movie.productionCountry || ""}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        rok produkcji
                    </span>
                    <span>
                        ${movie.productionYear || ""}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        data dodania
                    </span>
                    <span>
                        ${movie.addDate || ""}
                    </span>
                </div>
                <div class="key-value">
                    <span>
                        reżyser
                    </span>
                    <span>
                        ${movie.director || ""}
                    </span>
                </div>
            </div>
        </div>`;
};
