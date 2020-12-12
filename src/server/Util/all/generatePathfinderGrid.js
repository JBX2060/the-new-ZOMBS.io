import Util from "Util/Util";
import SERVER_DATA from "data/all";


function generatePathfinderGrid(entityGrid, obstacles, goal) {
    var pathFinderGrid = [];
    
    for (var row = 0; row < entityGrid.length; row++)
    {
        pathFinderGrid[row] = []
        for (var col = 0; col < entityGrid[row].length; col++)
        {
            /*if (obstacles.indexOf(SERVER_DATA.ENTITIES[entityGrid[row][col][0]].model) >= 0)
            {
                pathFinderGrid[row][col] = "Obstacle";
            }
            else
            {
                pathFinderGrid[row][col] = "Empty";
            }*/
            pathFinderGrid[row][col] = "Empty";
        }
    }
    pathFinderGrid[goal[0]][goal[1]] = "Goal";
    return pathFinderGrid;
}

export default generatePathfinderGrid;