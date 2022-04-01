window.onload = function () {
    let div = document.getElementById("slider");

    let html = "";

    const supported_animations = ['fade_in', 'zoom-in-zoom-out', 'radius', 'black-white']


    for (let currentSlide of slides_array) {

        if (supported_animations.includes(currentSlide.animation)) {

            html += `<div class="C-slide" style="background-image: url(${currentSlide.url})">
                         <div class="C-slide-title"> </div>
                      </div>
                  </div>`
        }

        else alert("unsupported animation " + currentSlide.animation)

    }


    div.innerHTML = html;



    const registeredCarousels = [];
    const carousels = document.querySelectorAll('.C-carousel');

    carousels.forEach((carousel, index) => {
        registeredCarousels.push({
            id: `C-carousel-${index}`,
            carousel: new Carousel(carousel, {
                vertical: true,
            }),
        })
    });
}
