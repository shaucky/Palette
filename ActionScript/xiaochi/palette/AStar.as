package xiaochi.palette
{
	/**
	 * AStar类实现了A*寻路算法。支持网格模式（GRID_MODE）和路标模式（WAYPOINTS_MODE），以及曼哈顿启发式和欧几里得启发式。
	 * 默认使用网格模式和曼哈顿启发式。如果需要使用路标模式或欧几里得启发式，需要在计算之前，更改AStar类的静态属性mode和heuristic。
	 */
	public class AStar
	{
		public static const GRID_MODE:String = "gridMode";
		public static const WAYPOINTS_MODE:String = "waypointsMode";
		public static const MANHATTAN:String = "manhattan";
		public static const EUCLID:String = "euclid";
		private static var _openList:Array;
		private static var _closedList:Array;
		private static var _mode:String = "gridMode";
		private static var _heuristics:String = "manhattan";
		
		/**
		 * mode静态属性指定了AStar在计算时的模式。默认为网格模式（GRID_MODE）。
		 * 有效值为GRID_MODE和WAYPOINTS_MODE。
		 * 在网格模式下，计算得到的结果是一序列网格（AStarNode类）实例。这些网格在几何意义上是相连的，可以直接作为路径使用。可以设置不可作为路径的部分网格（比如障碍物等）的walkable属性为false，这样，计算得到的结果不会经过它们。
		 * 在路标模式下，计算得到的结果是路径的顶点。作为路标顶点的网格（AStarNode类的实例）之间需要相互被引用在waypoints数组属性中。
		 */
		public static function get mode():String
		{
			return _mode;
		}
		public static function set mode(value:String)
		{
			if (value == GRID_MODE || value == WAYPOINTS_MODE)
			{
				_mode = value;
			}
		}
		/**
		 * heuristic静态属性制定了AStar在计算时使用的启发式。启发式一定程度上会影响计算的结果。默认值为曼哈顿（MANHATTAN）。
		 * 有效值为MANHATTAN和EUCLID。
		 */
		public static function get heuristics():String
		{
			return _heuristics;
		}
		public static function set heuristics(value:String)
		{
			if (value == MANHATTAN || value == EUCLID)
			{
				_heuristics = value;
			}
		}
	
		/**
		 * AStar是静态的工具类，不可实例化。
		 */
		public function AStar()
		{
			throw(new TypeError("Error #1076: AStar is not a constructor."));
		}
		
		/**
		 * findPath()方法用于计算路径。根据调用findPath()之前设置的mode属性和heuristics属性不同，计算的结果会不同。
		 * @param map map参数指定一个AStarNode类型的Vector二维数组，作为计算使用的地图。一般使用drawGrid()方法生成一个指定尺寸的二维数组作为地图使用。
		 * @param startX startX参数指定起始网格的x值。
		 * @param startY startY参数指定起始网格的y值。
		 * @param endX endX参数指定终点网格的x值。
		 * @param endY endY参数指定终点网格的y值。
		 */
		public static function findPath(map:Vector.<Vector.<AStarNode>>, startX:int, startY:int, endX:int, endY:int):Vector.<AStarNode>
		{
			var startNode:AStarNode;
			var endNode:AStarNode;
			var node:AStarNode;
			var currNode:AStarNode;
			var tempGCost:Number;
			var heurisFunc:Function;
			var index:int;
			try
			{
				startNode = map[startX][startY];
				endNode = map[endX][endY];
			}
			catch(e:RangeError)
			{
				throw(e);
			}
			if (_heuristics == MANHATTAN)
			{
				heurisFunc = getManhattanDistance;
			}
			else if (_heuristics == EUCLID)
			{
				heurisFunc = getEuclidDistance;
			}
			if (_mode == GRID_MODE)
			{
				_openList = new Array();
				_openList.push(startNode);
				_closedList = new Array();
				for (var x:int = 0;x < map.length;x++)
				{
					for (var y:int = 0;y < map[0].length;y++)
					{
						node = map[x][y];
						node.gCost = int.MAX_VALUE;
						node.hCost = heurisFunc(node, endNode);
						node.fCost = int.MAX_VALUE;
						node.parent = null;
					}
				}
				startNode.gCost = 0;
				startNode.hCost = heurisFunc(startNode, endNode);
				startNode.fCost = startNode.hCost;
				while (_openList.length > 0)
				{
					currNode = getLowestFCostNode(_openList);
					if (currNode == endNode)
					{
						return retracePath(startNode, endNode);
					}
					_openList.removeAt(_openList.indexOf(currNode));
					_closedList.push(currNode);
					for each (var neighbour:AStarNode in getNeighbours(map, currNode))
					{
						if (!neighbour.walkable || _closedList.indexOf(neighbour) >= 0)
						{
							continue;
						}
						tempGCost = currNode.gCost + heurisFunc(currNode, neighbour);
						if (tempGCost < neighbour.gCost)
						{
							neighbour.parent = currNode;
							neighbour.gCost = tempGCost;
							neighbour.fCost = neighbour.gCost + neighbour.hCost;
							if (_openList.indexOf(neighbour) < 0)
							{
								_openList.push(neighbour);
							}
						}
					}
				}
			}
			else if (_mode == WAYPOINTS_MODE)
			{
				_openList = new Vector.<AStarNode>();
				_closedList = new Vector.<AStarNode>();
				startNode.gCost = 0;
				startNode.hCost = heurisFunc(startNode, endNode);
				startNode.fCost = startNode.hCost;
				_openList.push(startNode);
				while (_openList.length > 0)
				{
					currNode = getLowestFCostNode(_openList);
					if (currNode == endNode)
					{
						return retracePath(startNode, endNode);
					}        
					index = _openList.indexOf(currNode);
					if(index != -1)
					{
						_openList.splice(index, 1);
					}
					_closedList.push(currNode);
					for each (var waypoint:AStarNode in currNode.waypoints)
					{
						if (!waypoint.walkable || _closedList.indexOf(waypoint) >= 0)
						{
							continue;
						}
						tempGCost = currNode.gCost + heurisFunc(currNode, waypoint);
						if (tempGCost < waypoint.gCost)
						{
							waypoint.parent = currNode;
							waypoint.gCost = tempGCost;
							waypoint.hCost = heurisFunc(waypoint, endNode);
							waypoint.fCost = waypoint.gCost + waypoint.hCost;
							if (_openList.indexOf(waypoint) == -1)
							{
								_openList.push(waypoint);
							}
						}
					}
				}
			}
			return null;
		}
		private static function getLowestFCostNode(list:Array):AStarNode
		{
			var returnNode:AStarNode = list[0];
			for each (var node:AStarNode in list)
			{
				if (node.fCost < returnNode.fCost)
				{
					returnNode = node;
				}
			}
			return returnNode;
		}
		private static function getNeighbours(map:Vector.<Vector.<AStarNode>> ,node:AStarNode):Vector.<AStarNode>
		{
			const nodes:Vector.<AStarNode> = new Vector.<AStarNode>();
			try
			{
				nodes.push(map[node.x][node.y - 1]);
			}
			catch(e:RangeError){}
			try
			{
				nodes.push(map[node.x][node.y + 1]);
			}
			catch(e:RangeError){}
			try
			{
				nodes.push(map[node.x - 1][node.y]);
			}
			catch(e:RangeError){}
			try
			{
				nodes.push(map[node.x + 1][node.y]);
			}
			catch(e:RangeError){}
			return nodes;
		}
		private static function getManhattanDistance(node1:AStarNode, node2:AStarNode):Number
		{
			return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
		}
		private static function getEuclidDistance(node1:AStarNode, node2:AStarNode):Number
		{
			var dx:Number = node1.x - node2.x;
			var dy:Number = node1.y - node2.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		private static function retracePath(startNode:AStarNode, endNode:AStarNode):Vector.<AStarNode>
		{
			const path:Vector.<AStarNode> = new Vector.<AStarNode>();
			var currNode:AStarNode = endNode;
			while (currNode != startNode)
			{
				path.push(currNode);
				currNode = currNode.parent;
			}
			path.reverse();
			return path;
		}
		/**
		 * drawGrid()方法可以便捷地生成一个AStarNode类型的Vector二维数组。在传递给findPath()方法之前，可以根据实际需求，调整其中部分AStarNode实例的部分属性。
		 * @param width 指定地图网格的宽度
		 * @param height 指定地图网格的高度
		 */
		public static function drawGrid(width:Number, height:Number):Vector.<Vector.<AStarNode>>
		{
			const grid:Vector.<Vector.<AStarNode>> = new Vector.<Vector.<AStarNode>>(Math.ceil(width));
			for (var x in grid)
			{
				grid[x] = new Vector.<AStarNode>(Math.ceil(height));
				for (var y in grid[x])
				{
					grid[x][y] = new AStarNode(x, y);
				}
			}
			return grid;
		}
		/**
		 * setWayPoint()方法提供了一种将两个节点相互指定为对方的路标的方式。
		 * @param node1 相互指定为路标的一个AStarNode节点
		 * @param node2 相互指定为路标的另一个AStarNode节点
		 */
		public static function setWaypoint(node1:AStarNode, node2:AStarNode)
		{
			if (node2.waypoints.indexOf(node1) < 0)
			{
				node2.waypoints.push(node1);
			}
			if (node1.waypoints.indexOf(node2) < 0)
			{
				node1.waypoints.push(node2);
			}
		}
	}
}
