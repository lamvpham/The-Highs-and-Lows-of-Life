# The Intruder

### **Built with [p5.js](https://p5js.org/) and [node.js](https://nodejs.org/en)**

Based on using 3D graphics using WebGL and Node.js for the distributed system, this art piece is an exploration between control and chance through the lens of human emotions throughout a life. By displaying textual elements selected from the slot wheels onto a secondary screen, it is meant to be a poetic expression of visual dialogue. 

## Formal Qualities
Characterized by two slot wheels centered on the first screen, it has 21 slots filled randomly with two separate arrays - the first wheel contains nouns “I”, “You”, “We”, “They”, whereas the second wheel initially stars with 7 positive emotions, and after each spin, one word gets replaced with a negative emotion. Once all 7 words from the positive emotions array are filled with negative emotions, it loops backwards, and is done definitely as a subtle narrative flow to the piece’s interaction. Using Node.js and websockets, the focused slots after every spin get sent to a secondary screen, which displays the labels. The first screen is a neon blue, and the second screen is a red neon glow.

## Context
This art piece serves as a metaphor for the journey of one’s life, where each spin represents the random events that elicit an emotional response (positive or negative). Meant to reflect the unpredictability of life and an individual, each spin is showcasing the possibility to have a moment of happiness or a moment of sadness. This ebb and flow reaches a maximum of 7 positive emotions at a time and a minimum of 7 negative emotions at a time, illustrating that there will always be an endless cycle of peaks and troughs in the human experience. The futuristic theme is honing in on the future-tense aspect, which means that rather than focus on the highs and lows of your past, the future is bound to repeat those highs and lows regardless.  


## Technical Description
The first screen uses two 3D slot machine wheels made using WebGL. Parts of the slot machine code is referenced from Aidan Nelson’s code to construct the movement, interaction, and behaviour of the wheels as a user presses spacebar to activate the spin. A focused state for slots facing the user are coded in red, and once the wheels stop spinning, the focused labels are collected in websockets and Node.js, and sent to a server which distributes that data to the secondary screen to display. The second screen is built in HTML, CSS, and Javascript, and is mainly a container to showcase the labels.
