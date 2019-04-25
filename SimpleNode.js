
var GraphNode = require("./GraphNode.js");

var SimpleNode = function(index,data)
{
	GraphNode.call(this,index);

	this.label = data.toString();
}

SimpleNode.prototype = Object.create(GraphNode);

module.exports = SimpleNode;