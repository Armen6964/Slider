class Carousel {
  constructor (el, options = {}) {
    const DEFAULTS = {
      infinite: true,
      slideSelector: '.C-slide',
      initialSlideIndex: 0,
      vertical: false,
    };
    this.carousel = el;
    this.settings = {
      ...DEFAULTS,
      ...options,
    };

    this.slides = document.querySelectorAll(
      this.settings.slideSelector
    );

    this.state = {
      currentSlide: this.settings.initialSlideIndex,
    };

    this.track = null;
    this.navigation = null;
    this.navigationButtons = [];

    // Init
    this.init();
  }

  setState(newState, callback = () => undefined) {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.updateCarousel();
    return callback();
  }

  getSettings = () => {
    return this.settings;
  }

  reInitWithOptions = (options = {}) => {
    this.carousel.classList.remove('initialized');
    this.track.classList.add('C-track--reinit');
    this.settings = {
      ...this.getSettings(),
      ...options,
    };

    this.init();
    this.onResizeActions();
    this.track.classList.remove('C-track--reinit');
  };


  init() {

    const {
      carousel,
      slides,
    } = this;

    const {
      vertical,
    } = this.settings;

    carousel.classList.remove('C-carousel--vertical');
    carousel.classList.remove('C-carousel--horizontal');

    if (vertical) {
      carousel.classList.add('C-carousel--vertical');
    } else {
      carousel.classList.add('C-carousel--horizontal');
      slides.forEach(slide => {
        slide.style.float = 'left';
      });
    }

    this.onInitActions();

    window.addEventListener('resize', () => {
      setTimeout(() => { this.onResizeActions(); }, 100);
    });

  }

  onInitActions() {
    this.createSlideTrack();
    this.createNavigation();
    this.createNavigationButtons();
    this.updateCarousel();
    this.carousel.classList.add('initialized');
  }

  onResizeActions() {
    this.setSlideTrackDimensions();
  }

  createSlideTrack() {
    const {
      slides,
      carousel,
      track,
    } = this;

    // Do not re-create track if it exists
    if (!track) {
      const track = document.createElement('div');
      track.classList.add('C-track');

      slides.forEach(slide => {
        track.appendChild(slide);
      });

      carousel.appendChild(track);
      this.track = track;
    }
    this.setSlideTrackDimensions();
  }

  setSlideTrackDimensions() {

    const {
      track,
      slides,
    } = this;

    slides.forEach(slide => {
      slide.style.transition = 'none';
    });
    const numberOfSlides = slides.length;

    if (!track) { return; }

    const {
      vertical,
    } = this.settings;

    const height = [...slides].reduce((acc, slide) => (
      acc + slide.offsetHeight
    ), 0);
    const width = [...slides].reduce((acc, slide) => (
      acc + slide.offsetWidth
    ), 0);

    track.style.transition = 'none';

    if (!!vertical) {
      track.style.width = width / numberOfSlides + 'px';
      track.style.height = height + 'px';
    } else {
      track.style.width = width + 'px';
      track.style.height = height / numberOfSlides + 'px';
    }

    track.style.transition = '';
    slides.forEach(slide => {
      slide.style.transition = '';
    });
  }

  updateTrackPosition() {
    const {
      slides,
      track,
    } = this;

    const numberOfSlides = slides.length;
    const basePercentage = 100 / numberOfSlides;

    const {
      vertical,
    } = this.settings;

    const {
      currentSlide,
    } = this.state;

    const translateValue = !!vertical
      ? `translateY(-${basePercentage * currentSlide}%)`
      : `translateX(-${basePercentage * currentSlide}%)`

    track.style.transform = translateValue;
  }

  createNavigation() {
    const {
      slides,
      carousel,
      navigation,
    } = this;

    if (!navigation) {
      const navigationContainer = document.createElement('div');
      navigationContainer.classList.add('C-navigation');

      [...slides].forEach((slide, index) => {
        navigationContainer.appendChild(this.createNavigationDot(index));
      });

      carousel.appendChild(navigationContainer);
      this.navigation = navigationContainer;
    }
  }

  createNavigationDot(index) {
    const { currentSlide } = this.state;
    const navigationDot = document.createElement('div');

    navigationDot.classList.add('C-navigation__dot');
    navigationDot.setAttribute('data-slideIndex', index);
    navigationDot.addEventListener('click', () => {
      this.goTo(index);
    });

    return navigationDot;
  }




  createNavigationButtons() {
    const createNavigationButton = (buttonType) => {
      const { carousel } = this;
      const navigationButton = document.createElement('button');

      navigationButton.setAttribute('type', 'button');
      navigationButton.classList.add('C-carousel-navigation-button');
      navigationButton.classList.add(`C-carousel-navigation-button--${buttonType}`);

      navigationButton.addEventListener('click', () => {
        const { slides } = this;
        const { currentSlide } = this.state;
        const numberOfSLides = slides.length;
        const lastSlideIndex = numberOfSLides - 1;

        if (buttonType === 'next') {
          const slideToGo = currentSlide + 1;

          if (slideToGo > lastSlideIndex) {
            if (!!this.settings.infinite) {
              return this.goTo(0);
            }
            return;
          } else {
            this.goTo(slideToGo);
          }

        } else {
          const slideToGo = currentSlide - 1;

          if (slideToGo < 0) {
            if (!!this.settings.infinite) {
              return this.goTo(lastSlideIndex);
            }
            return;
          } else {
            this.goTo(slideToGo);
          }
        }
      });



      navigationButton.textContent = buttonType;
      carousel.appendChild(navigationButton);
      this.navigationButtons.push(navigationButton);




    }

    $("div").on('wheel', (e) => {
      const { slides } = this;
      const { currentSlide } = this.state;
      const numberOfSLides = slides.length;
      const lastSlideIndex = numberOfSLides - 1;

      if (e.originalEvent.deltaY < 0) {
        const slideToGo = currentSlide + 1;

        if (slideToGo > lastSlideIndex) {
          if (!!this.settings.infinite) {
            return this.goTo(0);
          }
          return;
        } else {
          this.goTo(slideToGo);
        }

      } else {
        const slideToGo = currentSlide - 1;

        if (slideToGo < 0) {
          if (!!this.settings.infinite) {
            return this.goTo(lastSlideIndex);
          }
          return;
        } else {
          this.goTo(slideToGo);
        }
      }

    });
    if (this.navigationButtons.length <= 0) {
      createNavigationButton('next');
      createNavigationButton('prev');
    }
  }



  updateNavigation() {
    const {
      navigation,
    } = this;

    const {
      currentSlide,
    } = this.state;

    const navigationDots = navigation.querySelectorAll('.C-navigation__dot');

    navigationDots.forEach(dot => {
      const dotIndex = parseInt(dot.getAttribute('data-slideIndex'), 10);

      if (dotIndex === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  updateSlides() {
    const {
      slides,
    } = this;

    const {
      currentSlide,
    } = this.state;

    slides.forEach((slide, index) => {
      if (index === currentSlide) {

        slide.classList.add('active')
        if(slide.classList.contains('active'))
        {
          slide.style.animationName = slides_array[index].animation;
          slide.style.animationDuration = slides_array[index].animation_duration + "s";
        }

      } else {
        slide.classList.remove('active');
        slide.style.animationName = null;
          slide.style.animationDuration = null;
      }
    });
  }

  goTo = (index) => {
    this.setState({
      currentSlide: index,
    }, () => {
      //console.log('Current slide is now: ', this.state.currentSlide);
    });
  }

  updateCarousel() {
    this.updateTrackPosition();
    this.updateNavigation();
    this.updateSlides();
  }

}

