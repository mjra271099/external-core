        document.addEventListener("DOMContentLoaded", function () {
        const videoPlayer = document.getElementById("videoPlayer");
        const playPauseBtn = document.getElementById("playPauseBtn");
        const muteBtn = document.getElementById("muteBtn");
        const volumeSlider = document.getElementById("volumeSlider");
        const progressContainer = document.getElementById("progressContainer");
        const progressBar = document.getElementById("progressBar");
        const currentTimeElement = document.getElementById("currentTime");
        const durationElement = document.getElementById("duration");
        const playbackSpeed = document.getElementById("playbackSpeed");
        const fullscreenBtn = document.getElementById("fullscreenBtn");
        const spinner = document.getElementById("spinner");
        const errorMessage = document.getElementById("errorMessage");
        const container = document.querySelector(".container");
        const videoContainer = document.getElementById("videoContainer");
        const centerPlayBtn = document.getElementById("centerPlayBtn");

        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("id");

        if (videoId) {
          spinner.style.display = "block";

          videoPlayer.src = "https://cdn.videy.co/" + videoId + ".mp4";

          videoPlayer.addEventListener("loadeddata", function () {
            spinner.style.display = "none";
            durationElement.textContent = formatTime(videoPlayer.duration);
          });

          videoPlayer.addEventListener("waiting", function () {
            spinner.style.display = "block";
          });

          videoPlayer.addEventListener("canplay", function () {
            spinner.style.display = "none";
          });

          videoPlayer.addEventListener("error", function () {
            spinner.style.display = "none";
            errorMessage.style.display = "block";
          });

          // Otomatis play jika diizinkan (dengan playsinline untuk iOS)
          //   const playPromise = videoPlayer.play();

          //   if (playPromise !== undefined) {
          //     playPromise.catch(function (error) {
          //       console.log("Autoplay tidak diizinkan: ", error);
          //       playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          //       videoContainer.classList.add("paused");
          //     });
          //   }
          // } else {
          //   errorMessage.innerHTML =
          //     '<i class="fas fa-exclamation-circle"></i><p>Video tidak ditemukan</p>';
          //   errorMessage.style.display = "block";
          // }
          // Start Pause
          videoPlayer.pause();
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          videoContainer.classList.add("paused");
        } else {
          errorMessage.innerHTML =
            '<i class="fas fa-exclamation-circle"></i><p>Video tidak ditemukan</p>';
          errorMessage.style.display = "block";
        }

        function formatTime(seconds) {
          if (isNaN(seconds)) return "00:00";

          let minutes = Math.floor(seconds / 60);
          let secs = Math.floor(seconds % 60);
          return `${minutes
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        }

        function togglePlayPause() {
          if (videoPlayer.paused || videoPlayer.ended) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            centerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            videoContainer.classList.remove("paused");
          } else {
            videoPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            centerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            videoContainer.classList.add("paused");
          }
        }

        playPauseBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          togglePlayPause();
        });

        centerPlayBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          togglePlayPause();
        });

        videoContainer.addEventListener("click", function (e) {
          if (e.target === videoContainer || e.target === videoPlayer) {
            togglePlayPause();
          }
        });

        videoPlayer.addEventListener("timeupdate", function () {
          const currentTime = videoPlayer.currentTime;
          const duration = videoPlayer.duration;
          const progressPercent = (currentTime / duration) * 100;

          progressBar.style.width = `${progressPercent}%`;
          currentTimeElement.textContent = formatTime(currentTime);
        });

        progressContainer.addEventListener("click", function (e) {
          const progressWidth = this.clientWidth;
          const clickX = e.offsetX;
          const duration = videoPlayer.duration;

          videoPlayer.currentTime = (clickX / progressWidth) * duration;
        });

        muteBtn.addEventListener("click", function () {
          videoPlayer.muted = !videoPlayer.muted;
          muteBtn.innerHTML = videoPlayer.muted
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-volume-up"></i>';

          volumeSlider.value = videoPlayer.muted ? 0 : videoPlayer.volume;
        });

        volumeSlider.addEventListener("input", function () {
          videoPlayer.volume = volumeSlider.value;
          videoPlayer.muted = volumeSlider.value === 0;

          muteBtn.innerHTML =
            volumeSlider.value == 0
              ? '<i class="fas fa-volume-mute"></i>'
              : '<i class="fas fa-volume-up"></i>';
        });

        playbackSpeed.addEventListener("change", function () {
          videoPlayer.playbackRate = parseFloat(this.value);
        });

        fullscreenBtn.addEventListener("click", function () {
          if (
            !document.fullscreenElement &&
            !document.webkitFullscreenElement &&
            !document.mozFullScreenElement &&
            !document.msFullscreenElement
          ) {
            if (container.requestFullscreen) {
              container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
              container.webkitRequestFullscreen();
            } else if (container.mozRequestFullScreen) {
              container.mozRequestFullScreen();
            } else if (container.msRequestFullscreen) {
              container.msRequestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          } else {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          }
        });

        videoPlayer.addEventListener("play", function () {
          playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
          centerPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
          videoContainer.classList.remove("paused");
        });

        videoPlayer.addEventListener("pause", function () {
          playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
          centerPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
          videoContainer.classList.add("paused");
        });

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange
        );
        document.addEventListener(
          "mozfullscreenchange",
          handleFullscreenChange
        );
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);

        function handleFullscreenChange() {
          if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          ) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
          } else {
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
          }
        }

        window.addEventListener("orientationchange", function () {
          setTimeout(function () {
            videoPlayer.style.height = "100%";
            videoPlayer.style.width = "100%";
          }, 200);
        });
      });
   