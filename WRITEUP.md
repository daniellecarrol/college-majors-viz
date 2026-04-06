# College Majors Interactive Visualization — Write-up

## Design Rationale

### The Question
This visualization explores a single compelling question: **how do salary, unemployment, and gender distribution vary across college majors?** The FiveThirtyEight recent-grads dataset has 173 majors with clean numeric fields, making it well-suited for ranked comparison.

### Visual Encodings

**Horizontal bar chart**: Bar length is the most accurate visual encoding for quantitative comparison. A horizontal layout was chosen specifically because major names are long — rotating them on a vertical chart would make them unreadable. Showing the top 30 majors per sort keeps the chart dense enough to be interesting without becoming overwhelming.

**Color by major category**: Color encodes the academic category (Engineering, Business, Arts, etc.) rather than any quantitative value. This was a deliberate choice — it lets users spot category-level patterns at a glance (e.g., Engineering dominates the top of the salary ranking) without requiring a second axis. D3's Tableau10 scheme was chosen because it has 10 visually distinct colors that work well for categorical data.

**Dynamic bar width**: The bar width always encodes whichever metric is currently being sorted by. An earlier version always showed salary on the x-axis regardless of sort order, which created a confusing mismatch — bars would re-rank by unemployment rate but still show salary widths. Fixing this so the axis, tick labels, and bar widths all update together makes the chart honest and easier to read.

**Alternatives considered**:
- A scatter plot of salary vs. unemployment would show correlation between the two, but makes it hard to identify individual majors and requires the user to already know what they're looking for.
- A grouped bar chart showing multiple metrics simultaneously was prototyped but created too much visual clutter at 30 bars.

### Interaction Techniques

**1. Category filter (dynamic query)**: A dropdown filters the dataset to a single academic category. This was the most important interaction to include — the full 173-major view is too dense to draw conclusions from, and users typically have a specific field in mind. Filtering to Engineering or Arts immediately reveals within-category patterns that are invisible in the full view.

**2. Sort toggle (sorting)**: A button cycles through four sort metrics: Median Salary, Unemployment Rate, % Women, and Total Graduates. Sorting is the most direct way to answer ranking questions ("which majors have the highest unemployment?"). Cycling through metrics with a single button keeps the UI minimal while still exposing four different views of the data.

**3. Tooltip (details-on-demand)**: Hovering a bar shows all five key stats for that major. This avoids cluttering the chart with text labels while still making the full data accessible. The tooltip always shows all metrics regardless of the active sort, so users can compare across dimensions for a single major.

**4. Summary statistics panel**: Four aggregate stats (count, avg salary, avg unemployment, avg % women) update whenever the filter changes. This gives users an overview of the filtered subset and makes it easy to compare categories at a high level — for example, noticing that Arts majors have a higher average unemployment than Engineering majors without needing to read individual bars.

---

## Development Process

### Team
Solo project.

### Time Breakdown (~10 hours total)

| Task | Hours |
|------|-------|
| Data exploration, sketching layout | 1.5 |
| D3 setup, data loading, bar chart | 2.5 |
| Category filter + sort interaction | 2.0 |
| Tooltip + statistics panel | 1.5 |
| Bug fixes (axis label, bar width) | 1.5 |
| Write-up | 1.0 |

### Challenges

**Dynamic axis updates**: The trickiest part was making the axis label, tick format, and bar width all update consistently when switching sort metrics. The initial implementation only updated the bar order but kept the x-axis showing salary values — so bars sorted by unemployment rate still had dollar-sign tick labels. The fix was a `metricConfig` object that stores the label and tick formatter for each metric, and passing the active config into every axis and bar update.

**D3 enter/update/exit with transitions**: Getting smooth transitions when both the bar order and bar width change simultaneously required using a key function (`d => d.Major`) in the data join. Without it, D3 reuses DOM elements in arbitrary order and the transitions animate to the wrong positions.

**Axis accumulation**: SVG elements persist unless explicitly removed. Early on, each call to `updateVisualization()` appended new axis elements on top of old ones, causing bold/doubled axes after the first interaction. The fix was to select and remove all `.axis` elements at the start of each update.

**Showing top 30 vs. all 173**: Rendering all 173 majors made the y-axis labels illegible and the chart too tall to be useful. Capping at 30 per sort/filter keeps the chart readable. The tradeoff is that some majors are never visible in the "All Categories" view, but they become visible when their category is filtered.

### What I Learned
- D3's data join key function is essential for correct transitions when data order changes
- Encoding the active metric in both the axis and bar width is necessary for the chart to be honest
- A `metricConfig` lookup object is a clean pattern for managing multiple display formats in one place
