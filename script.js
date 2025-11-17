// Now we start with the cars dataset

// Resource to import https://d3-wiki.readthedocs.io/zh-cn/master/CSV/
d3.csv("cars.csv", function(data) {
return {
    Name: d.Name,
    Type: d.Type,
    AWD: +d.AWD,
    RWD: +d.RWD,
    RetailPrice: +d.RetailPrice,
    DealerCost: +d.DealerCost,
    EngineSizeInL: +d.EngineSizeInL,
    Cyl: +d.Cyl,
    Horsepower: +d.Horsepower,
    CityMilesPerGallon: +d.CityMilesPerGallon,
    HighwayMilesPerGallon: +d.HighwayMilesPerGallon,
    Weight: +d.Weight,
    WheelBase: +d.WheelBase,
    Len: +d.Len,
    Width: +d.Width
};
}, function(error, rows) {
    console.log(rows);
});



// example data for random cats ^^

const data = [
    { name: "Minka", age: 2, color: "black", weight: 4.2, agility: 8 },
    { name: "Tiger", age: 5, color: "orange", weight: 6.1, agility: 6 },
    { name: "Luna", age: 1, color: "white", weight: 3.5, agility: 9 },
    { name: "Nero", age: 3, color: "gray", weight: 5.0, agility: 7 },
    { name: "Molly", age: 4, color: "brown", weight: 4.8, agility: 5 },
    { name: "Simba", age: 6, color: "orange", weight: 6.5, agility: 4 },
    { name: "Cleo", age: 2, color: "white", weight: 3.9, agility: 8 },
    { name: "Felix", age: 7, color: "black", weight: 5.8, agility: 3 }
];

const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");
const margin = 50;


// setting the data

const x = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.age)])
    .range([margin, width - margin]);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.weight)])
    .range([height - margin, margin]);

const color = d3.scaleOrdinal()
    .domain(["black", "orange", "white", "grey", "brown"])
    .range(["#000", "#fff", "#ff8c00", "#888", "#8b4513"]);

const size = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.agility)])
    .range([0, 20])


svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin}, 0)`)
    .call(d3.axisLeft(y));

// text
svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("fill", "#ccc")
    .text("Age in years");

svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#ccc")
    .text("weight in kg");

const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => x(d.age))
    .attr("cy", d => y(d.weight))
    .attr("r", d => size(d.agility))
    .attr("fill", d => color(d.color))
    .on("mouseover", (event, d) => {
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip.html(`<strong>${d.name}</strong><br>
      Color: ${d.color}<br>
      Age: ${d.age}<br>
      Weight: ${d.weight} kg<br>
      Agility: ${d.agility}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 40) + "px");
    })
    .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0));