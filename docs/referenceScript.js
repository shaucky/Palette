const LIB_MENU = document.getElementById("libraryMenu");
const CONTENT = document.getElementById("content");
const HOMEPAGE_HTML = CONTENT.innerHTML;
LIB_MENU.addEventListener("click", openChildPage);
fetch("./index.json")
	.then(response => response.json())
	.then(indexJson => {
		for (let c of indexJson["classes"])
		{
			let divNode = document.createElement("DIV");
			let aNode = document.createElement("A");
			aNode.hash = "#" + c.replace(c[0], c[0].toLowerCase);
			divNode.appendChild(aNode);
			LIB_MENU.appendChild(divNode);
		}
});
function openChildPage(e)
{
	if (e.target.tagName == "A")
	{
		if (Array.prototype.indexOf.call(LIB_MENU.children, e.target.parentNode) == 0)
		{
			CONTENT.innerHTML = HOMEPAGE_HTML;
		}
		else
		{
			fetch("./" + e.target.hash.replace("#", "") + ".json")
				.then(response => response.json())
				.then(contentData => {
					console.log(contentData);
				});
		}
		console.log(window.location.href.replace("#", ""));
		history.replaceState(null, null, window.location.href.replace("#", ""));
	}
}