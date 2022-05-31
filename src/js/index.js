import { dateParser } from './utils.js';
import { slidersHandlers } from './slider.js';

// Run when document is loaded
$(function () {
	slidersHandlers();
	init();
});

// Initialization function
const init = () => {
	// Get sliders
	const productionSlider = $('#production-year-slider');
	const addDateSlider = $('#add-date-slider');
	// Set basic values to sliders
	$('#production-year').text(
		productionSlider.slider('values', 0) +
			' - ' +
			productionSlider.slider('values', 1),
	);

	// Get add-date element
	const addDateElement = $('#add-date');

	// Show slider value in add-date element
	addDateElement.text(
		dateParser(addDateSlider.slider('values', 0)) +
			' - ' +
			dateParser(addDateSlider.slider('values', 1)),
	);

	buttonsHandlers();
	menuHandler();
	favoriteHandler();
	actorsHandler();
};

const actorsHandler = () => {
	$('#add-actor').on('click', function () {
		const actorInput = $('#actor-input');
		const actor = actorInput.val();
		$('#add-movie-actors-list').append(
			`<div><input type='text' name='actorsList[]' value='${actor}' maxlength='24' minlength='3' required /><span class='actor-delete'>usuń...</span></div>`,
		);
		actorInput.val('');
	});

	$('#add-movie-actors-list').on('click', '.actor-delete', function () {
		$(this).parent().remove();
	});
};

const favoriteHandler = () => {
	$('.fav')
		.hover(function () {
			$(this).toggleClass('favorite not-favorite');
		})
		.on('click', function () {
			const movieId = $(this).data('movie-id');
			$.ajax({
				url: '/dashboard/favorite',
				method: 'PUT',
				contentType: 'application/json',
				data: JSON.stringify({
					movieId,
				}),
			}).done((d) => {
				$(this).toggleClass('favorite not-favorite');
			});
		});
};

const buttonsHandlers = () => {
	$('#logo, #login-button').on('click', function () {
		switch ($(this).attr('name')) {
			case 'login-button':
				location.assign('/login');
				break;
			case 'menu-button':
				$('#user-menu').toggleClass('d-none');
				break;
			default:
				location.assign('/');
				break;
		}
	});

	$('#movie-modify').on('click', function () {
		location.assign(`/add-movie/${$(this).data('movie-id')}`);
	});

	$('#search-container').on('click', function (event) {
		$('#search-modal-container').removeClass('d-none');
		event.stopPropagation();
	});

	$('#search-mask, #exit').on('click', function (event) {
		$('#search-modal-container').addClass('d-none');
		event.stopPropagation();
	});

	const closeModal = () => {
		$('#modal-mask').addClass('d-none');
	};

	$('.user-action-button').on('click', function () {
		const id = $(this).data('user-id');
		const username = $(this).data('user-username');
		const permission = $(this).data('user-permission');
		const blocked = $(this).data('user-blocked');
		switch ($(this).data('action')) {
			case 'modify':
				openModalHandler(
					`<b>${username}</b>: ${
						permission === 'user' ? 'user' : 'admin'
					} → ${permission === 'user' ? 'admin' : 'user'}`,
					`Czy chcesz zmienić prawa użytkownika <b>${username}</b> z <b>${
						permission === 'user' ? 'user' : 'admin'
					}</b> na <b>${
						permission === 'user' ? 'admin' : 'user'
					}</b>?`,
					() => closeModal(),
					() =>
						$.ajax({
							url: '/dashboard/permission',
							method: 'PUT',
							data: {
								id,
								permission:
									permission === 'user' ? 'admin' : 'user',
							},
						}).done(() => {
							closeModal();
							location.reload();
						}),
				);
				break;
			case 'delete':
				openModalHandler(
					`Usuń&nbsp<b>${username}</b>`,
					`Czy chcesz usunąć użytkownika <b>${username}</b>?`,
					() => closeModal(),
					() =>
						$.ajax({
							url: '/dashboard/delete',
							method: 'DELETE',
							data: {
								id,
							},
						}).done(() => {
							closeModal();
							location.reload();
						}),
				);
				break;
			case 'block':
				openModalHandler(
					`${
						blocked ? 'Odblokuj' : 'Zablokuj'
					} użytkownika&nbsp<b>${username}</b>`,
					`Czy chcesz ${
						blocked ? 'odblokować' : 'zablokować'
					} użytkownika <b>${username}</b>?`,
					() => closeModal(),
					() =>
						$.ajax({
							url: '/dashboard/block',
							method: 'PUT',
							data: {
								id,
								blocked: blocked === 0 ? 1 : 0,
							},
						}).done(() => {
							closeModal();
							location.reload();
						}),
				);
		}
	});
};

function menuHandler() {
	$('#user-menu > .user-menu-item').on('click', function () {
		/**
		 * @type {'favorites' | 'add-movie' | 'dashboard' | 'logout'}
		 */
		const action = $(this).attr('name');
		switch (action) {
			case 'favorites':
				location.assign('/favorites');
				break;
			case 'add-movie':
				location.assign('/add-movie');
				break;
			case 'dashboard':
				location.assign('/dashboard');
				break;
			case 'favorites':
				location.assign('/favorites');
				break;
			case 'logout':
				$.ajax({ url: '/logout', method: 'POST' }).done(function () {
					location.assign('/');
				});
		}
	});
}

/**
 *
 * @param {string} header text shown in modals header
 * @param {string} body text shown in modals body
 * @param {function} leftAction left button action
 * @param {function} rightAction right button action
 */
function openModalHandler(header, body, leftAction, rightAction) {
	const modal = $('#modal-mask');

	modal.removeClass('d-none').find('#modal-header').html(header);
	modal.find('#modal-body').html(body);
	modal
		.find('#modal-left-button')
		.off()
		.on('click', function () {
			leftAction();
		});
	modal
		.find('#modal-right-button')
		.off()
		.on('click', function () {
			rightAction();
		});
}
