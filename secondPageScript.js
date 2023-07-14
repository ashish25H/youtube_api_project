import { cardHtml } from "./script.js";
import { appendAlert } from "./script.js";
import { scrollPage } from "./script.js";
import { START_STRING, END_STRING } from "./script.js";

let copyInputVal = '';
let nextPage = '';
let query = localStorage.getItem('query');

function searchByQuery(inputVal) {
    $('#loading-msg').show();
    let url;

    if (inputVal) {
        url = `${START_STRING}&q=${inputVal}${END_STRING}`;
        copyInputVal = inputVal;
    } else {
        url = `${START_STRING}&pageToken=${nextPage}&q=${copyInputVal}${END_STRING}`;
    }

    $('#input-text-2ndpage').val('');
    let card = '';

    $.get(url, function (data) {
        nextPage = data.nextPageToken;
        for (let item of data.items) {
            card += cardHtml(item.snippet.thumbnails?.high.url, item.id.videoId, item.snippet.title);
        }
        $('#loading-msg').hide();
        $('#query-cards').append(card);
    }).fail(function (err) {
        console.log(`some error occurred`);
        console.log(err);
    });
}

if (query) {
    searchByQuery(query);
    localStorage.setItem('query', '');
}

$('#submit-btn-2ndpage').click(function () {
    let input = $('#input-text-2ndpage').val();
    if (input) {
        $('#query-cards').empty();
        searchByQuery(input);
    } else {
        appendAlert('Please Enter a String', 'danger');
    }
});

scrollPage(searchByQuery);

$('#query-cards').on('click', '.card-data', function () {
    $('.modal-img').attr('src', $(this).data('src'));
    $('.video-link').attr('href', `https://youtu.be/${$(this).data('video')}`);
});