var legend_svg = d3.select(".legend_container svg svg"),
    svg = d3.select(".hiveChart_container svg svg"),
    svg2 = d3.select(".hiveChart_container3 svg svg"),
    svg3 = d3.select(".hiveChart_container4 svg svg"),
    svg4 = d3.select(".hiveChart_container4 svg svg"),
    margin = { top: 30, right: 0, bottom: 0, left: 0 },
    margin4 = { top: 50, right: 0, bottom: 0, left: 0 },
    margin5 = { top: 0, right: 0, bottom: 0, left: 0 },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    height2 = svg2.attr("height") - margin.top - margin.bottom,
    height3 = svg3.attr("height") - margin.top - margin.bottom;

var tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "toolTip");

var formatValue = d3.format(",d");

var x = d3.scaleLinear().rangeRound([0, height]);
var x2 = d3.scaleLinear().rangeRound([0, height2]);
var x3 = d3.scaleLinear().rangeRound([0, height3]);

var rectMap_color = d3
  .scaleLinear()
  .domain([0, 0.5, 0.8, 0.95, 1])
  .range(["#0c4b4a", "#3a5c74", "#7f658b", "#c26b86", "#ec7e6b"]);

var legend = legend_svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + 0 + ")");

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var g2 = svg2
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var g3 = svg3
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + 10 + ")");
var g4 = svg4
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + 0 + ")");

d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/4c306a79bff159bd2f3e62334d40693b/raw/5da0412bb6a71d87dd48a107674e675cfe1f03bf/Vac_aboveavg.csv",
  type,
  function(error, data) {
    if (error) throw error;

    x1 = x.domain([1, 0.94]);
    
    var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x1(d.value); }).strength(0.60))
      .force("y", d3.forceY(width / 2))
      .force("collision", d3.forceCollide().radius(function(d) { return d.Kindergarteners_with_Vaccination / 19; }))
      .stop();
    
    for (var i = 0; i < 240; ++i) simulation.tick();

    g.append("line")
      .attr("x1", 20)
      .attr("y1", -18)
      .attr("x2", 180)
      .attr("y2", -18)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
    g.append("line")
      .attr("x1", 20)
      .attr("y1", 69)
      .attr("x2", 180)
      .attr("y2", 69)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");

    g.append("line")
      .attr("x1", 20)
      .attr("y1", 158)
      .attr("x2", 180)
      .attr("y2", 158)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
    var cell = g.append("g")
      .attr("class", "cells  focus voronoi")
      .selectAll("g")
      .data(
        d3.voronoi()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; })
          .polygons(data.filter(function(d){return d.value >= 0.95;}))
      )
      .enter()
      .append("g");
    
    cell.append("circle")
      .attr("class", function(d){ return "one all_hl lowerLayer " + d.data.Type + " " + d.data.District.split(" ").join("_")})
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", function(d) { return rectMap_color(d.data.value); })
      .style("stroke-width", 0.5)
      .style("opacity", 1)
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; });
    
    cell.append("circle")
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", 'rgba(0,0,0,0)')
      .style("stroke-width", 0.5)
      .style("opacity", 1)
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; })
      .on("mousemove", function(d) {
        d3.select(this).style("stroke", 'rgba(0,0,0,1)')
        var w = window.innerWidth;
        var h = window.innerHeight;
        tooltip
          .style("display", "inline-block")
          .html( '<b>' + d.data.School + "</b><br/>" +
                       "<b>" + (d.data.value * 100) + "%"+ "</b>"+" Vaccination Rate" + "<br/>" +
                       "<b>" + (d.data.exempt * 100) + "%"+ "</b>"+" Exmemption Rate" + "<br/>" +
                       "<div class='tool_lighten'><em>School Size:" + d.data.Kindergarteners_with_Vaccination + "" + "<br/>" +
                       d.data.District + " schools district; " + d.data.id + " county; " + d.data.Type +
                       "</em></div>")
      if (d3.event.pageX < w / 2) {
      tooltip.style("left", d3.event.pageX + 15 + "px");
    } else {
      tooltip.style("left", d3.event.pageX - 235 + "px");
    }
      tooltip.style("top", d3.event.pageY - 70 + "px");
  })
      .on("mouseout", function(d) {
           d3.select(this).style("stroke", 'rgba(0,0,0,0)')
          tooltip.style("display", "none");});
    
    g.append("text")
      .attr("x", 20)
      .attr("y", -20)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("100% Vaccination  Rate");
    
    g.append("text")
      .attr("x", 20)
      .attr("y", 66)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("98%");

    g.append("text")
      .attr("x", 20)
      .attr("y", 155)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("95% (Herd Immunity)");
   
    
  }
);

function type(d) {
  if (!d.value) return;
  d.value = +d.value;
  return d;
}
    function showPrivate() {
      if($( ".private_hl" ).hasClass( "active" )){
        d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".Private").style("opacity", 1)
        $( ".private_hl" ).removeClass( "active" )
         } else{
           $( ".highlight" ).removeClass( "active" )
           d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".lowerLayer").style("opacity", 0.2)
        d3.selectAll(".Private").style("opacity", 1) 
        $( ".private_hl" ).addClass( "active" );
         }
}

    function showOKCity() {
      if($( ".OKCity_hl" ).hasClass( "active" )){
        d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".OKLAHOMA_CITY").style("opacity", 1)
        $( ".OKCity_hl" ).removeClass( "active" )
         } else{
        $( ".highlight" ).removeClass( "active" )
           d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".lowerLayer").style("opacity", 0.2)
        d3.selectAll(".OKLAHOMA_CITY").style("opacity", 1) 
        $( ".OKCity_hl" ).addClass( "active" );
         }
}

    function showTulsa() {
      if($( ".TULSA_hl" ).hasClass( "active" )){
        d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".TULSA").style("opacity", 1)
        $( ".TULSA_hl" ).removeClass( "active" )
         } else{
        $( ".highlight" ).removeClass( "active" )
           d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".lowerLayer").style("opacity", 0.2)
        d3.selectAll(".TULSA").style("opacity", 1) 
        $( ".TULSA_hl" ).addClass( "active" );
         }
}

   function showPrivate2() {
      if($( ".private_hl_2" ).hasClass( "active" )){
        d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".Private").style("opacity", 1)
        $( ".private_hl_2" ).removeClass( "active" )
         } else{
           $( ".highlight" ).removeClass( "active" )
           d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".lowerLayer2").style("opacity", 0.2)
        d3.selectAll(".Private").style("opacity", 1) 
        $( ".private_hl_2" ).addClass( "active" );
         }
}

   function no_exempion() {
      if($( ".exempt_hl" ).hasClass( "active" )){
        d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".e0").style("opacity", 1)
        $( ".exempt_hl" ).removeClass( "active" )
         } else{
           $( ".highlight" ).removeClass( "active" )
           d3.selectAll(".all_hl").style("opacity", 1)
        d3.selectAll(".lowerLayer3").style("opacity", 0.2)
        d3.selectAll(".e0").style("opacity", 1) 
        $( ".exempt_hl" ).addClass( "active" );
         }
}



d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/33676361422c298988b0d0bfef627085/raw/2395b4bdc215ca4258118d16be1f7a3dc19ef85c/vac_rate_med.csv",
  type,
  function(error2, data2) {
    if (error2) throw error2;
    
    x2 = x2.domain([0.95, 0.79]);
    
    var simulation2 = d3.forceSimulation(data2)
      .force("x", d3.forceX(function(d) { return x2(d.value); }).strength(0.60))
      .force("y", d3.forceY(width / 2))
      .force("collision", d3.forceCollide().radius(function(d) { return d.Kindergarteners_with_Vaccination / 19; }))
      .stop();
    
    for (var i2 = 0; i2 < 240; ++i2) simulation2.tick();
    
    g2.append("line")
      .attr("x1", 20)
      .attr("y1", 95)
      .attr("x2", 180)
      .attr("y2", 95)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
        g2.append("text")
      .attr("x", 20)
      .attr("y", 93)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("90%");

    g2.append("line")
      .attr("x1", 20)
      .attr("y1", 180)
      .attr("x2", 180)
      .attr("y2", 180)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
        g2.append("text")
      .attr("x", 20)
      .attr("y", 178)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("85%");
    
        g2.append("line")
      .attr("x1", 20)
      .attr("y1", 260)
      .attr("x2", 180)
      .attr("y2", 260)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
        g2.append("text")
      .attr("x", 20)
      .attr("y", 258)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("80%");
    
    var cell2 = g2.append("g")
      .attr("class", "cells  focus voronoi")
      .selectAll("g")
      .data(
        d3.voronoi()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; })
          .polygons(data2)
      )
      .enter()
      .append("g");
    
    cell2.append("circle")
      .attr("class", function(d){ return "all_hl lowerLayer2 " + d.data.Type})
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", function(d) { return rectMap_color(d.data.value); })
      .style("stroke-width", 0.5)
      .style("opacity", 1)
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; });
 
        cell2.append("circle")
      .attr("class", function(d){ return d.data.Type})
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", 'rgba(0,0,0,0)')
      .style("stroke-width", 0.5)
      //.style("stroke", 'rgba(0,0,0,1)')
      .style("opacity", 1)
      //.attr("display", "none")
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; })

      .on("mousemove", function(d) {
        d3.select(this).style("stroke", 'rgba(0,0,0,1)')
    var w = window.innerWidth;
    var h = window.innerHeight;
    tooltip
      .style("display", "inline-block")
      .html( '<b>' + d.data.School + "</b><br/>" +
                       "<b>" + (d.data.value * 100) + "%"+ "</b>"+" Vaccination Rate" + "<br/>" +
                       "<b>" + (d.data.exempt * 100) + "%"+ "</b>"+" Exmemption Rate" + "<br/>" +
                       "<div class='tool_lighten'><em>School Size:" + d.data.Kindergarteners_with_Vaccination + "" + "<br/>" +
                       d.data.District + " schools district; " + d.data.id + " county; " + d.data.Type +
                       "</em></div>")
    if (d3.event.pageX < w / 2) {
      tooltip.style("left", d3.event.pageX + 15 + "px");
    } else {
      tooltip.style("left", d3.event.pageX - 235 + "px");
    }
      tooltip.style("top", d3.event.pageY - 70 + "px");
    
  })
      .on("mouseout", function(d) {
           d3.select(this).style("stroke", 'rgba(0,0,0,0)')
          tooltip.style("display", "none");});
    
     
    
  }
);


d3.csv(
  "https://gist.githubusercontent.com/JesseCHowe/eeb6b6022387ca757d4ac9ef820429ac/raw/5b43db1917ccca03f292cc4118f2d408e991f239/vac_rate_low.csv",
  type,
  function(error3, data3) {
    if (error3) throw error3;
    
    x3 = x3.domain([0.80, 0]);
    
    var simulation3 = d3.forceSimulation(data3)
      .force("x", d3.forceX(function(d) { return x3(d.value); }).strength(2))
      .force("y", d3.forceY(width / 2))
      .force("collision", d3.forceCollide().radius(function(d) { return d.Kindergarteners_with_Vaccination / 19; }))
      .stop();
    
    for (var i3 = 0; i3 < 240; ++i3) simulation3.tick();

    g3.append("line")
      .attr("x1", 20)
      .attr("y1", 42)
      .attr("x2", 180)
      .attr("y2", 42)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
        g3.append("text")
      .attr("x", 20)
      .attr("y", 40)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("70%");
    
    g3.append("line")
      .attr("x1", 20)
      .attr("y1", 82)
      .attr("x2", 180)
      .attr("y2", 82)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 80)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("60%");
    
        g3.append("line")
      .attr("x1", 20)
      .attr("y1", 122)
      .attr("x2", 180)
      .attr("y2", 122)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 120)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("50%");
    
            g3.append("line")
      .attr("x1", 20)
      .attr("y1", 162)
      .attr("x2", 180)
      .attr("y2", 162)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 160)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("40%");
    
                g3.append("line")
      .attr("x1", 20)
      .attr("y1", 202)
      .attr("x2", 180)
      .attr("y2", 202)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 200)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("30%");
    
                    g3.append("line")
      .attr("x1", 20)
      .attr("y1", 242)
      .attr("x2", 180)
      .attr("y2", 242)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 240)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("20%");
    
                        g3.append("line")
      .attr("x1", 20)
      .attr("y1", 282)
      .attr("x2", 180)
      .attr("y2", 282)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
         g3.append("text")
      .attr("x", 20)
      .attr("y", 280)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("10%");
    
                            g3.append("line")
      .attr("x1", 20)
      .attr("y1", 322)
      .attr("x2", 180)
      .attr("y2", 322)
      .attr("stroke-width", 0.2)
      .attr( "stroke-dasharray", 2)
      .attr("stroke", "#000");
    
         g3.append("text")
      .attr("x", 20)
      .attr("y", 320)
      .attr("class", "movie-labels")
      .style("text-anchor", "start")
      .html("0%");
    
    var cell3 = g3.append("g")
      .attr("class", "cells  focus voronoi")
      .selectAll("g")
      .data(
        d3.voronoi()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; })
          .polygons(data3)
      )
      .enter()
      .append("g");
    
    cell3.append("circle")
      .attr("class", function(d){ return "all_hl lowerLayer3 "+ d.data.Type + " e" + d.data.exempt})
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", function(d) { return rectMap_color(d.data.value); })
      .style("stroke-width", 0.5)
      .style("opacity", 1)
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; });
 
        cell3.append("circle")
      .attr("class", function(d){ return d.data.Type})
      .attr("r", function(d) { return d.data.Kindergarteners_with_Vaccination / 20; })
      .style("fill", 'rgba(0,0,0,0)')
      .style("stroke-width", 0.5)
      //.style("stroke", 'rgba(0,0,0,1)')
      .style("opacity", 1)
      //.attr("display", "none")
      .attr("cx", function(d) { return d.data.y; })
      .attr("cy", function(d) { return d.data.x; })

      .on("mousemove", function(d) {
        d3.select(this).style("stroke", 'rgba(0,0,0,1)')
    var w = window.innerWidth;
    var h = window.innerHeight;
    tooltip
      .style("display", "inline-block")
      .html( '<b>' + d.data.School + "</b><br/>" +
                       "<b>" + (d.data.value * 100) + "%"+ "</b>"+" Vaccination Rate" + "<br/>" +
                       "<b>" + (d.data.exempt * 100) + "%"+ "</b>"+" Exmemption Rate" + "<br/>" +
                       "<div class='tool_lighten'><em>School Size:" + d.data.Kindergarteners_with_Vaccination + "" + "<br/>" +
                       d.data.District + " schools district; " + d.data.id + " county; " + d.data.Type +
                       "</em></div>")
    if (d3.event.pageX < w / 2) {
      tooltip.style("left", d3.event.pageX + 15 + "px");
    } else {
      tooltip.style("left", d3.event.pageX - 235 + "px");
    }
      tooltip.style("top", d3.event.pageY - 70 + "px");
    
  })
      .on("mouseout", function(d) {
           d3.select(this).style("stroke", 'rgba(0,0,0,0)')
          tooltip.style("display", "none");});

  }
);