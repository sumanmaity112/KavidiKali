var CREATEGAMELIST;

function newGames(){
    /* global d3 */
    var diameter = 500,
        color = d3.scale.category20c();

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    d3.json("newGames", function(error, root) {
    if (error) throw error;
    
    if(JSON.stringify(CREATEGAMELIST) === JSON.stringify(root))
        return;
        
   $('#selectGame').html("");

    var svg = d3.select("#selectGame")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
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
            createGame(d.value,d.withBot);
        });
    
    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.withBot ? "Play with Bot" : "Multi-Player" });
      
    });

    function classes(root) {
    return {children: root};
    }
}

// d3.select(self.frameElement).style("height", diameter + "px");
