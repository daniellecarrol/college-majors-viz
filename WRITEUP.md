# College Majors Interactive Visualization — Write-up

## Design Rationale

### The Question
This visualization explores: **how do salary, unemployment, and gender distribution vary across college majors?** The FiveThirtyEight recent-grads dataset has 173 majors with clean numeric fields, making it well-suited for both ranked comparison and correlation analysis.

### Two Coordinated Views

**Bar chart (left)**: Shows the top 30 majors ranked by a user-selected metric. This view answers "which majors are highest/lowest in X?" and makes it easy to scan ordered lists.

**Scatter plot (right)**: Shows all majors positioned by salary (x) vs. unemployment (y), with bubble size encoding total graduates. This view reveals correlation patterns — for example, whether high-paying majors tend to have lower unemployment.

The two views are **linked**: brushing a region in the scatter plot highlights the corresponding bars, and clicking a legend category filters both views simultaneously. This coordination lets users identify patterns in the scatter plot and immediately see where those majors rank in the bar chart.

### Visual Encodings

**Bar chart**:
- **Bar length** encodes the active sort metric (salary, unemployment, % women, or total grads). The axis label and tick format update to match, so the encoding is always honest.
- **Horizontal layout** accommodates long major names without rotation.
- **Top 30 only** keeps the chart readable while still showing enough majors to identify patterns.

**Scatter plot**:
- **x position** = median salary
- **y position** = unemployment rate
- **bubble size** = total graduates (a third quantitative dimension)
- **color** = major category (consistent with bar chart)

This encoding reveals whether high-paying majors have lower unemployment (they don't — the scatter shows no strong correlation), and whether large majors cluster differently than small ones.

**Color by category**: Color encodes academic category (Engineering, Business, Arts, etc.) consistently across both views. This was chosen over encoding a quantitative variable because it lets users spot category-level patterns — for example, Engineering majors cluster in the high-salary/low-unemployment region of the scatter plot. D3's Tableau10 scheme provides 10 visually distinct colors.

**Alternatives considered**:
- A single scatter plot without the bar chart would show correlation but makes ranking questions harder to answer.
- A grouped bar chart showing multiple metrics simultaneously was prototyped but created too much visual clutter.
- Encoding category as position (small multiples) would eliminate the need for color but would break the brushing & linking interaction.

### Interaction Techniques

**1. Category filter (dynamic query)**: A dropdown filters both views to a single academic category. This narrows the dataset to a specific field and updates all statistics. Filtering to Engineering or Arts immediately reveals within-category patterns that are invisible in the full 173-major view.

**2. Sort toggle (sorting)**: A button cycles through four sort metrics for the bar chart: Median Salary, Unemployment Rate, % Women, and Total Graduates. This is the most direct way to answer ranking questions. The bar width, axis label, and tick format all update to match the active metric.

**3. Tooltip (details-on-demand)**: Hovering any bar or bubble shows all five key stats for that major. This avoids cluttering the charts with text labels while still making the full data accessible. The tooltip always shows all metrics regardless of the active sort or view.

**4. Brushing & linking (advanced interaction)**: Dragging a rectangle in the scatter plot highlights the corresponding bars in the bar chart. This is the key interaction that ties the two views together — users can identify a cluster in the scatter plot (e.g., high-salary/high-unemployment majors) and immediately see which specific majors fall in that region and how they rank. A "Clear Brush" button resets the selection.

**5. Legend click (linked selection)**: Clicking a category in the legend filters both views to that category. This is faster than using the dropdown and makes the legend interactive rather than purely informational.

### Why These Interactions?

The interactions support two exploration modes:
- **Ranking mode**: Use the category filter and sort toggle to answer "which majors are highest/lowest in X?"
- **Correlation mode**: Use the scatter plot and brushing to answer "do high-paying majors have lower unemployment?" and "which majors are outliers?"

The brushing & linking interaction is the most powerful — it lets users fluidly move between the two modes without losing context.

---

## Development Process

### Team
Solo project.

### Time Breakdown (~14 hours total)

| Task | Hours |
|------|-------|
| Data exploration, sketching layout | 1.5 |
| D3 setup, data loading, bar chart | 2.5 |
| Category filter + sort interaction | 2.0 |
| Tooltip + statistics panel | 1.5 |
| Bug fixes (axis label, bar width) | 1.5 |
| Scatter plot implementation | 2.5 |
| Brushing & linking coordination | 2.0 |
| Write-up | 0.5 |

### Challenges

**Coordinating two views**: The trickiest part was keeping the bar chart and scatter plot in sync. Both views need to respond to the category filter, but only the bar chart responds to the sort toggle, and only the scatter plot has a brush. The solution was a single `render()` function that updates both views and a shared `filteredData` array that both views read from.

**Brushing & linking**: Implementing the brush required:
1. Defining stable x/y scales for the scatter plot (based on `filteredData`, not the brush selection)
2. Capturing the brush rectangle coordinates and converting them back to data values
3. Building a Set of major names that fall inside the brush
4. Applying a `.dimmed` class to bars and dots not in the Set

The key insight was using a Set for O(1) lookup rather than filtering the data arrays on every render.

**Dynamic axis updates**: Making the bar chart axis label, tick format, and bar width all update consistently when switching sort metrics required a `metricConfig` object that stores the label and tick formatter for each metric. This pattern kept the axis, bars, and button label in sync.

**D3 enter/update/exit with transitions**: Getting smooth transitions when both the bar order and bar width change simultaneously required using a key function (`d => d.Major`) in the data join. Without it, D3 reuses DOM elements in arbitrary order and the transitions animate to the wrong positions.

**Scatter plot scale stability**: The scatter plot scales need to stay stable during brushing — if the scales changed, the brush rectangle would move relative to the data. The solution was to base the scales on `filteredData` (which only changes when the category filter changes) rather than `brushedMajors`.

**Bubble size encoding**: The initial scatter plot used fixed-size dots, which made it hard to distinguish large majors (like Psychology) from small ones (like Petroleum Engineering). Adding a size encoding for total graduates revealed that large majors cluster in the middle of the salary distribution while small majors are more spread out.

### What I Learned

- Coordinating multiple views requires careful state management — a single source of truth (`filteredData`) and a single render function that updates all views
- Brushing & linking is powerful for exploration but requires stable scales and efficient lookup data structures (Set)
- A third visual encoding (bubble size) can reveal patterns that aren't visible with just x/y position
- D3's brush component handles the UI interaction, but the developer must manually convert brush coordinates to data selections

### Technologies Used
- D3.js v7 for visualization and brush interaction
- Vanilla JavaScript for state management
- CSS3 for styling and dimming effects
- GitHub Pages for hosting
