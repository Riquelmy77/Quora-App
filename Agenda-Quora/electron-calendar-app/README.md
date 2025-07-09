# Electron Calendar App

This is a simple calendar application built using Electron. The app features a month view with days displayed on the left and typical calendar functionalities on the right.

## Project Structure

```
electron-calendar-app
├── src
│   ├── main.js              # Main entry point for the Electron application
│   ├── renderer.js          # Handles rendering logic and interactions
│   ├── index.html           # Main HTML structure for the calendar app
│   ├── styles
│   │   └── main.css         # CSS styles for the application
│   └── components
│       ├── MonthView.js     # Generates the month view of the calendar
│       ├── DayList.js       # Displays the list of days for the selected month
│       └── CalendarFunctions.js # Utility functions for calendar operations
├── package.json             # Configuration file for npm
└── README.md                # Documentation for the project
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd electron-calendar-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   npm start
   ```

## Usage Guidelines

- The application opens with the current month displayed.
- Use the navigation buttons to switch between months.
- Click on a day to view or add events (functionality to be implemented).

## Contributing

Feel free to submit issues or pull requests for improvements and features.