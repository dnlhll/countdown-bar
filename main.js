// ==UserScript==
// @name         Countdown Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Countdown Bar
// @author       Daniel Hull
// @match        https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

const css = `
#progressbar-button, #placeholder-bar, .progressbar {
  width: 100%;
  margin: 0px auto;
}
#placeholder-bar {
  height: 15px;
}
.progressbar .inner {
  height: 15px;
  animation: progressbar-countdown;
  /* Placeholder, this will be updated using javascript */
  animation-duration: 40s;
  /* We stop in the end */
  animation-iteration-count: 1;
  /* Stay on pause when the animation is finished finished */
  animation-fill-mode: forwards;
  /* We start paused, we start the animation using javascript */
  animation-play-state: paused;
  /* We want a linear animation, ease-out is standard */
  animation-timing-function: linear;
}
@keyframes progressbar-countdown {
  0% {
    width: 100%;
    background: #0F0;
  }
  100% {
    width: 0%;
    background: #F00;
  }
}
`;

/*
 *  Creates a progressbar.
 *  @param id the id of the div we want to transform in a progressbar
 *  @param duration the duration of the timer example: '10s'
 *  @param callback, optional function which is called when the progressbar reaches 0.
 */
function createProgressbar(id, duration, callback) {
  // We select the div that we want to turn into a progressbar
  var progressbar = document.getElementById(id);
  progressbar.className = 'progressbar';

  // We create the div that changes width to show progress
  var progressbarinner = document.createElement('div');
  progressbarinner.className = 'inner';
  progressbarinner.setAttribute('id','progressbar-inner');

  // Now we set the animation parameters
  progressbarinner.style.animationDuration = duration;

  // Eventually couple a callback
  if (typeof(callback) === 'function') {
    progressbarinner.addEventListener('animationend', callback);
  }

  // Append the progressbar to the main progressbardiv
  progressbar.appendChild(progressbarinner);

  // When everything is set up we start the animation
  progressbarinner.style.animationPlayState = 'running';
}

(function() {
    'use strict';

    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    var btn = document.createElement("button");
    btn.setAttribute('id','progressbar-button');
    btn.innerHTML = "CLICK TO RESET";
    var placeholderBar = document.createElement("div");
    placeholderBar.setAttribute('id', 'placeholder-bar');
    btn.onclick = () => {
        var placeholderBarCheck = document.getElementById("placeholder-bar");
        if (placeholderBarCheck) {
            placeholderBarCheck.remove();
        }
        var progressbarInner = document.getElementById("progressbar-inner");
        if (progressbarInner) {
            progressbarInner.remove();
        }
        createProgressbar('progressbar-button', '120s', function() {
            alert('your time is up');
        });
        return false;
    };
    document.querySelector("body").before(btn);
    btn.appendChild(placeholderBar);
})();
