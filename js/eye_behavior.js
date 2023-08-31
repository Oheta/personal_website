let eyeball_ref = document.querySelectorAll("#eyeball");
let iris_ref = document.getElementById("iris");
let cursorevent = ["mousemove", "touchmove"];
var cursorInsideEye = false;

function eyeTrackMouse(){
    cursorevent.forEach((eventType) => {
        document.body.addEventListener(eventType, event => {
            eyeball_ref.forEach((eyeball) => {
                let eyeballX = eyeball.getBoundingClientRect().left + eyeball.clientWidth /2;
                let eyeballY = eyeball.getBoundingClientRect().top + eyeball.clientHeight /2;
                var x = !isTouchScreen() ? event.clientX : event.touches[0].clientX;
                var y = !isTouchScreen() ? event.clientY : event.touches[0].clientY;
                let radian = Math.atan2(x - eyeballX, y - eyeballY);
                let rotationDegrees = radian * (180 / Math.PI) * -1 + 180;
                addEventListener("mouseenter", (e) => {/* eyeball.style.transform = "none"; */console.log("enter");});
                addEventListener("mouseleave", (e) => {/* eyeball.style.transform = "none"; */console.log("leave");});
                /* if(isMouseInElement("eyeball"))
                {
                    console.log(x,y);
                    iris_ref.style.left = x - eyeballX + "px";
                    iris_ref.style.top = y - eyeballY + "px";
                }
                else{ */
                    eyeball.style.transform = "rotate(" + rotationDegrees + "deg)";
                /* } */
            });
        });
    });
}

eyeTrackMouse();