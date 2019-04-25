

var GraphEdge = function(from,to,cost)
{
	this.from = from;
	this.to = to;
	this.cost = cost || 1;
}

GraphEdge.prototype.getEdgeCost = function(){
	return this.cost;
}

module.exports = GraphEdge;
