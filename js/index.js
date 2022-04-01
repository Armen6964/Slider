window.onload = function () {
    let div = document.getElementById("slider");

    let html = "";

    for (let i = 0; i < slides.length; i++) {
        html += `<div class="C-slide">
                   <div class="C-slide-title"> </div>
                   <img src="${slides[i].url}" style="animation-name: ${slides[i].animation}; animation-duration: ${slides[i].animation_duration}s">
                </div>
            </div>`
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
