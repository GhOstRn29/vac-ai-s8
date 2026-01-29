document.addEventListener('DOMContentLoaded', () => {

    // Music Controls
    const musicBtn = document.getElementById('music-btn');
    const bgm = document.getElementById('bg-music');
    const enterBtn = document.getElementById('enter-btn');
    const songNameDisplay = document.getElementById('song-name');

    // Playlist Configuration
    // Update these filenames to match your actual files
    const playlist = [
        { file: 'assets/song1.mp3', name: 'I see the light' },
        { file: 'assets/song2.mp3', name: 'Let it go' },
        { file: 'assets/song3.mp3', name: 'Do you want to build a snowman' },
        { file: 'assets/song4.mp3', name: 'How far Ill Go' }
    ];

    let currentSongIndex = 3;
    let isPlaying = false;

    function loadSong(index) {
        // Only update if files exist, otherwise keep placeholder
        bgm.src = playlist[index].file;
        songNameDisplay.textContent = playlist[index].name;
    }

    // Initialize first song
    loadSong(currentSongIndex);

    function toggleMute() {
        if (bgm.muted) {
            bgm.muted = false;
            musicBtn.textContent = '🔊'; // Unmuted icon
        } else {
            bgm.muted = true;
            musicBtn.textContent = '🔇'; // Muted icon
        }
    }

    function playMusic() {
        // If not playing, start playing
        bgm.play().then(() => {
            isPlaying = true;
            bgm.muted = false; // Ensure unmuted when starting
            musicBtn.textContent = '🔊';
        }).catch(e => {
            console.log("Audio play failed, likely needs interaction:", e);
            songNameDisplay.textContent = "Click to Play";
        });
    }

    // Handle song end (Loop playlist)
    bgm.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playMusic();
    });

    musicBtn.addEventListener('click', () => {
        if (bgm.paused) {
            playMusic();
        } else {
            toggleMute();
        }
    });

    // Character Click Handlers
    document.querySelectorAll('.character-side').forEach(char => {
        char.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.songIndex);
            if (!isNaN(index)) {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playMusic();
            }
        });
    });

    // "Open the Book" Interaction
    enterBtn.addEventListener('click', () => {
        if (bgm.paused) {
            playMusic();
        }

        // Smooth scroll to story
        document.getElementById('story').scrollIntoView({ behavior: 'smooth' });
    });

    // Intersection Observer for Scroll Transitions
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate children if needed (e.g., cards)
                if (entry.target.id === 'story') {
                    const cards = entry.target.querySelectorAll('.story-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('in-view');
                        }, index * 300); // Staggered delay
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

});
