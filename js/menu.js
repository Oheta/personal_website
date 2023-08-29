var menu_ref = document.getElementById("eye-mainMenu");
console.log(menu_ref);

function placeChildrenRadial(parent_ref, radius, angle_top = 0, angle_bottom = 360)
{
    var anglePerChild = (angle_bottom - angle_top) / parent_ref.childElementCount;
    for(let i = 0; i < parent_ref.childElementCount; i++)
    {
        let childAngle = i*anglePerChild + angle_top;
        //console.log(childAngle);
        parent_ref.children[i].style.transform = "rotate(" + childAngle +"deg) translateX(" + radius +"px)";
        //console.log(parent_ref.children[i]);
        console.log(parent_ref.children[i].style.transform);
        parent_ref.children[i].children[0].style.transform = "rotate(" + (-childAngle) +"deg)";
        console.log(parent_ref.children[i].children[0].style.transform);
    }
}

placeChildrenRadial(menu_ref, 130, -60, 100);