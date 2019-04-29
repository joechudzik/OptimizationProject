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

GraphSearchDjikstra.prototype.doIhaveEnough = function(graph, pathOut, pathBack, veh_type, money){

	var veh_types = [];
	var money_cost = [];
	var veh_arg_MGP = [];
	var mpg = 0;
	var total_cost = 0;
	var totalCostOut = 0;
	var totalCostBack = 0;

	for (var i = 1; i < pathOut.length; i++){
		totalCostOut = totalCostOut + (graph.getEdge(pathOut[i-1],pathOut[i]).getEdgeCost());
	}

	for (var i = 1; i < pathBack.length; i++){
		totalCostBack = totalCostBack + (graph.getEdge(pathBack[i-1],pathBack[i]).getEdgeCost());
	}

	total_cost = totalCostBack + totalCostOut;

	veh_types.push("Sedan", "SUV", "Crossover", "Coupe", "Truck", "Van");
	veh_arg_MGP.push(37,20,30,34,19,20);
	for(var i = 0; i < veh_types.length; i++){
		if(veh_types[i] == (veh_type)){
			mpg = veh_arg_MGP[i];
		}else if (i == veh_types.length){
			//console.warn();("Error: " + veh_type + " is not an option or not available");
			return "Vehicle type not available!";
		}
	}

	//console.log(total_cost);

	var gas_cost = (total_cost/mpg) * 2.50;
	gas_cost = Math.round(gas_cost);
	//console.log(gas_cost + " = " + total_cost + " / " + mpg + " * " + "2.50");

	if(money < gas_cost){
		//console.log("Not enough money for trip!");
		return "no";
	}else{
		//console.log("You have enough money to complete the trip!");
		return "yes";
	}
}

GraphSearchDjikstra.prototype.canIMakeIt = function(graph, pathOut, pathBack, daysOfTrip, hoursDriving, speed){
	var totalCostOut = 0;
	var totalCostBack = 0;

	var daysOut = daysOfTrip/2; // splitting the time in half (should take at most half the time for the whole trip to get there)
	var hoursDrivingOut = daysOut*hoursDriving; // total amount of driving hours for the user inputted time to get there

	var daysBack = daysOfTrip/2; // splitting the time in half (should take at most half the time for the whole trip to get there)
	var hoursDrivingBack = daysBack*hoursDriving; // total amount of driving hours for the user inputted time to get there

	for (var i = 1; i < pathOut.length; i++){
		totalCostOut = totalCostOut + (graph.getEdge(pathOut[i-1],pathOut[i]).getEdgeCost());
	}

	var hoursNeededDrivingOut = totalCostOut/speed;
	// testing if can make it there in time
	if (hoursDrivingOut < hoursNeededDrivingOut) {
		// if cant make it to destination with user inputted time constraints, figure out the amount of days needed for entire trip based on hours per day driving
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
			// if cant make it back to starting point with user inputted time constraints, figure out the amount of days needed for entire trip based on hours per day driving
			var daysNeeded = (2*totalCostBack)/(speed*hoursDriving);
			return ["Back", Math.round(hoursNeededDrivingBack), daysOfTrip, Math.ceil(daysNeeded), hoursDriving];
		}
		else {
			// everything is good and the user inputted time constraints check out. they can go on the trip and make it back to the starting point within the time constraints
			return ["Good", Math.round(hoursDrivingOut)];
		}
	}
}

module.exports = GraphSearchDjikstra;
