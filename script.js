"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     MOBILE / TABLET NAVIGATION
     ========================================================= */

  const navToggle = document.querySelector(".nav-toggle");
  const navPanel = document.getElementById(
    "vitaslimex-navbarSupportedContent"
  );

  if (navToggle && navPanel) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

      navPanel.classList.remove("is-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen =
        navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Open navigation"
          : "Close navigation"
      );

      navPanel.classList.toggle(
        "is-open",
        !isOpen
      );
    });

    navPanel
      .querySelectorAll('a[href^="#"]')
      .forEach((link) => {
        link.addEventListener(
          "click",
          closeMenu
        );
      });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) {
        closeMenu();
      }
    });
  }


  /* =========================================================
     FAQ ACCORDION
     ========================================================= */

  document
    .querySelectorAll(".faq-question")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const answerId =
          button.getAttribute("aria-controls");

        const answer =
          document.getElementById(answerId);

        if (!answer) {
          return;
        }

        const isOpen =
          button.getAttribute("aria-expanded") === "true";

        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );

        answer.hidden = isOpen;
      });
    });


  /* =========================================================
     VITASLIMEX CUSTOMER IMAGE MARQUEE

     768px and above:
     CSS shows 5 images.

     Below 768px:
     CSS shows 3 images.

     Images move continuously.
     No stop between images.
     Smooth infinite autoplay.
     ========================================================= */

  const reviewCarousel =
    document.querySelector(
      ".review-photo-carousel"
    );

  const reviewTrack =
    reviewCarousel?.querySelector(
      ".review-photo-track"
    );

  if (reviewCarousel && reviewTrack) {
    /* =======================================================
       REMOVE OLD CLONES IF SCRIPT RUNS AGAIN
       ======================================================= */

    reviewTrack
      .querySelectorAll(
        '[data-review-clone="true"]'
      )
      .forEach((clone) => {
        clone.remove();
      });


    /* =======================================================
       GET ORIGINAL 10 IMAGES
       ======================================================= */

    const originalSlides =
      Array.from(
        reviewTrack.querySelectorAll(
          ":scope > .review-photo"
        )
      );

    if (originalSlides.length > 1) {
      let marqueeAnimationFrame = null;
      let marqueeLastTime = null;
      let marqueePosition = 0;
      let marqueeLoopDistance = 0;
      let resizeTimer = null;


      /* =====================================================
         DUPLICATE ALL ORIGINAL PHOTOS
         ===================================================== */

      originalSlides.forEach((slide) => {
        const clone =
          slide.cloneNode(true);

        clone.setAttribute(
          "data-review-clone",
          "true"
        );

        clone.setAttribute(
          "aria-hidden",
          "true"
        );

        clone
          .querySelectorAll("img")
          .forEach((image) => {
            image.setAttribute(
              "alt",
              ""
            );
          });

        reviewTrack.appendChild(
          clone
        );
      });


      /* =====================================================
         MARQUEE SPEED

         25 = slow
         36 = recommended
         45 = faster
         55 = fast
         ===================================================== */

      const requestedSpeed =
        Number.parseFloat(
          reviewCarousel.dataset.marqueeSpeed
        );

      const marqueeSpeed =
        Number.isFinite(requestedSpeed) &&
        requestedSpeed > 0
          ? requestedSpeed
          : 36;


      /* =====================================================
         CALCULATE EXACT LOOP DISTANCE
         ===================================================== */

      const measureMarquee = () => {
        const firstOriginal =
          originalSlides[0];

        const firstClone =
          reviewTrack.querySelector(
            '[data-review-clone="true"]'
          );

        if (
          !firstOriginal ||
          !firstClone
        ) {
          return;
        }

        marqueeLoopDistance =
          firstClone.offsetLeft -
          firstOriginal.offsetLeft;

        if (
          marqueeLoopDistance > 0
        ) {
          marqueePosition =
            marqueePosition %
            marqueeLoopDistance;
        }

        reviewTrack.style.transition =
          "none";

        reviewTrack.style.transform =
          `translate3d(${-marqueePosition}px, 0, 0)`;
      };


      /* =====================================================
         CONTINUOUS SMOOTH AUTOPLAY
         ===================================================== */

      const moveMarquee = (
        currentTime
      ) => {
        if (
          marqueeLastTime === null
        ) {
          marqueeLastTime =
            currentTime;
        }

        const deltaTime =
          Math.min(
            currentTime -
            marqueeLastTime,
            50
          );

        marqueeLastTime =
          currentTime;


        if (
          marqueeLoopDistance > 0 &&
          !document.hidden
        ) {
          marqueePosition +=
            marqueeSpeed *
            (
              deltaTime /
              1000
            );


          /* Seamless infinite loop */
          if (
            marqueePosition >=
            marqueeLoopDistance
          ) {
            marqueePosition -=
              marqueeLoopDistance;
          }


          reviewTrack.style.transform =
            `translate3d(${-marqueePosition}px, 0, 0)`;
        }


        marqueeAnimationFrame =
          window.requestAnimationFrame(
            moveMarquee
          );
      };


      /* =====================================================
         RESPONSIVE RESIZE
         ===================================================== */

      window.addEventListener(
        "resize",
        () => {
          window.clearTimeout(
            resizeTimer
          );

          resizeTimer =
            window.setTimeout(() => {
              measureMarquee();
            }, 100);
        }
      );


      /* =====================================================
         RECALCULATE AFTER IMAGE LOAD
         ===================================================== */

      reviewTrack
        .querySelectorAll("img")
        .forEach((image) => {
          if (!image.complete) {
            image.addEventListener(
              "load",
              measureMarquee,
              {
                once: true
              }
            );
          }
        });


      /* =====================================================
         TAB VISIBILITY
         ===================================================== */

      document.addEventListener(
        "visibilitychange",
        () => {
          marqueeLastTime =
            performance.now();

          if (
            !document.hidden
          ) {
            measureMarquee();
          }
        }
      );


      /* =====================================================
         START
         ===================================================== */

      reviewTrack.style.transition =
        "none";

      measureMarquee();

      window.addEventListener(
        "load",
        measureMarquee
      );

      marqueeAnimationFrame =
        window.requestAnimationFrame(
          moveMarquee
        );
    }
  }
});