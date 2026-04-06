# College Majors Interactive Visualization

An interactive D3.js visualization exploring salary, employment, and gender distribution across college majors using FiveThirtyEight data.

## Live Demo

Open `index.html` in a web browser or host on GitHub Pages.

## Features

### 4 Interactive Techniques

1. **Category Filter** - Filter majors by academic category (Engineering, Business, etc.)
2. **Dynamic Sorting** - Sort by Median Salary, Unemployment Rate, % Women, or Total Graduates
3. **Tooltips** - Hover over bars for detailed statistics
4. **Live Statistics** - Real-time summary stats update with your selections

## Dataset

**Source**: [FiveThirtyEight College Majors Data](https://github.com/fivethirtyeight/data/tree/master/college-majors)

**Variables Used**:
- Median salary
- Unemployment rate
- Gender distribution (% women)
- Total graduates
- Major category

## Setup

### Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process required - uses CDN for D3.js

### GitHub Pages Deployment

1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Access via `https://[username].github.io/[repo-name]/`

## Project Structure

```
college-majors-viz/
├── index.html          # Main visualization
├── WRITEUP.md          # Design rationale and development process
└── README.md           # This file
```

## Technologies

- **D3.js v7** - Data visualization
- **HTML5/CSS3** - Structure and styling
- **Vanilla JavaScript** - Interaction logic

## Key Insights

- Engineering majors dominate top salary rankings
- Gender distribution varies dramatically by field
- Higher-paying majors don't always have lower unemployment
- STEM fields show strong salary performance

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires JavaScript enabled and modern browser with ES6 support.

## Assignment Context

Created for HW3: Interactive Visualization
- Course: Data Visualization
- Due: April 8, 2026
- Requirements: 3+ interactions using D3.js

## License

Data: FiveThirtyEight (Creative Commons Attribution 4.0)
Code: MIT License
