var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 50,
    bottom: 60,
    left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG WRAPPER 
// appending svg that will hold the chart
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import csv data using path 
d3.csv("/assets/data/data.csv").then(function (stateData) {

    // parse data as numeric
    stateData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // initiate scaling by creating a scale function
    var xLinearScale = d3.scaleLinear()
        .domain([9, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([4, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    // axis fucntions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append axis to chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "white");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
        .attr("x", function (d) {
            return xLinearScale(d.poverty);
        })
        .attr("y", function (d) {
            return yLinearScale(d.healthcare - .02);
        })
        .text(function (d) {
            return d.abbr
        });

    // Initalize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("pointer-events", "none")
        .html(function (d) {
            return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });
    // create tooltip in chartgroup
    chartGroup.call(toolTip);

    // add a mouseover event to show tootltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // mouseout event listener to hide tooltip
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });

    // create axis labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");


    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});