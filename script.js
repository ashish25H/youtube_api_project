const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
const API_KEY = `AIzaSyD16YbHRdrvgBkdyuWkPbqez5KLDVYZQoI`;
const toastLiveExample = document.getElementById('liveToast');

let isLoading = false;
let nextPage = '';
let queryNextPage = '';
let flag = false;
let copyInputVal = '';

const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

function cardHtml(thumbnail, videoId, title) {
    return `<div class="card g-col-4" style="width: 18rem;">
    <img src="${thumbnail}" class="card-img-top" alt="thumbnail">
    <div class="card-body" >
        <h5 class="card-title card-data" data-bs-toggle="modal" data-bs-target="#exampleModal" data-src=${thumbnail} data-video=${videoId}>
        ${title}</h5>          
    </div>
  </div>`
}

function loadItems() {
    if (isLoading) return;

    // isLoading = true;
    $('#loading-msg').show();

    url = nextPage ? `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&pageToken=${nextPage}&type=video&key=${API_KEY}`
        : `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&type=video&key=${API_KEY}`;

    $.get(url, function (data, status) {
        nextPage = data.nextPageToken;
        let card = '';
        for (let item of data.items) {
            card += cardHtml(item.snippet.thumbnails?.high.url, item.id.videoId, item.snippet.title);
        }
        // isLoading = false;
        $('#loading-msg').hide();
        $('#cards').append(card);
    }).fail(function(err) {
        console.log(`some error occured`);
        console.log(err);
    });
}
// loadItems();

$('form').submit(function (event) {
    event.preventDefault();
});

function searchByQuery() {
    $('#loading-msg').show();
    let inputVal = $('#input-text').val();
    let url;

    if (inputVal) {
        url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${inputVal}&type=video&key=${API_KEY}`;
        copyInputVal = inputVal;
    } else if (queryNextPage) {
        url = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&pageToken=${queryNextPage}&q=${copyInputVal}&type=video&key=${API_KEY}`;
    } else {
        appendAlert('Please Enter a String', 'danger');
        loadItems();
        return;
    }

    flag = true;
    $('#input-text').val('');
    let card = '';

    $.get(url, function (data, status) {
        queryNextPage = data.nextPageToken;
        for (let item of data.items) {
            card += cardHtml(item.snippet.thumbnails?.high.url, item.id.videoId, item.snippet.title);
        }
        $('#loading-msg').hide();
        $('#cards').append(card);
    }).fail(function(err) {
        console.log(`some error occured`);
        console.log(err);
    });
}

$('#submit-btn').click(function () {
    $('#cards').empty();
    searchByQuery();
});

window.addEventListener('scroll', function () {
    const scrollable = this.document.documentElement.scrollHeight - this.window.innerHeight;
    const scrolled = this.window.scrollY;

    if (Math.floor(scrollable) === Math.floor(scrolled)) {
        // if (flag) {
        //     searchByQuery();
        // } else {
        //     loadItems();
        // }
         
        flag ? searchByQuery() : loadItems();
    }

});


$('#cards').on('click', '.card-data', function () {
    $('.modal-img').attr('src', $(this).data('src'));
    $('.video-link').attr('href', `https://youtu.be/${$(this).data('video')}`);
});

loadItems();
























