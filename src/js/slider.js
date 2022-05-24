import {dateParser} from "./utils.js";

export const slidersHandlers = function() {
    // Create slider
    $( "#production-year-slider" ).slider({
        range: true,
        min: 1980,
        max: 2025,
        values: [ 1980, 2025 ],
        slide: function( event, ui ) {
            $( "#production-year" ).text(ui.values[ 0 ] + " - " + ui.values[ 1 ] );
        }
    });

    // Timestamps
    // 2020-01-01
    const minDate = 1577836800000;

    // Today
    const maxDate = new Date().getTime()

    // Create slider
    $( "#add-date-slider" ).slider({
        range: true,
        min: minDate,
        max: maxDate,
        values: [ minDate, maxDate ],
        slide: function( event, ui ) {
            $( "#add-date" ).text(dateParser(ui.values[ 0 ]) + " - " + dateParser(ui.values[ 1 ]) );
        }
    });
};