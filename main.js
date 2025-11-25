window.onload = () => {

    d3.csv("cars.csv", d => ({
        Name: d["Name"],
        Type: d["Type"],
        AWD: +d["AWD"],
        RWD: +d["RWD"],
        RetailPrice: +d["Retail Price"],
        DealerCost: +d["Dealer Cost"],
        EngineSizeInL: +d["Engine Size (l)"],
        Cyl: +d["Cyl"],
        Horsepower: +d["Horsepower(HP)"],
        CityMilesPerGallon: +d["City Miles Per Gallon"],
        HighwayMilesPerGallon: +d["Highway Miles Per Gallon"],
        Weight: +d["Weight"],
        WheelBase: +d["Wheel Base"],
        Len: +d["Len"],
        Width: +d["Width"]
    })).then(data => {

        const width = 940;
        const height = 500;
        const marginTop = 20;
        const marginRight = 50;
        const marginBottom = 200;
        const marginLeft = 120;

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Horsepower)])
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.RetailPrice)])
            .range([height - marginBottom, marginTop]);

        const color = d3.scaleOrdinal()
            .domain(["Sedan", "Minivan", "Wagon", "SUV", "Sports Car"])
            .range(["#1EC949", "#9E1EC9", "#C91E49", "#1E49C9", "#C99E1E"]);

        const size = d3.scaleLinear()
            .domain(d3.extent(data, d => d.Cyl))
            .range([4, 15]);

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const legend = svg.append("g")
            .attr("transform", `translate(${width / 2 - 120}, ${height - marginBottom + 90})`);

        const categories = color.domain();

        legend.selectAll("legend-item")
            .data(categories)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${i * 110}, 0)`)
            .each(function(d) {

                d3.select(this)
                    .append("rect")
                    .attr("width", 14)
                    .attr("height", 14)
                    .attr("fill", color(d))
                    .attr("stroke", "#333");

                d3.select(this)
                    .append("text")
                    .attr("x", 20)
                    .attr("y", 11)
                    .style("font-size", "12px")
                    .style("alignment-baseline", "middle")
                    .text(d);
            });

        const sizeLegendValues = [d3.min(data, d => d.Cyl),
            d3.median(data, d => d.Cyl),
            d3.max(data, d => d.Cyl)];

        const sizeLegend = svg.append("g")
            .attr("transform", `translate(${width - marginRight - 700}, ${marginTop})`);

        sizeLegend.selectAll("legend-size")
            .data(sizeLegendValues)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${i * 30})`)
            .each(function(d) {
                d3.select(this)
                    .append("circle")
                    .attr("r", size(d))
                    .attr("fill", "#999")
                    .attr("stroke", "#333");

                d3.select(this)
                    .append("text")
                    .attr("x", 25)
                    .attr("y", 5)
                    .text(d + " Cyl");
            });


        // Achsen
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y));

        // Achsentitel
        svg.append("text")
            .attr("x", width / 2 + 130)
            .attr("y", height - 150)
            .text("Horsepower in ps");

        svg.append("text")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .text("Retail price");

        // Tooltip erzeugen
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("padding", "6px")
            .style("background", "#eee")
            .style("border", "1px solid #aaa")
            .style("border-radius", "4px")
            .style("opacity", 0);

        // Punkte zeichnen
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")          // fehlend!
            .attr("class", "dot")
            .attr("cx", d => x(d.Horsepower))
            .attr("cy", d => y(d.RetailPrice))
            .attr("r", d => size(d.Cyl))
            .attr("fill", d => color(d.Type))   // color, nicht type!
            .on("mouseover", (event, d) => {
                tooltip.transition().duration(100).style("opacity", 1);
                tooltip.html(`
                    <strong>${d.Name}</strong>
                    <br>Engine Size: ${d.EngineSizeInL}
                    <br>Dealer Cost: ${d.DealerCost}
                    <br>Cylinder: ${d.Cyl}
                    <br>City MPG: ${d.CityMilesPerGallon}
                    <br>Highway MPG: ${d.HighwayMilesPerGallon}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 40) + "px");
            })
            .on("mouseout", () => tooltip.transition().duration(200).style("opacity", 0));

        document.body.appendChild(svg.node());
    });
};
