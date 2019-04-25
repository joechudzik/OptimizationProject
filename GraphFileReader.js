var fs = require("fs");

var GraphFileReader = function()
{

}

GraphFileReader.prototype.createFromFile = function(filePath,graphClass,nodeClass,edgeClass)
{
	var fileContents = fs.readFileSync(filePath);
	var graphData = JSON.parse(fileContents);
	var nodeData = graphData.nodes;
	var edgeData = graphData.edges;

	var graph = new graphClass();
	var nodeIndex = 0;
	var nodeLookup = {};

	nodeData.forEach(function(nodeObj)
	{
		var node = new nodeClass(nodeIndex,nodeObj);
		graph.addNode(node);

		nodeLookup[nodeObj] = node;
		nodeIndex++;
	});

	edgeData.forEach(function(edgeObj)
	{
		var fromNode = nodeLookup[edgeObj.from];
		var toNode = nodeLookup[edgeObj.to];
		var edgeCost = edgeObj.cost || 1;

		var edge = new edgeClass(fromNode.index,toNode.index,edgeCost);
		graph.addEdge(edge);
	})

	return graph;
}

module.exports = GraphFileReader;
