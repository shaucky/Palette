package xiaochi.palette
{
	/**
	 * AStarNode类是AStar类使用的节点。AStar类实现了A*寻路算法。
	 * 通过设置AStarNode类的walkable属性，可以调整该节点是否可以作为路径的一部分。
	 * 当AStar类使用网格模式（GRID_MODE）时，地图上的每个AStarNode都是有效的网格。当起点与终点之间存在可行的路径时，AStar类计算得到的路径是一序列在几何意义上相连的网格。因此，也可以直接将网格模式下得到的结果作为路径使用。
	 * 当AStar类使用路标模式（WAYPOINTS_MODE）时，只有被其它AStarNode实例的waypoints属性（一个数组）指定的AStarNode可以作为路标。此时，AStar类计算得到的是最短路径的顶点，而不能直接当作是路径本身。
	 */
	public class AStarNode
	{
		public var x:int;
		public var y:int;
		public var walkable:Boolean;
		internal var fCost:Number;
		internal var gCost:Number;
		internal var hCost:Number;
		internal var parent:AStarNode;
		private const _waypoints:Vector.<AStarNode> = new Vector.<AStarNode>();
		public function get waypoints():Vector.<AStarNode>
		{
			return _waypoints;
		}
		
		/**
		 * AStarNode的构造函数。一般不会直接使用AStarNode的构造函数，通常是AStar类内部会创建AStarNode实例。
		 * 通过AStarNode的构造函数可以直接指定x、y和walkable属性，但是AStarNode的x、y与包含它的地图（实质上是AStarNode类型的Vector二维数组）并不存在绝对的关联，修改AStarNode的属性不会影响它在地图数组中的位置。
		 */
		public function AStarNode(x:int, y:int, walkable:Boolean = true)
		{
			this.x = x;
			this.y = y;
			this.walkable = walkable;
		}
	}
}
