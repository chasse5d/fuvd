document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slider__slide');
    const dots = document.querySelectorAll('.slider__dot');
    
    if (!slides.length || !dots.length) return;

    let current = 0;
    const intervalTime = 4000;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('slider__slide--active'));
        dots.forEach(dot => dot.classList.remove('slider__dot--active'));
        
        slides[index].classList.add('slider__slide--active');
        dots[index].classList.add('slider__dot--active');
        current = index;
    }

    function nextSlide() {
        showSlide((current + 1) % slides.length);
    }

    let autoplay = setInterval(nextSlide, intervalTime);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(autoplay);
            showSlide(i);
            autoplay = setInterval(nextSlide, intervalTime);
        });
    });
});