// script.js

// Load audio data
async function loadAudioData() {
    // Display loading message
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.textContent = 'Loading audio data...';

    try {
        let data_dict = {};
        
        // Fetch first audio feature
        let response = await fetch('audio/havana.json');
        let feature = await response.json();

        // Populate track selector
        const trackSelector = document.getElementById('track-selector');
        let option = document.createElement('option');
        data_dict["beats"] = feature.beats;
        data_dict["spectrogram"] = feature.spectrogram;
        option.value = data_dict; // Adjust based on your data structure
        option.textContent = feature.name; // Adjust based on your data structure
        trackSelector.appendChild(option);

        // Fetch second audio feature
        response = await fetch('audio/badguy.json');
        feature = await response.json();

        option = document.createElement('option');
        data_dict["beats"] = feature.beats;
        data_dict["spectrogram"] = feature.spectrogram;
        option.value = data_dict; // Adjust based on your data structure
        option.textContent = feature.name; // Adjust based on your data structure
        trackSelector.appendChild(option);

        // Remove loading message
        loadingMessage.textContent = 'Finished loading audio data.';
    } catch (error) {
        // Handle errors gracefully
        loadingMessage.textContent = 'Error loading audio data.';
        console.error("Error fetching audio data:", error);
    } 
}

// Declare audio-related variables outside the function to maintain scope
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBufferSourceNode;
let isPlaying = false;

// Function to play audio from spectrogram
function playAudioFromSpectrogram(spectrogram) {
    const numSamples = spectrogram[0].length;
    const numChannels = spectrogram.length;
    const audioBuffer = audioContext.createBuffer(numChannels, numSamples, audioContext.sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        audioBuffer.copyToChannel(new Float32Array(spectrogram[channel]), channel);
    }

    audioBufferSourceNode = audioContext.createBufferSource();
    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.connect(audioContext.destination);
    audioBufferSourceNode.start(0);
    isPlaying = true;
    
    audioBufferSourceNode.onended = () => {
        isPlaying = false;
    };
}

// Function to pause the audio
function pauseAudio() {
    if (isPlaying) {
        audioBufferSourceNode.stop(); // Stop the audio
        isPlaying = false;
    }
}

// Start the game
function startGame() {
    const selectedTrack = data_dicts[document.getElementById('track-selector').value]; // Assuming data_dicts holds your data
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gamePhase').style.display = 'block';

    // Set up event listeners correctly
    document.getElementById('play-button').addEventListener('click', () => {
        playAudioFromSpectrogram(selectedTrack.spectrogram);
    });
    document.getElementById('pause-button').addEventListener('click', pauseAudio);

    // Initialize 3D boxes based on audio data
    // Additional game logic goes here
}


// Event listeners
document.getElementById('start-button').addEventListener('click', startGame);

// Initialize
loadAudioData();
