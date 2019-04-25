
var _ = require("underscore");
var GraphEdge = require("./GraphEdge.js");
var DjikstraSearchResult = require("./DjikstraSearchResult.js");
var PriorityQueue = require("./PriorityQueue.js");
var SparseGraph = require("./SparseGraph.js");

var GraphSearchDjikstra = function()
{

}

// add another peremeter to the function below
// should pass in a vehical type
// need to add money constraint
// needs to be able to compute the money it takes to make the whole whole trip
// need to find total cost of the trip (miles)

GraphSearchDjikstra.prototype.execute = function(graph,sourceIndex,targetIndex,veh_type)
{
	// this is for the vehicel information that is added by the user
	// var veh_types = [];
	// var veh_arg_MGP = [];
	// var mpg = 0;
	// var total_cost = 0;
	// veh_types.push('Sedan', 'SUV', 'Crossover', 'Coupe', 'Truck', 'Van');
	// veh_arg_MGP.push(37,20,30,34,19,20);
	// for(var i = 0; i < veh_types; i++){
	// 	if(veh_types[i] == veh_type){
	// 		mpg = veh_arg_MGP[i];
	// 	}else{
	// 		console.log("Error: " + veh_type + " is not an option or not available");
	// 		return;
	// 	}
	// }

	var priorityQueue = new PriorityQueue(function(a,b) {
		return a.priority - b.priority;
	},graph.numNodes());

	var shortestPathTree = _.times(graph.numNodes(),function(){ return 0; });
	var costToNode = _.times(graph.numNodes(),function(){ return 0; });
	var searchFrontier = _.times(graph.numNodes(),function(){ return 0; });

	priorityQueue.push(sourceIndex,0);
	searchFrontier[sourceIndex] = new GraphEdge(sourceIndex,sourceIndex,0);

// add time constraint and money constraint
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
	//var fuel_cost = (total_cost/mpg) * 2.50;

console.dir(searchFrontier);
	return new DjikstraSearchResult({
		graph: graph,
		source: sourceIndex,
		target: targetIndex,
		searchFrontier: searchFrontier
	});
}

module.exports = GraphSearchDjikstra;
