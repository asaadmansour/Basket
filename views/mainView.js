class MainView {
    constructor() {
        this.sliderContainer = document.querySelector('.posters');
        this.slides = document.querySelectorAll('.poster');
        this.currentSlideIndex = 0; // Start at the second slide for better visual
        this.autoSlide = null;
        this.prevButton = document.querySelector('.fa-arrow-left');
        this.nextButton = document.querySelector('.fa-arrow-right');

        this.initSlider();
    }
    
    initSlider() {
        this.updateActiveSlide();
        this.startAutoSlide();

        this.prevButton?.addEventListener('click', () => {
            this.stopAutoSlide(); 
            this.moveToPreviousSlide();
        });

        this.nextButton?.addEventListener('click', () => {
            this.stopAutoSlide(); 
            this.moveToNextSlide();
        });

        this.sliderContainer?.addEventListener('mouseover', () => this.stopAutoSlide());
        this.sliderContainer?.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    startAutoSlide() {
        this.autoSlide = setInterval(() => {
            this.moveToNextSlide();
        }, 5000);
    }
    
    stopAutoSlide() {
        clearInterval(this.autoSlide);
    }
    
    moveToNextSlide() {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
        this.updateActiveSlide();
    }

    moveToPreviousSlide() {
        this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
        this.updateActiveSlide();
    }

    updateActiveSlide() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlideIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
}
export default new MainView();
