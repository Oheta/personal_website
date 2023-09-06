var menu_ref = document.getElementById("eye-mainMenu");

/**
 * Places children div around a parent div.
 * @param {HTMLElement} parent_ref Reference to the parent element, around which you are trying to place its children 
 * @param {Number} radius Distance between children and parent element in px.
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

/** Shows the element containing [Introduction] */
function showIntroduction(){
    let menuItem1_ref = document.getElementById("Introduction");
    let menuItem2_ref = document.getElementById("Experience");
    let menuItem3_ref = document.getElementById("Portfolio");
    let menuItem4_ref = document.getElementById("Contact");
    menuItem1_ref.style.left = "20vw";
    menuItem2_ref.style.left = "120vw";
    menuItem3_ref.style.left = "120vw";
    menuItem4_ref.style.left = "120vw";
}
/** Shows the element containing [Experience] */
function showExperience(){
    let menuItem1_ref = document.getElementById("Introduction");
    let menuItem2_ref = document.getElementById("Experience");
    let menuItem3_ref = document.getElementById("Portfolio");
    let menuItem4_ref = document.getElementById("Contact");
    menuItem1_ref.style.left = "120vw";
    menuItem2_ref.style.left = "20vw";
    menuItem3_ref.style.left = "120vw";
    menuItem4_ref.style.left = "120vw";
}
/** Shows the element containing [Portfolio] */
function showPortfolio(){
    let menuItem1_ref = document.getElementById("Introduction");
    let menuItem2_ref = document.getElementById("Experience");
    let menuItem3_ref = document.getElementById("Portfolio");
    let menuItem4_ref = document.getElementById("Contact");
    menuItem1_ref.style.left = "120vw";
    menuItem2_ref.style.left = "120vw";
    menuItem3_ref.style.left = "20vw";
    menuItem4_ref.style.left = "120vw";
}
/** Shows the element containing [Contact] */
function showContact(){
    let menuItem1_ref = document.getElementById("Introduction");
    let menuItem2_ref = document.getElementById("Experience");
    let menuItem3_ref = document.getElementById("Portfolio");
    let menuItem4_ref = document.getElementById("Contact");
    menuItem1_ref.style.left = "120vw";
    menuItem2_ref.style.left = "120vw";
    menuItem3_ref.style.left = "120vw";
    menuItem4_ref.style.left = "20vw";
}

placeChildrenRadial(menu_ref, 100, -60, 100);