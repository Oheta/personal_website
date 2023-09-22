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

/** Shows the element selected by user */
function showMenuItem(value){
    let menuItem1_ref = document.getElementById("Introduction");
    let menuItem2_ref = document.getElementById("Experience");
    let menuItem3_ref = document.getElementById("Portfolio");
    let menuItem4_ref = document.getElementById("Contact");
    let menuCkbx1_ref = document.getElementById("ckbx-intro");
    let menuCkbx2_ref = document.getElementById("ckbx-exp");
    let menuCkbx3_ref = document.getElementById("ckbx-ptfl");
    let menuCkbx4_ref = document.getElementById("ckbx-contact");
    console.log("value is ? : " + value);
    console.log(menuCkbx1_ref.checked);
    switch(value){
        case "Introduction":
            if(menuCkbx1_ref.checked==true)
            {
                menuItem1_ref.style.left = "20vw";
                menuItem2_ref.style.left = "120vw";
                menuItem3_ref.style.left = "120vw";
                menuItem4_ref.style.left = "120vw";
                menuCkbx2_ref.checked = false;
                menuCkbx3_ref.checked = false;
                menuCkbx4_ref.checked = false;
                break;
            }
        case "Experience":
            if(menuCkbx2_ref.checked==true)
            {
                menuItem1_ref.style.left = "120vw";
                menuItem2_ref.style.left = "20vw";
                menuItem3_ref.style.left = "120vw";
                menuItem4_ref.style.left = "120vw";
                menuCkbx1_ref.checked = false;
                menuCkbx3_ref.checked = false;
                menuCkbx4_ref.checked = false;
                break;
            }
        case "Portfolio":
            if(menuCkbx3_ref.checked==true)
            {            
                menuItem1_ref.style.left = "120vw";
                menuItem2_ref.style.left = "120vw";
                menuItem3_ref.style.left = "20vw";
                menuItem4_ref.style.left = "120vw";
                menuCkbx1_ref.checked = false;
                menuCkbx2_ref.checked = false;
                menuCkbx4_ref.checked = false;
                break;
            }
        case "Contact":
            if(menuCkbx4_ref.checked==true)
            {
                menuItem1_ref.style.left = "120vw";
                menuItem2_ref.style.left = "120vw";
                menuItem3_ref.style.left = "120vw";
                menuItem4_ref.style.left = "20vw";
                menuCkbx1_ref.checked = false;
                menuCkbx2_ref.checked = false;
                menuCkbx3_ref.checked = false;
                break;
            }
        default:
            menuItem1_ref.style.left = "120vw";
            menuItem2_ref.style.left = "120vw";
            menuItem3_ref.style.left = "120vw";
            menuItem4_ref.style.left = "120vw";
            menuCkbx1_ref.checked = false;
            menuCkbx2_ref.checked = false;
            menuCkbx3_ref.checked = false;
            menuCkbx4_ref.checked = false;
            console.log("inside switch default");
            break;
        }
}

placeChildrenRadial(menu_ref, 100, -45, 315);