

var GraphEdge = function(from,to,cost)
{
	this.from = from;
	this.to = to;
	this.cost = cost || 1;
}

module.exports = GraphEdge;