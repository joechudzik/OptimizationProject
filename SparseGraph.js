

var SparseGraph = function()
{
	this.nodes = [];
	this.edges = {};
	this.edgesFrom = {};
}

SparseGraph.prototype.addNode = function(node)
{
	this.nodes[node.index] = node;
}

SparseGraph.prototype.getNode = function(index)
{
	return this.nodes[index];
}

SparseGraph.prototype.addEdge = function(edge)
{
	this.edges[this.getEdgeKey(edge.from,edge.to)] = edge;

	if (!this.edgesFrom[edge.from])
		this.edgesFrom[edge.from] = [];

	this.edgesFrom[edge.from].push(edge);
}

SparseGraph.prototype.getEdge = function(from,to)
{
	return this.edges[this.getEdgeKey(from,to)];
}

SparseGraph.prototype.getEdgesFrom = function(index)
{
	return this.edgesFrom[index] || [];
}

SparseGraph.prototype.getEdgeKey = function(from,to)
{
	return from + "-" + to;
}

SparseGraph.prototype.numNodes = function()
{
	return this.nodes.length;
}

module.exports = SparseGraph;