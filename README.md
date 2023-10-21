# YarsaTask

This is a task where I showcase a role-based dashboard using react, adhering to specific guidelines and requirements.

## Installation

For the project to work, set the terminal current directory in the react project's location and use the command:

```bash
npm install
```

This project used a mock server, provided to me at:

```
https://github.com/saurabbikramsen/YarsaTestReview/
```

## Setup : Create a dot env file(.env) and setup as shown below

```
# make sure to prefix the variable with this(= VITE_) keyword followed by an underscore: VITE_
VITE_BASE_URL='http://localhost:3000'
VITE_WS_URL="ws://localhost:3000"
```

# Features

<ul>
    <li>Secure role-based login system for three user types: "Admin," "Staff," and "Player." </li>
    <li>Routes are protected and inaccessible for users with invalid or insufficient roles.</li>
    <li>Admins are able to create users of all types (Admins, Staff, and Players).</li>
    <li>
    Admins can view all players with their information and statistics.
    </li>
    <li>Admins are able to update player details, including active/inactive status.</li>
    <li>Create a real-time leaderboard to display player rankings, updating data frequently.</li>
    <li>Search bar in the header for searching players by name and country. The search bar is accessible across all routes within the dashboard</li>
    <li>Implement debouncing to optimize API calls (500ms or 1 second).</li>
    <li>The SearchBar component must accept a function “onQueryChange” as prop which is responsible for making the API call when the debounced value changes.</li>
    <li>Detailed player information and statistics are displayed in a Modal/Dialog upon clicking search results.</li>
    <li>Staff members are able to view player information and stats.</li>
    <li>Players are able to view their own information, stats, and participate in games.</li>
    <li>Button to simulate gameplay and update player stats through API call on button click.</li>
    <li>Player-to-player chat and players can create and join chat rooms.</li>
</ul
