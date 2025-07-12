
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

/* -------------------- File Uploader Setting -------------------- */

document.addEventListener("DOMContentLoaded", function () {
    if (window.File && window.FileList && window.FileReader) {
        const fileInput = document.getElementById("files");

        fileInput.addEventListener("change", function (e) {
            const files = e.target.files;

            for (let i = 0; i < files.length; i++) {
                const f = files[i];
                const reader = new FileReader();

                reader.onload = function (e) {
                    const span = document.createElement("span");
                    span.className = "preview";

                    const img = document.createElement("img");
                    img.className = "imageThumb";
                    img.src = e.target.result;
                    img.title = f.name;

                    const btn = document.createElement("span");
                    btn.className = "remove";
                    btn.textContent = "Remove image";

                    btn.addEventListener("click", function () {
                        span.remove();
                        if (document.querySelectorAll(".box-preview .preview").length === 0) {
                            document.querySelector(".box-placeholder").classList.remove("hidden");
                        }
                    });

                    span.appendChild(img);
                    span.appendChild(btn);

                    document.querySelector(".box-preview").appendChild(span);
                    document.querySelector(".box-placeholder").classList.add("hidden");
                };

                reader.readAsDataURL(f);
            }
            fileInput.value = "";
        });
    }
    else {
        alert("Your browser doesn't support the File API");
    }
});
