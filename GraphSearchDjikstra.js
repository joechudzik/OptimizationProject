var _ = require("underscore");
var GraphEdge = require("./GraphEdge.js");
var DjikstraSearchResult = require("./DjikstraSearchResult.js");
var PriorityQueue = require("./PriorityQueue.js");
var SparseGraph = require("./SparseGraph.js");

var GraphSearchDjikstra = function()
{

}

GraphSearchDjikstra.prototype.execute = function(graph,sourceIndex,targetIndex,veh_type)
{
	// this is for the vehicel information that is added by the user
	var veh_types = [];
	var veh_arg_MGP = [];
	var mpg = 0;
	var total_cost = 0;
	veh_types.push("Sedan", "SUV", "Crossover", "Coupe", "Truck", "Van");
	veh_arg_MGP.push(37,20,30,34,19,20);
	for(var i = 0; i < veh_types; i++){
		if(veh_types[i].equals(veh_type)){
			mpg = veh_arg_MGP[i];
		} else{
			console.log("Error: " + veh_type + " is not an option or not available");
			return;
		}
	}

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
				//total_cost = total_cost + newCost; // total distance of the trip
				searchFrontier[edgeFrom.to] = edgeFrom;
			}
		})
	}

	// formula for fuel_cost
	//var fuel_cost = (total_cost/mpg) + 2.50;

console.dir(searchFrontier);
	return new DjikstraSearchResult({
		graph: graph,
		source: sourceIndex,
		target: targetIndex,
		searchFrontier: searchFrontier
	});
}

GraphSearchDjikstra.prototype.canIMakeIt = function(graph, pathOut, pathBack, daysOfTrip, hoursDriving, speed){
	var totalCostOut = 0;
	var totalCostBack = 0;

	var daysOut = daysOfTrip/2;
	var hoursDrivingOut = daysOut*hoursDriving;

	var daysBack = daysOfTrip/2;
	var hoursDrivingBack = daysBack*hoursDriving;

	for (var i = 1; i < pathOut.length; i++){
		totalCostOut = totalCostOut + (graph.getEdge(pathOut[i-1],pathOut[i]).getEdgeCost());
	}

	var hoursNeededDrivingOut = totalCostOut/speed;
	// testing if can make it there in time
	if (hoursDrivingOut < hoursNeededDrivingOut) {
		var daysNeeded = (2*totalCostOut)/(speed*hoursDriving);
		return ["Out", Math.round(hoursNeededDrivingOut), daysOfTrip, Math.ceil(daysNeeded), hoursDriving];
	}
	// testing if can make it back in time in case return path is not the same
	else {
		for (var i = 1; i < pathBack.length; i++){
			totalCostBack = totalCostBack + (graph.getEdge(pathBack[i-1],pathBack[i]).getEdgeCost());
		}
		var hoursNeededDrivingBack = totalCostBack/speed;
		if (hoursDrivingBack < hoursNeededDrivingBack) {
			var daysNeeded = (2*totalCostBack)/(speed*hoursDriving);
			return ["Back", Math.round(hoursNeededDrivingBack), daysOfTrip, Math.ceil(daysNeeded), hoursDriving];
		}
		else {
			return ["Good", Math.round(hoursDrivingOut)];
		}
	}
}

module.exports = GraphSearchDjikstra;
