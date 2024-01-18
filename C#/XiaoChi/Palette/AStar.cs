using System;
using System.Collections.Generic;

namespace XiaoChi.Palette
{
    /// <summary>
    /// <para>AStar类实现了A*寻路算法。支持网格模式（EMode.Grid）和路标模式（EMode.Waypoints），以及曼哈顿启发式和欧几里得启发式。</para>
    /// <para>默认使用网格模式和曼哈顿启发式。如果需要使用路标模式或欧几里得启发式，需要在计算之前，更改AStar类的静态属性Mode和Heuristic。</para>
    /// </summary>
    public static class AStar
    {
        public enum EMode
        {
            Grid,
            Waypoints
        }
        public enum EHeuristics
        {
            Manhattan,
            Euclid
        }

        private static List<AStarNode> openList;
        private static List<AStarNode> closedList;

        /// <summary>
        /// <para>Mode静态属性指定了AStar在计算时的模式。默认为网格模式（EMode.Grid）。</para>
        /// <para>有效值为EMode.Grid和EMode.Waypoints。</para>
        /// <para>在网格模式下，计算得到的结果是一序列网格（AStarNode类）实例。这些网格在几何意义上是相连的，可以直接作为路径使用。可以设置不可作为路径的部分网格（比如障碍物等）的Walkable属性为false，这样，计算得到的结果不会经过它们。</para>
        /// <para>在路标模式下，计算得到的结果是路径的顶点。作为路标顶点的网格（AStarNode类的实例）之间需要相互被引用在Waypoints列表属性中。</para>
        /// </summary>
        public static EMode Mode { get; set; } = EMode.Grid;
        /// <summary>
        /// <para>Heuristic静态属性指定了AStar在计算时使用的启发式。启发式一定程度上会影响计算的结果。默认值为曼哈顿（EHeuristics.Manhattan）。</para>
        /// <para>有效值为EHeuristics.Manhattan和Heuristics.Euclid。</para>
        /// </summary>
        public static EHeuristics Heuristics { get; set; } = EHeuristics.Manhattan;

        /// <summary>
        /// <para>FindPath()方法用于计算路径。根据调用FindPath()之前设置的Mode属性和Heuristics属性不同，计算的结果会不同。</para>
        /// </summary>
        /// <param name="map">map参数指定一个AStarNode类型的List二维数组，作为计算使用的地图。一般使用DrawGrid()方法生成一个指定尺寸的二维数组作为地图使用</param>
        /// <param name="startX">startX参数指定起始网格的x值</param>
        /// <param name="startY">startY参数指定起始网格的y值</param>
        /// <param name="endX">endX参数指定终点网格的x值</param>
        /// <param name="endY">endY参数指定终点网格的y值</param>
        /// <returns></returns>
        public static List<AStarNode> FindPath(List<List<AStarNode>> map, int startX, int startY, int endX, int endY)
        {
            AStarNode startNode;
            AStarNode endNode;
            AStarNode node;
            AStarNode currNode;
            float tempGCost;
            HeuristicsFunction heurisFunc = GetManhattanDistance;
            try
            {
                startNode = map[startX][startY];
                endNode = map[endX][endY];
            }
            catch (ArgumentOutOfRangeException e)
            {
                throw (e);
            }
            if (!startNode.Walkable || !endNode.Walkable)
            {
                return null;
            }
            switch (Heuristics)
            {
                case EHeuristics.Manhattan:
                    heurisFunc = GetManhattanDistance;
                    break;
                case EHeuristics.Euclid:
                    heurisFunc = GetEuclidDistance;
                    break;
            }
            if (Mode == EMode.Grid)
            {
                openList = new List<AStarNode>();
                closedList = new List<AStarNode>();
                openList.Add(startNode);
                for (int x = 0; x < map.Count; x++)
                {
                    for (int y = 0; y < map[0].Count; y++)
                    {
                        node = map[x][y];
                        node.GCost = int.MaxValue;
                        node.HCost = heurisFunc(node, endNode);
                        node.FCost = int.MaxValue;
                        node.Parent = null;
                    }
                }
                startNode.GCost = 0;
                startNode.HCost = heurisFunc(startNode, endNode);
                startNode.FCost = startNode.HCost;
                while (openList.Count > 0)
                {
                    currNode = GetLowestFCostNode(openList);
                    if (currNode == endNode)
                    {
                        return RetracePath(startNode, endNode);
                    }
                    openList.Remove(currNode);
                    closedList.Add(currNode);
                    foreach (AStarNode neighbour in GetNeighbours(map, currNode))
                    {
                        if (!neighbour.Walkable || closedList.Contains(neighbour))
                        {
                            continue;
                        }
                        tempGCost = currNode.GCost + heurisFunc(currNode, neighbour);
                        if (tempGCost < neighbour.GCost)
                        {
                            neighbour.Parent = currNode;
                            neighbour.GCost = tempGCost;
                            neighbour.FCost = neighbour.GCost + neighbour.HCost;
                            if (!openList.Contains(neighbour))
                            {
                                openList.Add(neighbour);
                            }
                        }
                    }
                }
            }
            else if (Mode == EMode.Waypoints)
            {
                openList = new List<AStarNode>();
                closedList = new List<AStarNode>();
                startNode.GCost = 0;
                startNode.HCost = heurisFunc(startNode, endNode);
                startNode.FCost = startNode.HCost;
                openList.Add(startNode);
                while (openList.Count > 0)
                {
                    currNode = GetLowestFCostNode(openList);
                    if (currNode == endNode)
                    {
                        return RetracePath(startNode, endNode);
                    }
                    openList.Remove(currNode);
                    closedList.Add(currNode);
                    foreach (AStarNode waypoint in currNode.Waypoints)
                    {
                        if (!waypoint.Walkable || closedList.Contains(waypoint))
                        {
                            continue;
                        }
                        tempGCost = currNode.GCost + heurisFunc(currNode, waypoint);
                        if (tempGCost < waypoint.GCost)
                        {
                            waypoint.Parent = currNode;
                            waypoint.GCost = tempGCost;
                            waypoint.HCost = heurisFunc(waypoint, endNode);
                            waypoint.FCost = waypoint.GCost + waypoint.HCost;
                            if (!openList.Contains(waypoint))
                            {
                                openList.Add(waypoint);
                            }
                        }
                    }
                }
            }
            return null;
        }
        private static AStarNode GetLowestFCostNode(List<AStarNode> list)
        {
            AStarNode returnNode = list[0];
            foreach (AStarNode node in list)
            {
                if (node.FCost < returnNode.FCost)
                {
                    returnNode = node;
                }
            }
            return returnNode;
        }
        private static List<AStarNode> GetNeighbours(List<List<AStarNode>> map, AStarNode node)
        {
            List<AStarNode> nodes = new List<AStarNode>();
            if (0 <= node.Y - 1 && node.Y - 1 <= map[0].Count - 1)
            {
                nodes.Add(map[node.X][node.Y - 1]);
            }
            if (0 <= node.Y + 1 && node.Y + 1 <= map[0].Count - 1)
            {
                nodes.Add(map[node.X][node.Y + 1]);
            }
            if (0 <= node.X - 1 && node.X - 1 <= map.Count - 1)
            {
                nodes.Add(map[node.X - 1][node.Y]);
            }
            if (0 <= node.X + 1 && node.X + 1 <= map.Count - 1)
            {
                nodes.Add(map[node.X + 1][node.Y]);
            }
            return nodes;
        }
        private static float GetManhattanDistance(AStarNode node1,  AStarNode node2)
        {
            return Math.Abs(node1.X - node2.X) + Math.Abs(node1.Y - node2.Y);
        }
        private static float GetEuclidDistance(AStarNode node1, AStarNode node2)
        {
            float dx = node1.X - node2.X;
            float dy = node1.Y - node2.Y;
            return (float)Math.Sqrt(dx * dx + dy * dy);
        }
        private static List<AStarNode> RetracePath(AStarNode startNode, AStarNode endNode)
        {
            List<AStarNode> path = new List<AStarNode>();
            AStarNode currNode = endNode;
            while (currNode != startNode)
            {
                path.Add(currNode);
                currNode = currNode.Parent;
            }
            path.Reverse();
            return path;
        }
        /// <summary>
        /// <para>DrawGrid()方法可以便捷地生成一个AStarNode类型的List二维数组。在传递给FindPath()方法之前，可以根据实际需求，调整其中部分AStarNode实例的部分属性。</para>
        /// </summary>
        /// <param name="width">指定地图网格的宽度</param>
        /// <param name="height">指定地图网格的高度</param>
        /// <returns></returns>
        public static List<List<AStarNode>> DrawGrid(float width, float height)
        {
            List<List<AStarNode>> grid = new List<List<AStarNode>>((int)Math.Ceiling(width));
            for (int x = 0; x < grid.Capacity; x++)
            {
                grid.Add(new List<AStarNode>((int)Math.Ceiling(height)));
                for (int y = 0; y < grid[x].Capacity; y++)
                {
                    grid[x].Add(new AStarNode(x, y));
                }
            }
            return grid;
        }
        /// <summary>
        /// <para>SetWaypoint()方法提供了一种将两个节点相互指定为对方的路标的方式。</para>
        /// </summary>
        /// <param name="node1">相互指定为路标的一个AStarNode节点</param>
        /// <param name="node2">相互指定为路标的另一个AStarNode节点</param>
        public static void SetWaypoint(AStarNode node1, AStarNode node2)
        {
            if (!node2.Waypoints.Contains(node1))
            {
                node2.Waypoints.Add(node1);
            }
            if (!node1.Waypoints.Contains(node2))
            {
                node1.Waypoints.Add(node2);
            }
        }
        private delegate float HeuristicsFunction(AStarNode node1, AStarNode node2);
    }

    /// <summary>
    /// <para>AStarNode类是AStar类使用的节点。AStar类实现了A*寻路算法。</para>
    /// <para>通过设置AStarNode类的Walkable属性，可以调整该节点是否可以作为路径的一部分。</para>
    /// <para>当AStar类使用网格模式（AStar.EMode.Grid）时，地图上的每个AStarNode都是有效的网格。当起点与终点之间存在可行的路径时，AStar类计算得到的路径是一序列在几何意义上相连的网格。因此，也可以直接将网格模式下得到的结果作为路径使用。</para>
    /// <para>当AStar类使用路标模式（AStar.EMode.Waypoints）时，只有被其它AStarNode实例的Waypoints属性（一个数组）指定的AStarNode可以作为路标。此时，AStar类计算得到的是最短路径的顶点，而不能直接当作是路径本身。</para>
    /// </summary>
    public class AStarNode
    {
        public int X { get; set; }
        public int Y { get; set; }
        public bool Walkable { get; set; }
        internal float GCost { get; set; }
        internal float HCost { get; set; }
        internal float FCost { get; set; }
        internal AStarNode Parent { get; set; }
        /// <summary>
        /// 返回该AStarNode对象的路标列表。这个列表指定了在路标模式下，可以从该AStarNode网格出发的网格。
        /// </summary>
        public List<AStarNode> Waypoints { get; } = new List<AStarNode>();

        /// <summary>
        /// <para>AStarNode的构造函数。一般不会直接使用AStarNode的构造函数，通常是AStar类内部会创建AStarNode实例。</para>
        /// <para>通过AStarNode的构造函数可以直接指定X、Y和Walkable属性，但是AStarNode的X、Y与包含它的地图（实质上是AStarNode类型的List二维数组）并不存在绝对的关联，修改AStarNode的属性不会影响它在地图数组中的位置。</para>
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="walkable"></param>
        public AStarNode(int x, int y, bool walkable = true)
        {
            X = x;
            Y = y;
            Walkable = walkable;
        }
    }
}