document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slider__slide');
    const dots = document.querySelectorAll('.slider__dot');

    if (slides.length > 0 && dots.length > 0) {
        let currentIndex = 0;
        const intervalTime = 4000;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('slider__slide--active'));
            dots.forEach(dot => dot.classList.remove('slider__dot--active'));
            slides[index].classList.add('slider__slide--active');
            dots[index].classList.add('slider__dot--active');
            
            currentIndex = index;
        }

        function nextSlide() {
            let nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        }

        let slideInterval = setInterval(nextSlide, intervalTime);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(i);
                slideInterval = setInterval(nextSlide, intervalTime);
            });
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');

            if (body.classList.contains('dark-theme')) {
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }
});