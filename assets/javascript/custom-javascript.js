
/* -------------------- Browser Zoom Setting -------------------- */

window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) {
        e.preventDefault();
    }
},
{
    passive: false
});

//window.addEventListener('keydown', function (e) {
//    if (e.ctrlKey) {
//        if (['+', '-', '=', '0', 'numpadAdd', 'numpadSubtract', 'numpad0'].includes(e.key) ||
//            e.keyCode === 187 || e.keyCode === 189 || e.keyCode === 48) {
//            e.preventDefault();
//        }
//    }
//});

/* -------------------- Cursor Setting -------------------- */

const cursorDefault = new MouseFollower({
    skewing: 1,
    speed: 0.5,
    visible: false,
});

const targets = document.querySelectorAll('[data-cursor]');

targets.forEach(target => {
    target.addEventListener('mouseenter', () => {
        cursorDefault.show();
    });

    target.addEventListener('mouseleave', () => {
        cursorDefault.hide();
    });
});

/* -------------------- Custom Split Text Setting -------------------- */

document.addEventListener("DOMContentLoaded", () => {

    // Split Text

    document.querySelectorAll(".text-mask-reveal").forEach((el) => {
        const start = el.dataset.start || "top 75%";
        const splitText = SplitText.create(el, {
            type: "words,lines",
            linesClass: "line",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => {
                gsap.set(self.lines, { yPercent: 100 });
                ScrollTrigger.create({
                    trigger: el,
                    start: start,
                    markers: false,
                    onEnter: () => {
                        gsap.to(self.lines, {
                            duration: 1.5,
                            yPercent: 0,
                            stagger: 0.065,
                            ease: "expo.out",
                        });
                    },
                });
            }
        });
    });

    // Splitting Text - Title

    document.querySelectorAll('.text-title').forEach(title => {

        const textSpan = title.querySelector('.text');

        if (textSpan) {
            const text = textSpan.textContent.trim();
            let charSpans = '';

            text.split('').forEach(char => {
                charSpans += `<span>${char}</span>`;
            });

            textSpan.innerHTML = `
                        <span>${charSpans}</span>
                    `;
        }
    });

    $('.text-title-special').each(function () {
        const $textSpan = $(this).find('.text');

        $textSpan.each(function () {
            const $this = $(this);
            const text = $.trim($this.text());
            let charSpans = '';

            text.split('').forEach(function (char) {
                if (char === ' ') {
                    charSpans += `<span class="char space"> </span>`;
                    return;
                }

                let extrudeSpans = '';
                for (let i = 0; i < 20; i++) {
                    extrudeSpans += `<span>${char}</span>`;
                }

                charSpans += `
                        <span class ="char">
                            <span class ="overlap">${char}</span>
                            <span class ="base">${char}</span>
                            <span class ="extrude">
                                ${extrudeSpans}
                            </span>
                        </span>
                        `;
            });

            $this.html(charSpans);
        });
    });

    // Splitting Text - Link - Navbar

    document.querySelectorAll('.link-default').forEach(link => {

        const textSpan = link.querySelector('.text');

        if (textSpan) {
            const text = textSpan.textContent.trim();
            let charSpans = '';

            text.split('').forEach(char => {
                charSpans += `<span>${char}</span>`;
            });

            textSpan.innerHTML = `
                        <span>${charSpans}</span>
                        <span>${charSpans}</span>
                    `;
        }
    });

    // Splitting Text - Button

    // document.querySelectorAll('.btn').forEach(btn => {

    //     const textSpan = btn.querySelector('.text');

    //     if (textSpan) {
    //         const text = textSpan.textContent.trim();
    //         let charSpans = '';

    //         text.split('').forEach(char => {
    //             charSpans += `<span>${char}</span>`;
    //         });

    //         textSpan.innerHTML = `
    //                     <span>${charSpans}</span>
    //                     <span>${charSpans}</span>
    //                 `;
    //     }
    // });
});

/* -------------------- Navbar Setting -------------------- */

$(window).scroll(function () {
    $(".navbar").toggleClass("scroll", $(this).scrollTop() > 1)
    $("#scroll-top").toggleClass("scroll", $(this).scrollTop() > 1)
});

/* -------------------- Compare Image Viewer Setting -------------------- */

document.querySelectorAll(".compareImage").forEach((element) => {
    new ImageCompare(element).mount();
});

/* -------------------- Flickty Setting -------------------- */

document.querySelectorAll('.carousel-parallax').forEach(function (carouselElem) {
    var flkty = new Flickity(carouselElem, {
        imagesLoaded: true,
        percentPosition: false,
        freeScroll: true,
        contain: true,
        prevNextButtons: false,
        pageDots: false
    });

    var imgs = carouselElem.querySelectorAll('.carousel-cell img');
    var docStyle = document.documentElement.style;
    var transformProp = typeof docStyle.transform === 'string' ? 'transform' : 'WebkitTransform';

    flkty.on('scroll', function () {
        flkty.slides.forEach(function (slide, i) {
            var img = imgs[i];
            if (img) {
                var x = (slide.target + flkty.x) * -1 / 5;
                img.style[transformProp] = 'translateX(' + x + 'px)';
            }
        });
    });
});

$('.carousel-single').flickity({
    draggable: false,
});

$('.carousel-triple').flickity({
    draggable: true,
    contain: true,
    wrapAround: true,
});

/* -------------------- Other Setting -------------------- */

document.addEventListener('DOMContentLoaded', function () {
    function updateVisibility() {
        const isRecurring = document.getElementById('radioCreateClass-Frequency-2').checked;

        document.getElementById('dvDateRange-Calendar').style.display = isRecurring ? 'block' : 'none';
        document.getElementById('dvDateRange-Day').style.display = isRecurring ? 'block' : 'none';
        document.getElementById('dvDateSingle-Calendar').style.display = isRecurring ? 'none' : 'block';
    }

    document.querySelectorAll('input[name="radioCreateClass-Frequency"]').forEach(radio => {
        radio.addEventListener('change', updateVisibility);
    });

    updateVisibility();
});