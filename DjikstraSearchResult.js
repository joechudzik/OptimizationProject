



var DjikstraSearchResult = function(params)
{
	this.graph = params.graph;
	this.source = params.source;
	this.target = params.target;
	this.searchFrontier = params.searchFrontier;
}

DjikstraSearchResult.prototype.getPathToTarget = function()
{
	var path = [];

	if (this.searchFrontier[this.target] == 0)
		return path;

	var curNode = this.target;
	path.unshift(curNode);

	while (curNode != this.source)
	{
		curNode = this.searchFrontier[curNode].from;
		path.unshift(curNode);
	}

	return path;
}

module.exports = DjikstraSearchResult;