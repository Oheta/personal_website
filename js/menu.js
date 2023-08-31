var menu_ref = document.getElementById("eye-mainMenu");

/**
 * Places children div around a parent div.
 * @param {HTMLElement} parent_ref Reference to the parent element, around which you are trying to place its children 
 * @param {Number} radius Distance between children and parent div.
 * @param {Number} angle_min Minimal angle in degrees. Defaults to 0
 * @param {Number} angle_max Maximal angle in degrees. Defaults to 360
 * @param {Boolean} verbose If console output is needed. Defaults to false
 */
function placeChildrenRadial(parent_ref, radius, angle_min = 0, angle_max = 360, verbose = false)
{
    var anglePerChild = (angle_max - angle_min) / parent_ref.childElementCount;
    for(let i = 0; i < parent_ref.childElementCount; i++)
    {
        let childAngle = i*anglePerChild + angle_min;
        parent_ref.children[i].style.transform = 
        "translateX(" + radius*Math.cos(degreesToRadians(childAngle)) +"px) " +
        "translateY(" + radius*Math.sin(degreesToRadians(childAngle)) +"px)";
        if(verbose)
        {
            console.log("Angle at which child "+ i + " of " + parent_ref +  " is placed : " + childAngle);
            console.log("placeChildrenRadial() around " + parent_ref + 
            "Translation x = " + radius*Math.cos(degreesToRadians(childAngle)) + 
            "Translation y = " + radius*Math.sin(degreesToRadians(childAngle)));
        }

    }
}
placeChildrenRadial(menu_ref, 130, -60, 100);