import { cardHtml } from "./script.js";
import { appendAlert } from "./script.js";

const API_KEY = `AIzaSyBHUKm2KTSU4psulz-gU7Ji7M3bb6klt30`;
let copyInputVal = '';
let nextPage = '';
let query = localStorage.getItem('query');

function searchByQuery(inputVal) {
    $('#loading-msg').show();
    let url;

    if (inputVal) {
        url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${inputVal}&type=video&key=${API_KEY}`;
        copyInputVal = inputVal;
    } else {
        url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&pageToken=${nextPage}&q=${copyInputVal}&type=video&key=${API_KEY}`;
        console.log(`next page fun called`);
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
        console.log(`some error occured`);
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

window.addEventListener('scroll', function () {
    const scrollable = this.document.documentElement.scrollHeight - this.window.innerHeight;
    const scrolled = this.window.scrollY;

    if (Math.floor(scrollable) === Math.floor(scrolled)) {
        searchByQuery()
    }

});

$('#query-cards').on('click', '.card-data', function () {
    $('.modal-img').attr('src', $(this).data('src'));
    $('.video-link').attr('href', `https://youtu.be/${$(this).data('video')}`);
});