// College Majors Interactive Visualization - Observable Notebook

// Title and description
md`# College Majors: Salary, Employment & Gender

Explore outcomes for recent graduates across different majors using FiveThirtyEight data.`

// Category filter dropdown
viewof category = {
  const sel = html`<select>
    <option value="all">All Categories</option>
    ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
  </select>`;
  sel.dispatchEvent(new CustomEvent("input"));
  return sel;
}

// Sort metric dropdown
viewof sortMetric = {
  const sel = html`<select>
    <option value="Median">Median Salary</option>
    <option value="Unemployment_rate">Unemployment Rate</option>
    <option value="ShareWomen">% Women</option>
    <option value="Total">Total Graduates</option>
  </select>`;
  sel.dispatchEvent(new CustomEvent("input"));
  return sel;
}

// Statistics panel
md`### Summary Statistics`

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

// Main chart
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

  // Scales
  const x = d3.scaleLinear()
    .domain([0, d3.max(sortedData, d => d.Median)])
    .range([0, innerWidth]);

  const y = d3.scaleBand()
    .domain(sortedData.map(d => d.Major))
    .range([0, innerHeight])
    .padding(0.2);

  const color = d3.scaleOrdinal(d3.schemeTableau10);

  // Axes
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

  // Bars
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

  // Legend
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

// Data processing
filteredData = category === "all" 
  ? data 
  : data.filter(d => d.Major_category === category)

sortedData = [...filteredData]
  .sort((a, b) => b[sortMetric] - a[sortMetric])
  .slice(0, 30)

categories = [...new Set(data.map(d => d.Major_category))].sort()

// Load data
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

// Import D3
d3 = require("d3@7")
