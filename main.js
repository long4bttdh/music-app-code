// 1. render songs 
// 2. scroll top
// 3. play/ pause /seek
// 4. CD rotate
// 5. next/ prev
// 6. random
// 7. next / repeat whem ended
// 8. active song
// 9. scroll active song into view
// 10. play song when click 


const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},

    songs : [
    {
        name: "Click Pow Get Down",
        singer: "Raftaar x Fortnite",
        path: "./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
      },
      {
        name: "Tu Phir Se Aana",
        singer: "Raftaar x Salim Merchant x Karma",
        path: "./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image:
          "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
      },
      {
        name: "Naachne Ka Shaunq",
        singer: "Raftaar x Brobha V",
        path:"./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
      },
      {
        name: "Mantoiyat",
        singer: "Raftaar x Nawazuddin Siddiqui",
        path: "./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image:"https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
      },
      {
        name: "Aage Chal",
        singer: "Raftaar",
        path: "./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image:"https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
      },
      {
        name: "Damn",
        singer: "Raftaar x kr$na",
        path:"./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image:"https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
      },
      {
        name: "Feeling You",
        singer: "Raftaar x Harjas",
        path: "./Jung Kook from BTS performs 'Dreamers' at FIFA World Cup opening ceremony (128 kbps).mp3",
        image:
          "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
      }
    ],
    setConfig: function (key, value) {
      this.config[key] = value;
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
            `;
        });
        playlist.innerHTML = htmls.join("")
    },

    defineProperties: function(){
      Object.defineProperty(this,'currentSong',{
        get: function(){
          return this.songs[this.currentIndex]
        }
      })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate([
          {transform: 'rotate(360deg)'}
        ], {
          duration: 10000,
          iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function(){
          if(_this.isPlaying){
            
            audio.pause();
            
          }else{
           
            audio.play();
            
          }
        }
        audio.onplay = function(){
          _this.isPlaying= true;
          player.classList.add('playing')
          cdThumbAnimate.play()
        }

        audio.onpause = function(){
          _this.isPlaying= false;
          player.classList.remove('playing')
          cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration*100);
            progress.value = progressPercent
          }
          
        }
        progress.onchange = function(e){
            const seekTime = audio.duration /100*e.target.value;
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          }
          else{
            _this.nextSong()
          }
         
          audio.play()
        }

        prevBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          }
          else{
            _this.prevSong()
          }
          audio.play()
        }

        randomBtn.onclick = function (e) {
          _this.isRandom = !_this.isRandom;
          _this.setConfig("isRandom", _this.isRandom);
          randomBtn.classList.toggle("active", _this.isRandom);
        };
    
        // Xử lý lặp lại một song
        // Single-parallel repeat processing
        repeatBtn.onclick = function (e) {
          _this.isRepeat = !_this.isRepeat;
          _this.setConfig("isRepeat", _this.isRepeat);
          repeatBtn.classList.toggle("active", _this.isRepeat);
        };
    
        // Xử lý next song khi audio ended
        // Handle next song when audio ended
        audio.onended = function () {
          if (_this.isRepeat) {
            audio.play();
          } else {
            nextBtn.click();
          }
        };
        
        playlist.onclick = function (e) {
          const songNode = e.target.closest(".song:not(.active)");
    
          if (songNode || e.target.closest(".option")) {
            // Xử lý khi click vào song
            // Handle when clicking on the song
            if (songNode) {
              _this.currentIndex = Number(songNode.dataset.index);
              _this.loadCurrentSong();
              _this.render();
              audio.play();
            }
    
            // Xử lý khi click vào song option
            // Handle when clicking on the song option
            if (e.target.closest(".option")) {
            }
          }
        };
    },
    scrollToActiveSong: function () {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }, 300);
    },

    loadCurrentSong: function(){
      heading.textContent = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;

    },
    loadConfig: function () {
      this.isRandom = this.config.isRandom;
      this.isRepeat = this.config.isRepeat;
    },

    nextSong: function () {
      this.currentIndex++;
      if (this.currentIndex >= this.songs.length-1) {
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },

    prevSong: function () {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length-1;
      }
      this.loadCurrentSong();
    },

    playRandomSong: function () {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * this.songs.length);
      } while (newIndex === this.currentIndex);
  
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    },

    start: function(){
        this.loadConfig()
        this.defineProperties()
        this.loadCurrentSong()
        this.render()
        this.handleEvents()
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
        
    
    }
    
}
app.start();

