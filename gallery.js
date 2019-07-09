// https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7f535fbe19213d16c74f0052e102d812&tags=flower&per_page=14&page=1&format=json

// Document ready
(function() {
    loadImages(28);

    // Get the modal for zooming in image
    var modal = document.getElementById("image-modal");
    var span = document.getElementsByClassName("close")[0];

    // Click span (x) or anywhere on modal to close
    span.onclick = function() {
        closeModal();
    }
    modal.onclick = function() {
        closeModal();
    }
})();

// Load images from Flickr API (json as a function, gets a list of pictures)
function jsonFlickrApi(rsp) {
    var imagesLoaded = 0,
    totalImages = rsp.photos.photo.length;
    window.rsp = rsp;

    // Photo source URLs: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
    for (var i=0; i < rsp.photos.photo.length; i++) {
        // Current picture
        pic = rsp.photos.photo[i];

        // URLs for displaying large square thumbnails and big size pictures
        t_url = "http://farm"+pic.farm+".static.flickr.com/"+pic.server+"/"+pic.id+"_"+pic.secret+"_"+"q.jpg";
        b_url = "http://farm"+pic.farm+".static.flickr.com/"+pic.server+"/"+pic.id+"_"+pic.secret+"_"+"b.jpg";

        // Create and set attributes to elements
        var link = document.createElement("a");
        link.setAttribute('class', "image-link hide");

        var img = document.createElement("img");
        img.setAttribute('src', t_url);
        img.setAttribute('alt', pic.title);
        img.setAttribute('data-b-src', b_url); // link to big size image
        img.setAttribute('class', "thumbnail");

        // Open images in modal
        img.onclick = function() {
            bigSrc = this.getAttribute('data-b-src');
            alt = this.getAttribute('alt');
            initModal(bigSrc, alt);
        }
        // When error occurs during loading, subtract 1 from totalImages
        img.onerror = function() {
            totalImages--;
            showImages(imagesLoaded, totalImages);
        }
        // When an image is loaded, add 1 to imagesLoaded
        img.onload = function() {
            imagesLoaded++;
            showImages(imagesLoaded, totalImages);
        }

        // Add img to image-link, append to gallery container (id="root")
        link.appendChild(img);
        document.getElementById('root').appendChild(link);
    }
}

// Show images when all are loaded
function showImages(imagesLoaded, totalImages) {
    // If last image is loaded
    if (imagesLoaded == totalImages) {
        // Show image-links
        var imgLinks = document.getElementsByClassName('image-link');
        for (var i = 0; i < imgLinks.length; i++) {
            imgLinks[i].classList.remove('hide');
        }
        // Hide loader
        document.getElementById('root').classList.remove("loading");
    }
}

function loadImages(numberOfImagesToShow = 14) {
    var nextPage = window.rsp != undefined ? window.rsp.photos.page + 1 : 1;
    console.log("nextPage: " + nextPage);

    var tag = "flower";
    var f_url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7f535fbe19213d16c74f0052e102d812&tags="+ tag +"&per_page="+
    numberOfImagesToShow + "&page="+ nextPage +"&format=json&nojsoncallback=?";

    document.getElementById('message').classList.add('hide');

    // AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if(this.status == 200) {
                jsonFlickrApi(JSON.parse(this.responseText));
            }
            else {
                var msg = ""
                switch(this.status) {
                    case 404:
                    msg = 'File not found';
                    break;
                    case 500:
                    msg = 'Server error';
                    break;
                    case 0:
                    msg = 'Request aborted';
                    break;
                    default:
                    msg = 'Unknown error ' + status;
                }

                // Hide loader on error, show message
                document.getElementById('root').classList.remove("loading");
                document.getElementById('message').classList.remove('hide');
                document.getElementById('message').innerHTML = msg;
            }
        }
    };
    document.getElementById('root').classList.add("loading");
    xhttp.open("POST", f_url, true);
    xhttp.send();
}

// Infinite scroll
var scrollerContainer = document.getElementById('scroller');

// Detect when scrolled to bottom
scrollerContainer.addEventListener('scroll', function() {
  if (scrollerContainer.scrollTop + scrollerContainer.clientHeight >= scrollerContainer.scrollHeight) {
      var scrollTag = "";
      loadImages(14);
  }
});


// Modal functions
function initModal(src, caption) {
    document.getElementById("modal-img").src = src;
    document.getElementById("caption").innerHTML = caption;
    showModal();
}
function showModal() {
    document.getElementById("image-modal").style.display = "block";
    document.getElementsByTagName('body')[0].classList.add('modal-is-open');
}
function closeModal() {
    var modal = document.getElementById("image-modal");
    modal.style.display = "none";
    document.getElementsByTagName('body')[0].classList.remove('modal-is-open');
    document.getElementById("modal-img").src = "";
}


// Show/hide (navigation) links when clicking on Hamburger Menu
function openNavigation() {
    var navigation = document.getElementById('navigation');

    // Toggle navigation
    if(navigation.classList.contains('hide-nav')) {
        navigation.classList.remove('hide-nav');
    }
    else {
        navigation.classList.add('hide-nav');
    }
}
