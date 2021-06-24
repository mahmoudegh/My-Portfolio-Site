/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Flexbox min-height bug on IE.
  if (browser.name == "ie") {
    var flexboxFixTimeoutId;

    $window
      .on("resize.flexbox-fix", function () {
        clearTimeout(flexboxFixTimeoutId);

        flexboxFixTimeoutId = setTimeout(function () {
          if ($wrapper.prop("scrollHeight") > $window.height()) $wrapper.css("height", "auto");
          else $wrapper.css("height", "100vh");
        }, 250);
      })
      .triggerHandler("resize.flexbox-fix");
  }

  // Nav.
  var $nav = $header.children("nav"),
    $nav_li = $nav.find("li");

  // Add "middle" alignment classes if we're dealing with an even number of items.
  if ($nav_li.length % 2 == 0) {
    $nav.addClass("use-middle");
    $nav_li.eq($nav_li.length / 2).addClass("is-middle");
  }

  // Main.
  var delay = 325,
    locked = false;

  // Methods.
  $main._show = function (id, initial) {
    var $article = $main_articles.filter("#" + id);

    // No such article? Bail.
    if ($article.length == 0) return;

    // Handle lock.

    // Already locked? Speed through "show" steps w/o delays.
    if (locked || (typeof initial != "undefined" && initial === true)) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Mark as visible.
      $body.addClass("is-article-visible");

      // Deactivate all articles (just in case one's already active).
      $main_articles.removeClass("active");

      // Hide header, footer.
      $header.hide();
      $footer.hide();

      // Show main, article.
      $main.show();
      $article.show();

      // Activate article.
      $article.addClass("active");

      // Unlock.
      locked = false;

      // Unmark as switching.
      setTimeout(
        function () {
          $body.removeClass("is-switching");
        },
        initial ? 1000 : 0
      );

      return;
    }

    // Lock.
    locked = true;

    // Article already visible? Just swap articles.
    if ($body.hasClass("is-article-visible")) {
      // Deactivate current article.
      var $currentArticle = $main_articles.filter(".active");

      $currentArticle.removeClass("active");

      // Show article.
      setTimeout(function () {
        // Hide current article.
        $currentArticle.hide();

        // Show article.
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }

    // Otherwise, handle as normal.
    else {
      // Mark as visible.
      $body.addClass("is-article-visible");

      // Show article.
      setTimeout(function () {
        // Hide header, footer.
        $header.hide();
        $footer.hide();

        // Show main, article.
        $main.show();
        $article.show();

        // Activate article.
        setTimeout(function () {
          $article.addClass("active");

          // Window stuff.
          $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

          // Unlock.
          setTimeout(function () {
            locked = false;
          }, delay);
        }, 25);
      }, delay);
    }
  };

  $main._hide = function (addState) {
    var $article = $main_articles.filter(".active");

    // Article not visible? Bail.
    if (!$body.hasClass("is-article-visible")) return;

    // Add state?
    if (typeof addState != "undefined" && addState === true) history.pushState(null, null, "#");

    // Handle lock.

    // Already locked? Speed through "hide" steps w/o delays.
    if (locked) {
      // Mark as switching.
      $body.addClass("is-switching");

      // Deactivate article.
      $article.removeClass("active");

      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      $body.removeClass("is-article-visible");

      // Unlock.
      locked = false;

      // Unmark as switching.
      $body.removeClass("is-switching");

      // Window stuff.
      $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

      return;
    }

    // Lock.
    locked = true;

    // Deactivate article.
    $article.removeClass("active");

    // Hide article.
    setTimeout(function () {
      // Hide article, main.
      $article.hide();
      $main.hide();

      // Show footer, header.
      $footer.show();
      $header.show();

      // Unmark as visible.
      setTimeout(function () {
        $body.removeClass("is-article-visible");

        // Window stuff.
        $window.scrollTop(0).triggerHandler("resize.flexbox-fix");

        // Unlock.
        setTimeout(function () {
          locked = false;
        }, delay);
      }, 25);
    }, delay);
  };

  // Articles.
  $main_articles.each(function () {
    var $this = $(this);

    // Close.
    $('<div class="close">Close</div>')
      .appendTo($this)
      .on("click", function () {
        location.hash = "";
      });

    // Prevent clicks from inside article from bubbling.
    $this.on("click", function (event) {
      event.stopPropagation();
    });
  });

  // This code close article when click outside it(I Stopped it)
  // Events.
  // $body.on('click', function (event) {
  // Article visible? Hide.
  // if ($body.hasClass('is-article-visible')) $main._hide(true);
  // });

  $window.on("keyup", function (event) {
    switch (event.keyCode) {
      case 27:
        // Article visible? Hide.
        if ($body.hasClass("is-article-visible")) $main._hide(true);

        break;

      default:
        break;
    }
  });

  $window.on("hashchange", function (event) {
    // Empty hash?
    if (location.hash == "" || location.hash == "#") {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Hide.
      $main._hide();
    }

    // Otherwise, check for a matching article.
    else if ($main_articles.filter(location.hash).length > 0) {
      // Prevent default.
      event.preventDefault();
      event.stopPropagation();

      // Show article.
      $main._show(location.hash.substr(1));
    }
  });

  // Scroll restoration.
  // This prevents the page from scrolling back to the top on a hashchange.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  else {
    var oldScrollPos = 0,
      scrollPos = 0,
      $htmlbody = $("html,body");

    $window
      .on("scroll", function () {
        oldScrollPos = scrollPos;
        scrollPos = $htmlbody.scrollTop();
      })
      .on("hashchange", function () {
        $window.scrollTop(oldScrollPos);
      });
  }

  // Initialize.

  // Hide main, articles.
  $main.hide();
  $main_articles.hide();

  // Initial article.
  if (location.hash != "" && location.hash != "#")
    $window.on("load", function () {
      $main._show(location.hash.substr(1), true);
    });
})(jQuery);

///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// My Edit //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Featured Work Shuffle
$(function () {
  "use strict";
  $(".featured-work-header ul li").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    if ($(this).data("class") === "all") {
      $(".featured-work-items .shuffel").css("display", "block");
    } else {
      $(".featured-work-items .shuffel").css("display", "none");
      $($(this).data("class")).parent().css("display", "block");
    }
  });
});
///////////////////////////////////////////////////////////////////

// Type Writer Effect
// Select vars
let links = document.querySelectorAll(".work-link a");
let target = document.querySelectorAll(".target");

// Control Sections on link click
for (let i = 0; i < target.length; i++) {
  for (let i = 0; i < links.length; i++) {
    links[i].onclick = function () {
      if (links[i].getAttribute("href") === "#" + target[i].getAttribute("id")) {
        document.querySelectorAll(".main p").forEach(function (e) {
          e.classList.remove("type");
        });
        target[i].querySelector(".main p").classList.add("type");

        setTimeout(typeWriterEffect, 500);
      }
    };
  }
}

// Control Intro on hash change
window.addEventListener("hashchange", function () {
  if (location.hash === "") {
    document.querySelector(".logo-intro").classList.add("type");
    setTimeout(typeWriterEffect, 500);
  }
});

// Control Intro on load
window.addEventListener("load", function () {
  document.querySelector(".logo-intro").classList.add("type");
  setTimeout(typeWriterEffect, 500);
});

// Control all sections on load
window.addEventListener("load", function () {
  for (let i = 0; i < target.length; i++) {
    if (location.hash === "#" + target[i].getAttribute("id")) {
      document.querySelector(".logo-intro").classList.remove("type");
      target[i].querySelector(".main p").classList.add("type");
    }
  }
});

// Writer Type Effect 'main function'
function typeWriterEffect() {
  let myText = document.querySelector(".type").getAttribute("data-text"),
    i = 0;

  document.querySelector(".type").textContent = "";

  document.querySelectorAll(".work-link").forEach(function (e) {
    e.addEventListener("click", function () {
      clearInterval(typeWriter);
    });
  });

  let typeWriter = setInterval(function () {
    document.querySelector(".type").textContent += myText.charAt(i);
    i = i + 1;
  }, 100);

  document.querySelectorAll(".close").forEach(function (e) {
    e.addEventListener("click", function () {
      clearInterval(typeWriter);
    });
  });
}
////////////////////////////////////////////////////////////////////////

// Animate skills progress
// Select variable
let allSkills = document.querySelectorAll(".skills .skill-box .skill-progress span");

// Control skills on hash change
window.addEventListener("hashchange", function () {
  if (location.hash === "#about") {
    allSkills.forEach((skill) => {
      skill.style.width = 0;
    });

    allSkills.forEach((skill) => {
      setTimeout(function () {
        skill.style.width = skill.dataset.progress;
      }, 1000);
    });
  } else {
    allSkills.forEach((skill) => {
      skill.style.width = 0;
    });
  }
});

// Control skills on load
window.addEventListener("load", function () {
  allSkills.forEach((skill) => {
    setTimeout(function () {
      skill.style.width = skill.dataset.progress;
    }, 1000);
  });
});
/////////////////////////////////////////////////////////////

// Create popup with the image
let ourGallery = document.querySelectorAll(".gallery img");

ourGallery.forEach((img) => {
  img.addEventListener("click", (e) => {
    // Create overlay element
    let overlay = document.createElement("div");

    // Add class to overlay
    overlay.className = "popup-overlay";

    // Append overlay to the body
    document.body.appendChild(overlay);

    // Create popup box
    let popupBox = document.createElement("div");

    // Add class to popup box
    popupBox.className = "popup-box";

    if (img.alt !== null) {
      // Create anchor
      let imgAnchor = document.createElement("a");

      // Create link name
      let imgLinkName = document.createTextNode(img.alt);

      // Set href value
      imgAnchor.setAttribute("href", img.dataset.link);

      // Set target value
      imgAnchor.target = "_blank";

      // Append link name to the anchor
      imgAnchor.appendChild(imgLinkName);

      // Append anchor to popup box
      popupBox.appendChild(imgAnchor);
    }

    // Create the image
    let popupImage = document.createElement("img");

    // Set image source
    popupImage.src = img.src;

    // Add image to popup box
    popupBox.appendChild(popupImage);

    // Add popup box to body
    document.body.appendChild(popupBox);

    // Create the close span
    let closeButton = document.createElement("span");

    // Create the close button text
    let closeButtonText = document.createTextNode("X");

    // Append text to close button
    closeButton.appendChild(closeButtonText);

    // Append button to popup box
    popupBox.appendChild(closeButton);

    // Add class to closr button
    closeButton.className = "close-button";
  });
});

// Close popup
document.addEventListener("click", (e) => {
  if (e.target.className == "close-button") {
    // Remove the current popup
    e.target.parentElement.remove();

    // Remove the overlay
    document.querySelector(".popup-overlay").remove();
  }
});
///////////////////////////////////////////////////////////////////
