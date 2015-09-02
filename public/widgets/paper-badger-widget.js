function callAjax(url, callbackFunction) {

    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callbackFunction(xmlhttp.responseText);
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function visitArray(arr, visitor) {
    var result = [];

    for (var i = 0; i < arr.length; i++) {
        result[i] = visitor(arr[i]);
    }

    return result;
}

function renderBadge(key, badgeData)
{
	var outString="<div class=\"paper-badge\"><p>"+key+"</p>";
	var all=badgeData.split(";");
	outString+="<img style=\'max-width: 8em\' src='"+all[0]+"' />";
	outString+="<p>"+all[1]+"</p></div>";

	return outString;
}

function createBadgeJSON(badgeData)
{
	var all=badgeData.split(";");
	var imageUrl="\"imageUrl\":\""+all[0]+"\"";
	var all2="{"+imageUrl+",\"authorList\":"+"[\""+all[1].split(",").join("\",\"")+"\"]}";

	return all2;
}

function insertCSS()
{
	return ".paper-badge {float: left; width: 10em; height: 20em; overflow: hidden; border-top: 1px solid #ccc; height 15em; padding: 2%; margin-right: 1%; margin-top: 2%}.badge-span {width: 15em; display: inline-block; font-size: 88%; line-height: 1.2; color: #333; padding: 0.4em; cursor: hand; cursor: pointer}.paper-badge img {margin-left: 10%}.badges-active {color: #fff !important; background: #7ab441}";
}

function showLine()
{
	var bindBadge=this.getAttribute("data-bind-badge");

	//var boundElem=$(".badge span[data-bind-badge="+bindBadge+"]");
	//boundElem.attr("title", "badge count: "+boundElem.length+"; ORCID: "+bindBadge.split("\_").join(" "));
	var allElems=document.getElementsByClassName("badge-span");
	visitArray(allElems, function(item){if(item.getAttribute("data-bind-badge") == bindBadge){item.className = "badge-span badges-active"; item.setAttribute("title", "ORCID: "+bindBadge.split("\_").join(" "));}else item.className = "badge-span";});
}

function nextAction()
{
	var bindBadge=this.getAttribute("data-bind-badge");
	window.open("http://orcid.org/"+bindBadge, "orcid");
}

function splitArray(arr, lookGroup)
{
	var ttt="";

	for(var i=0, arrLen=arr.length; i<arrLen; i++)
		{
		var noIn=lookGroup[arr[i]];
		ttt+="<span class=\"badge-span\" data-bind-badge='"+arr[i]+"'>"+noIn.split("_").join(" ")+"</span>";
		}

	return ttt;
}


function showBadges(confIn){

	var k="";

	var containerClass=(confIn["container-class"]) ? confIn["container-class"] : "badge-container";
	var doi=confIn["article-doi"];

	callAjax("https://badges.mozillascience.org/papers/"+doi+"/badges", function( entryData ) {

	var outCount=0;
	var pos=0, end=0;
	var excludeChars="\" :\{\}\n\r";

	var mode=0;
	var modeString=find=(!mode) ? "orcid" : "evidenceUrl";
	var look=new Object(), lookGroupOrcidFromBadge=new Object(), lookGroup=new Object(), lookGroupNo=new Object(), lookTemporaryValue=new Array(2);

	look[modeString]=0;
	look["authorName"]=1;
	look["slug"]=2;
	var lastTempVal=look["imageUrl"]=3;

	var group=1;
	var arrayNumber=1;

	while((pos=entryData.indexOf(find, pos))>0)
		{
		end=entryData.indexOf("\,", pos);

		var str=entryData.substring(pos+find.length, end);

		var i=0, k=0, ind=0;

		for(; ind>=0; ){ind=excludeChars.indexOf(str.charAt(i)); if(ind>=0) i++;}
		for(ind=0, j=str.length-1; ind>=0;){ind=excludeChars.indexOf(str.charAt(j)); if(ind>=0) j--;}

		arrayNumber=look[find];

		find=(find == modeString) ? "authorName" : (find == "authorName") ? "slug" : (find == "slug") ? "imageUrl" : modeString;

		lookTemporaryValue[arrayNumber]=str.substring(i, j+1);

		if(arrayNumber == lastTempVal) {

			if(lookTemporaryValue[lastTempVal] != "null")
				{
				var key=lookTemporaryValue[2].split(" ").join("");
				var lookTempVal=lookTemporaryValue[0];

				if(lookGroupOrcidFromBadge[key])
					{
					if(new String(lookGroupOrcidFromBadge[key]).indexOf(lookTempVal)<0)
					lookGroupOrcidFromBadge[key]+=","+lookTempVal;
					}
				else
					{
					lookGroupOrcidFromBadge[key]=lookTemporaryValue[3]+";"+lookTemporaryValue[0];
					}
				lookGroup[lookTempVal]=lookTemporaryValue[1].split(" ").join("_");
				}
			}
		}

		var allJson="";
		var JSONarray=new Array(), iArr=0;

		for (var k in lookGroupOrcidFromBadge) {
			// use hasOwnProperty to filter out keys from the Object.prototype
			if (lookGroupOrcidFromBadge.hasOwnProperty(k)) {JSONarray[iArr++]=createBadgeJSON(lookGroupOrcidFromBadge[k]);}
			}

		var containerClassQuery=document.querySelector("."+containerClass);
		var parsedJSON=JSON.parse("["+JSONarray.join(",")+"]");

		if(containerClassQuery)
			{
			containerClassQuery.appendChild(document.createElement("style")).innerHTML=insertCSS();

			for(var i=0; i<parsedJSON.length; i++)
				{
				var returnString="";

				returnString+="<img src=\""+parsedJSON[i]["imageUrl"]+"\" style=\"max-width: 7em\" />";
				returnString+=splitArray(parsedJSON[i]["authorList"], lookGroup);

				var newNode=document.createElement("div");
				newNode.setAttribute("class", "paper-badge");

				containerClassQuery.appendChild(newNode).innerHTML=returnString;
				}
			}
			
		visitArray(document.getElementsByClassName("badge-span"), function(elem){
			if(elem){
			elem.addEventListener("mouseover", showLine);
			elem.addEventListener("click", showLine);	
			elem.addEventListener("click", nextAction);	
			}
			});
	});
}
