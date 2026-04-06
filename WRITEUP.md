# College Majors Interactive Visualization - Write-up

## Design Rationale

### Visual Encoding Choices

**Bar Chart**: I chose a horizontal bar chart to display median salaries because:
- Length encoding is highly effective for quantitative comparisons
- Horizontal orientation accommodates long major names without rotation
- Easy to scan and compare values across majors

**Color**: Major categories are encoded by color using D3's Tableau10 scheme:
- Provides clear visual grouping by academic discipline
- Helps users quickly identify patterns (e.g., Engineering majors cluster at top for salary)
- Legend allows easy reference

**Alternatives Considered**:
- Scatter plot (salary vs unemployment): Would show correlation but makes individual major identification harder
- Grouped bar chart: Would allow multiple metrics simultaneously but creates visual clutter
- Bubble chart: Could encode 3+ dimensions but reduces precision in reading values

### Interaction Techniques

**1. Category Filter (Dynamic Query)**
- Dropdown allows filtering by major category (Engineering, Business, etc.)
- Enables focused exploration of specific academic fields
- Updates all visualizations and statistics dynamically

**2. Sort Toggle (Sorting)**
- Button cycles through 4 sort metrics: Median Salary, Unemployment Rate, % Women, Total Graduates
- Reveals different insights: highest paying majors, gender distribution patterns, employment risks
- Smooth transitions maintain context during re-sorting

**3. Tooltip (Details-on-Demand)**
- Hover reveals complete statistics for each major
- Includes: category, salary, unemployment, gender ratio, total graduates
- Prevents visual clutter while providing comprehensive information

**4. Dynamic Statistics Panel (Overview)**
- Real-time summary statistics update with filters
- Shows: count of majors, average salary, unemployment rate, % women
- Provides context for filtered subset vs. full dataset

### Why These Interactions?

These interactions work together to support exploratory analysis:
- **Filter** narrows scope to relevant majors
- **Sort** reveals rankings and patterns
- **Tooltip** provides detailed information
- **Statistics** maintain overview context

This combination allows users to answer questions like:
- "Which engineering majors pay best?"
- "Are STEM fields dominated by men?"
- "Do higher-paying majors have lower unemployment?"

## Development Process

### Team Composition
Solo project - all work completed individually

### Time Breakdown (Total: ~12 hours)

**Data Exploration & Planning (2 hours)**
- Examined FiveThirtyEight college majors dataset structure
- Identified key variables: salary, unemployment, gender, categories
- Sketched interaction concepts and visual encodings

**Implementation (7 hours)**
- D3 setup and data loading: 1 hour
- Bar chart with scales and axes: 2 hours
- Interactive filters and sorting: 2 hours
- Tooltip and statistics panel: 1.5 hours
- Styling and polish: 0.5 hours

**Testing & Refinement (2 hours)**
- Cross-browser testing
- Interaction flow optimization
- Responsive adjustments

**Documentation (1 hour)**
- Code comments
- This write-up

### Challenges & Learnings

**Challenge 1: Data Update Pattern**
- Initially struggled with D3's enter/update/exit pattern for dynamic updates
- Solution: Used key function in data join to maintain object constancy during transitions
- Learning: Proper data binding is crucial for smooth animations

**Challenge 2: Tooltip Positioning**
- Tooltip initially went off-screen for bars on right side
- Solution: Used event.pageX/pageY for absolute positioning with offset
- Learning: Consider viewport boundaries for floating elements

**Challenge 3: Axis Updates**
- Axes weren't updating correctly when switching sort metrics
- Solution: Remove old axes before appending new ones
- Learning: SVG elements persist unless explicitly removed

**Challenge 4: Performance**
- Rendering all 173 majors caused slow transitions
- Solution: Limited display to top 30 majors per sort/filter
- Learning: Balance completeness with performance

### Key Takeaways

1. **Start simple**: Initial design had 6+ interactions; simplified to 4 most impactful ones
2. **Transitions matter**: Smooth animations help users track changes during updates
3. **Context is crucial**: Statistics panel provides overview that individual bars cannot
4. **Test early**: Discovered tooltip and axis issues through early browser testing

### Technologies Used
- D3.js v7 for visualization
- Vanilla JavaScript for interaction logic
- CSS3 for styling and transitions
- GitHub Pages for hosting

### Future Enhancements
- Add scatter plot view for bivariate analysis
- Implement brushing to select salary ranges
- Add search/highlight functionality for specific majors
- Include time-series data if available for trend analysis
