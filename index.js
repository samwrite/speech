window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const recognition = new SpeechRecognition();

const icon = document.querySelector('i.fa.fa-microphone');
let paragraph = document.createElement('p');
let container = document.querySelector('.text-box');
let name = '';

container.appendChild(paragraph);

const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {  
    sound.play();  
    dictate();
});

//-->SPEECH TO TEXT ONLY
// const dictate = () => {  
//     recognition.start();  
//     recognition.onresult = (event) => {    
//     const speechToText = event.results[0][0].transcript;        
//     paragraph.textContent = speechToText;  }
// }

const synth = window.speechSynthesis;
console.log(synth.getVoices());

const speak = (action) => {  
    utterThis = new SpeechSynthesisUtterance(action());  
    synth.speak(utterThis);
};

//--> TEXT TO SPEECH
const dictate = () => {  
    recognition.start();  
    recognition.onresult = (event) => {    
        const speechToText = event.results[0][0].transcript;        
        paragraph.textContent = speechToText; 
        if (event.results[0].isFinal) {
            if (speechToText.includes('what is the time')) {        
                speak(getTime);    
                return;
            };        
            if (speechToText.includes('what is today\'s date')) {        
                speak(getDate);    
                return;
            };        
            if (speechToText.includes('what is the weather in')) {        
                getTheWeather(speechToText);
                return;
            };
            if (speechToText.includes('my name is')) {
                rememberName(speechToText);
                return;
            };
            speak(talkAgain);
        }
    }
}
const getTime = () => {  
    const time = new Date(Date.now());  
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`};
const getDate = () => {  
    const time = new Date(Date.now())  
    return `today is ${time.toLocaleDateString()}`;
};
const talkAgain = () => {
    return `I couldn\'t catch what you said, please try again`;
};
const rememberName = (speech) => {
    utterThis = new SpeechSynthesisUtterance(`Hi ${speech.split(' ')[3]}`);
    name = speech.split(' ')[3];
    synth.speak(utterThis);
    document.getElementById('name').innerHTML = name;
};
const getTheWeather = (speech) => {fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`).then(function(response){  
    return response.json();}).then(function(weather){  
        if (weather.cod === '404') {    
            utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);    
            synth.speak(utterThis);    
            return;  
        }  
        utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);  
        synth.speak(utterThis);  
    });
};