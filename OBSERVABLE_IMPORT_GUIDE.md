# How to Import to Observable Notebook

## Method 1: Copy & Paste (Recommended - Easiest)

1. **Go to Observable**: https://observablehq.com/
2. **Create New Notebook**: Click "New" → "Notebook"
3. **Copy cells one by one** from `observable-notebook.js` in this order:

### Cell Order:

**Cell 1 - Title:**
```js
md`# College Majors: Salary, Employment & Gender

Explore outcomes for recent graduates across different majors using FiveThirtyEight data.`
```

**Cell 2 - Load Data:**
```js
data = {
  const raw = await d3.csv("https://raw.githubusercontent.com/fivethirtyeight/data/master/college-majors/recent-grads.csv");
  return raw.map(d => ({
    ...d,
    Median: +d.Median,
    Unemployment_rate: +d.Unemployment_rate,
    ShareWomen: +d.ShareWomen,
    Total: +d.Total,
    Employed: +d.Employed
  }));
}
```

**Cell 3 - Extract Categories:**
```js
categories = [...new Set(data.map(d => d.Major_category))].sort()
```

**Cell 4 - Category Filter:**
```js
viewof category = Inputs.select(
  ["all", ...categories],
  {
    label: "Major Category",
    format: d => d === "all" ? "All Categories" : d
  }
)
```

**Cell 5 - Sort Control:**
```js
viewof sortMetric = Inputs.select(
  [
    {label: "Median Salary", value: "Median"},
    {label: "Unemployment Rate", value: "Unemployment_rate"},
    {label: "% Women", value: "ShareWomen"},
    {label: "Total Graduates", value: "Total"}
  ],
  {
    label: "Sort By",
    format: d => d.label,
    value: {label: "Median Salary", value: "Median"}
  }
)
```

**Cell 6 - Filter Data:**
```js
filteredData = category === "all" 
  ? data 
  : data.filter(d => d.Major_category === category)
```

**Cell 7 - Sort Data:**
```js
sortedData = [...filteredData]
  .sort((a, b) => b[sortMetric.value] - a[sortMetric.value])
  .slice(0, 30)
```

**Cell 8 - Statistics Panel:**
```js
html`<div style="display: flex; gap: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; margin: 20px 0;">
  <div style="flex: 1;">
    <div style="font-size: 24px; font-weight: 700; color: #0066cc;">${filteredData.length}</div>
    <div style="font-size: 12px; color: #666; text-transform: uppercase;">Majors Shown</div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 24px; font-weight: 700; color: #0066cc;">$${Math.round(d3.mean(filteredData, d => d.Median)).toLocaleString()}</div>
    <div style="font-size: 12px; color: #666; text-transform: uppercase;">Avg Median Salary</div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 24px; font-weight: 700; color: #0066cc;">${(d3.mean(filteredData, d => d.Unemployment_rate) * 100).toFixed(1)}%</div>
    <div style="font-size: 12px; color: #666; text-transform: uppercase;">Avg Unemployment</div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 24px; font-weight: 700; color: #0066cc;">${(d3.mean(filteredData, d => d.ShareWomen) * 100).toFixed(1)}%</div>
    <div style="font-size: 12px; color: #666; text-transform: uppercase;">Avg % Women</div>
  </div>
</div>`
```

**Cell 9 - Chart:**
```js
chart = {
  const margin = {top: 20, right: 120, bottom: 60, left: 200};
  const width = 960;
  const height = 600;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.Median)])
    .range([0, innerWidth]);

  const y = d3.scaleBand()
    .domain(sortedData.map(d => d.Major))
    .range([0, innerHeight])
    .padding(0.2);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d => "$" + d/1000 + "k"))
    .style("font-size", "11px");

  g.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "11px");

  g.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("font-weight", "600")
    .text("Median Salary");

  g.selectAll(".bar")
    .data(sortedData)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => y(d.Major))
    .attr("width", d => x(d.Median))
    .attr("height", y.bandwidth())
    .attr("fill", d => color(d.Major_category))
    .style("cursor", "pointer")
    .append("title")
    .text(d => `${d.Major}
Category: ${d.Major_category}
Median Salary: $${d.Median.toLocaleString()}
Unemployment: ${(d.Unemployment_rate * 100).toFixed(1)}%
Women: ${(d.ShareWomen * 100).toFixed(1)}%
Total Grads: ${d.Total.toLocaleString()}`);

  const categories = [...new Set(sortedData.map(d => d.Major_category))];
  const legend = g.selectAll(".legend")
    .data(categories)
    .join("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(${innerWidth + 10}, ${i * 20})`);

  legend.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d => color(d));

  legend.append("text")
    .attr("x", 18)
    .attr("y", 10)
    .style("font-size", "11px")
    .text(d => d);

  return svg.node();
}
```

4. **Publish**: Click "Publish" in top right
5. **Share**: Copy the URL to submit

## Method 2: Import from GitHub

1. Push the `observable-notebook.js` file to a GitHub repository
2. In Observable, click "New" → "Import"
3. Paste your GitHub file URL
4. Observable will attempt to parse it (may need manual adjustments)

## Method 3: Use Observable's File Attachment

If you want to use the standalone HTML:
1. Create new notebook
2. Add a cell with:
```js
html`<iframe src="URL_TO_YOUR_GITHUB_PAGES" width="100%" height="800" frameborder="0"></iframe>`
```

## Tips for Observable

- **D3 is built-in**: No need to import d3, it's available by default
- **Inputs library**: `@observablehq/inputs` is also built-in
- **Reactive cells**: When you change `category` or `sortMetric`, dependent cells auto-update
- **Cell order doesn't matter**: Observable figures out dependencies automatically
- **Use `viewof`**: This makes inputs reactive

## Testing

After creating the notebook:
1. Try changing the category dropdown
2. Try changing the sort metric
3. Hover over bars to see tooltips
4. Check that statistics update

## Troubleshooting

- **"data is not defined"**: Make sure the data cell runs first (it should automatically)
- **No chart showing**: Check browser console for errors
- **Inputs not working**: Make sure you used `viewof` keyword
- **Slow loading**: The CSV has 173 rows, should load in 1-2 seconds

## Example Observable Notebooks for Reference

- https://observablehq.com/@d3/bar-chart
- https://observablehq.com/@observablehq/input-select
- https://observablehq.com/@d3/color-schemes
