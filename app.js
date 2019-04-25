

var GraphFileReader = require("./GraphFileReader.js");
var SparseGraph = require("./SparseGraph.js");
var SimpleNode = require("./SimpleNode.js");
var GraphEdge = require("./GraphEdge.js");

var reader = new GraphFileReader();
var graph = reader.createFromFile(__dirname + "/data/cities.json",SparseGraph,SimpleNode,GraphEdge);

console.dir(graph);

var search;
var searchResult;
var pathToTarget;
var pathToTargetReadable;

var GraphSearchDjikstra = require("./GraphSearchDjikstra.js");

search = new GraphSearchDjikstra();
//
// this line will give the path starting from Nashville to Madison
//
searchResult = search.execute(graph,19,1);
//
pathToTarget = searchResult.getPathToTarget();
pathToTargetReadable = [];

pathToTarget.forEach(function(nodeIndex)
{
	pathToTargetReadable.push(graph.getNode(nodeIndex).label);
})

console.log("Djikstra");
console.dir(pathToTargetReadable);
