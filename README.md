# Guess-The-Word-Game-Powered-By-Muller
"Guess The Word" is an interactive word-guessing game where users select a difficulty level and try to guess hidden words by filling in letters. Players can use limited hints, track their score and high score, and receive instant feedback on correct, misplaced, or incorrect letters. The game is responsive and works on all devices.
1. Overall Structure

Built with HTML, Tailwind CSS, and JavaScript. Dark theme design with semi-transparent backgrounds and gradient colors. Responsive design works on desktop and mobile devices.

2. HTML

Header displays the game title "Guess The Word". Main container uses a grid layout with a game area for the word display, letter inputs, control buttons, and message display. Sidebar contains difficulty selector, game info, and a visual legend for letter correctness. Footer displays developer credits. Semantic tags include header, main, section, aside, and footer.

3. CSS / Tailwind

Dark theme with gradients. Responsive typography using Tailwind text classes. Buttons and inputs styled with rounded corners, shadows, and hover states. Interactive feedback colors indicate letter correctness. Flexbox and grid used for layout and spacing. Backdrops and shadows add visual depth.

4. JavaScript Features

Fetches words and hints from a local JSON file. Supports multiple levels and difficulty selection. Random word selection from remaining words. Dynamically creates input fields per word length with auto-focus and navigation using arrow keys and backspace. Limited hints system. Checks word against input letters and updates score and high score. Provides color feedback for letters. Handles game over and allows generating a new word. Next level button appears after completing a level. Enter key triggers the check word action.

5. UX Enhancements

Auto-focus moves to the next input after typing. Solved letters are disabled. Responsive interaction adjusts sizes and spacing for different screens. Dynamic messages show hints, success, wrong attempts, and game over notifications.

6. Summary

A fully interactive, responsive word guessing game with multiple difficulty levels, hints, color-coded feedback, scoring, and level progression. Combines HTML5 semantics, Tailwind CSS design, and JavaScript logic for a smooth user experience.
