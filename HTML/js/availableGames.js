var AVAILABLEGAMESLIST;

function updateAvailableGames(){
    /* global d3 */
    var diameter = 650,
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    d3.json("availableGame", function(error, root) {
    if (error) throw error;
    
    if(JSON.stringify(AVAILABLEGAMESLIST) === JSON.stringify(root))
        return;
        
   d3.select("#availableGames").selectAll("svg").remove()

    var svg = d3.select("#availableGames")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");
     
    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d,i) { return color(i); })
        .on("click",function(d) {
            joinGame(d.gameId);
        });
    
    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.gameId.substring(0, d.r / 3); });
      
    });

    function classes(root) {
    return {children: root};
    }
}

// d3.select(self.frameElement).style("height", diameter + "px");
