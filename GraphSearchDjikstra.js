var _ = require("underscore");
var GraphEdge = require("./GraphEdge.js");
var DjikstraSearchResult = require("./DjikstraSearchResult.js");
var PriorityQueue = require("./PriorityQueue.js");
var SparseGraph = require("./SparseGraph.js");

var GraphSearchDjikstra = function()
{

}

GraphSearchDjikstra.prototype.execute = function(graph,sourceIndex,targetIndex)
{
	var priorityQueue = new PriorityQueue(function(a,b) {
		return a.priority - b.priority;
	},graph.numNodes());

	var shortestPathTree = _.times(graph.numNodes(),function(){ return 0; });
	var costToNode = _.times(graph.numNodes(),function(){ return 0; });
	var searchFrontier = _.times(graph.numNodes(),function(){ return 0; });

	priorityQueue.push(sourceIndex,0);
	searchFrontier[sourceIndex] = new GraphEdge(sourceIndex,sourceIndex,0);

	while (priorityQueue.length > 0)
	{
		var closestNodeIndex = priorityQueue.pop();
		shortestPathTree[closestNodeIndex] = searchFrontier[closestNodeIndex];

		if (closestNodeIndex == targetIndex)
			break;

		graph.getEdgesFrom(closestNodeIndex).forEach(function(edgeFrom)
		{
			var newCost = costToNode[closestNodeIndex] + edgeFrom.cost;

			if (searchFrontier[edgeFrom.to] == 0)
			{
				costToNode[edgeFrom.to] = newCost;
				priorityQueue.push(edgeFrom.to,newCost);
				searchFrontier[edgeFrom.to] = edgeFrom;
			}
			else if ( (newCost < costToNode[edgeFrom.to]) && (shortestPathTree[edgeFrom.to] == 0))
			{
				costToNode[edgeFrom.to] = newCost;
				priorityQueue.changePriority(edgeFrom.to,newCost);
				searchFrontier[edgeFrom.to] = edgeFrom;
			}
		})
	}
console.dir(searchFrontier);
	return new DjikstraSearchResult({
		graph: graph,
		source: sourceIndex,
		target: targetIndex,
		searchFrontier: searchFrontier
	});
}

GraphSearchDjikstra.prototype.canIMakeIt = function(graph, pathOut, pathBack, daysOfTrip, hoursDriving, speed){
	var totalCost = 0;
	var totalCostArray = [];

	var daysOut = daysOfTrip/2;
	var hoursDrivingOut = daysOut*hoursDriving;

	var daysBack = daysOfTrip/2;
	var hoursDrivingBack = daysBack*hoursDriving;

	for (var i = 1; i < pathOut.length; i++){
		totalCostArray.push(graph.getEdge(pathOut[i-1],pathOut[i]).getEdgeCost());
		totalCost = totalCost + (graph.getEdge(pathOut[i-1],pathOut[i]).getEdgeCost());
	}

	var hoursNeededDrivingOut = totalCost/speed;
	if (hoursDrivingOut < hoursNeededDrivingOut) {
		// print "we suggest at least (hoursNeededDrivingOut) hours to get there"
		return ["False", Math.round(hoursNeededDrivingOut), daysOfTrip];
	}
	else {
		// print "you should get there just fine"
		return ["True", Math.round(hoursDrivingOut)];
	}

	for (var i = 1; i < pathBack.length; i++){
		totalCostArray.push(graph.getEdge(pathBack[i-1],pathBack[i]).getEdgeCost());
		totalCost = totalCost + (graph.getEdge(pathBack[i-1],pathBack[i]).getEdgeCost());
	}



	return [totalCostArray, totalCost];
}

module.exports = GraphSearchDjikstra;
