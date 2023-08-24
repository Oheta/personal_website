function loadScript(url)
{    
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
}

function isTouchScreen(){
    try{
        document.createEvent("TouchEvent");
        return true;
    }
    catch(e) {return false;}
}

function isMouseInElement(elementId)
{
    var isOnElement = false;
    const element = document.getElementById(elementId);
    if (element.parentNode.matches(":hover")) {
        isOnElement = true;
    }
    console.log(isOnElement);
    return isOnElement;
}