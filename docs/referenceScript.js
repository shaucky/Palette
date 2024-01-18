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
			aNode.innerHTML = c;
			aNode.href = "#" + c.replace(c[0], c[0].toLowerCase());
			divNode.appendChild(aNode);
			LIB_MENU.appendChild(divNode);
		}
});
function openChildPage(e)
{
	if (e.target.tagName == "A")
	{
		document.title = e.target.innerHTML + " - Palette_API参考文档 - 跨语言游戏开发工具类库";
		if (Array.prototype.indexOf.call(LIB_MENU.children, e.target.parentNode) == 0)
		{
			CONTENT.innerHTML = HOMEPAGE_HTML;
		}
		else
		{
			fetch("./" + e.target.hash.replace("#", "") + ".json")
				.then(response => response.json())
				.then(contentData => {
					let firstLanguage = true;
					let langFrameList = document.createElement("DIV");
					let languageButton;
					let languageFrame;
					let languageList = document.createElement("DIV");
					let bNode;
					let divNode;
					let h2Node;
					let h3Node;
					let pNode;
					let spanNode;
					let tableNode;
					let tdNode;
					let thNode;
					let trNode;
					CONTENT.innerHTML = "";
					langFrameList.id = "langFrameList";
					languageList.innerHTML = "<p style=\"margin-left: 5px;margin-bottom: 5px;font-size: 10pt;\">选择语言：</p>";
					languageList.id = "langList";
					languageList.style.overflow = "hidden";
					for (let elem in contentData)
					{
						switch (elem) {
							case "className":
								h2Node = document.createElement("H2");
								h2Node.innerHTML = contentData[elem];
								CONTENT.appendChild(h2Node);
							break;
							case "diffInLang":
								bNode = document.createElement("B");
								bNode.innerHTML = "跨语言差异：<br>";
								spanNode = document.createElement("SPAN");
								spanNode.className = "diffInLang";
								spanNode.innerHTML = contentData[elem];
								pNode = document.createElement("P");
								pNode.appendChild(bNode);
								pNode.appendChild(spanNode);
								CONTENT.appendChild(pNode);
							break;
							case "langList":
								CONTENT.appendChild(languageList);
								CONTENT.appendChild(langFrameList);
							break;
							case "actionscript":
								languageFrame = document.createElement("DIV");
								languageFrame.className = "langFrm";
								if (!firstLanguage)
								{
									languageFrame.style.display = "none";
								}
								if (contentData[elem]["package"])
								{
									divNode = document.createElement("DIV");
									divNode.innerHTML = "<b>包 </b>" + contentData[elem]["package"];
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["defination"])
								{
									divNode = document.createElement("DIV");
									divNode.innerHTML = "<b>定义 </b>" + contentData[elem]["defination"];
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["introduce"])
								{
									pNode = document.createElement("P");
									pNode.innerHTML = contentData[elem]["introduce"];
									divNode = document.createElement("DIV");
									divNode.className = "classIntro";
									divNode.appendChild(pNode);
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["staticConst"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态常量";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "常量";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "值";
									thNode.style.width = "10em";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["staticConst"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[3];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["staticProperty"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态属性";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["staticProperty"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["publicProperty"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "公共属性";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["publicProperty"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["staticMethod"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态方法";
									languageFrame.appendChild(h3Node);
									for (let ary of contentData[elem]["staticMethod"])
									{
										pNode = document.createElement("P");
										pNode.className = "functionIntro";
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = ary[0];
										divNode.appendChild(bNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = "定义";
										divNode.appendChild(bNode);
										spanNode = document.createElement("SPAN");
										spanNode.innerHTML = ary[1];
										divNode.appendChild(spanNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										divNode.innerHTML = ary[2];
										divNode.style.marginLeft = "10px";
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
									}
								}
								if (contentData[elem]["publicMethod"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "公共方法";
									languageFrame.appendChild(h3Node);
									for (let ary of contentData[elem]["publicMethod"])
									{
										pNode = document.createElement("P");
										pNode.className = "functionIntro";
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = ary[0];
										divNode.appendChild(bNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = "定义";
										divNode.appendChild(bNode);
										spanNode = document.createElement("SPAN");
										spanNode.innerHTML = ary[1];
										divNode.appendChild(spanNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										divNode.innerHTML = ary[2];
										divNode.style.marginLeft = "10px";
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
									}
								}
								if (contentData[elem]["event"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "事件";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["event"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								langFrameList.appendChild(languageFrame);
								createLangButton("ActionScript");
							break;
							case "csharp":
								languageFrame = document.createElement("DIV");
								languageFrame.className = "langFrm";
								if (!firstLanguage)
								{
									languageFrame.style.display = "none";
								}
								if (contentData[elem]["namespace"])
								{
									divNode = document.createElement("DIV");
									divNode.innerHTML = "<b>命名空间 </b>" + contentData[elem]["namespace"];
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["defination"])
								{
									divNode = document.createElement("DIV");
									divNode.innerHTML = "<b>定义 </b>" + contentData[elem]["defination"];
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["introduce"])
								{
									pNode = document.createElement("P");
									pNode.innerHTML = contentData[elem]["introduce"];
									divNode = document.createElement("DIV");
									divNode.className = "classIntro";
									divNode.appendChild(pNode);
									languageFrame.appendChild(divNode);
								}
								if (contentData[elem]["enum"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "枚举";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "枚举";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "成员";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["enum"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["staticConst"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态常量";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "常量";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "值";
									thNode.style.width = "10em";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["staticConst"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[3];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["staticProperty"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态属性";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["staticProperty"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["publicProperty"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "公共属性";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["publicProperty"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								if (contentData[elem]["staticMethod"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "静态方法";
									languageFrame.appendChild(h3Node);
									for (let ary of contentData[elem]["staticMethod"])
									{
										pNode = document.createElement("P");
										pNode.className = "functionIntro";
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = ary[0];
										divNode.appendChild(bNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = "定义";
										divNode.appendChild(bNode);
										spanNode = document.createElement("SPAN");
										spanNode.innerHTML = ary[1];
										divNode.appendChild(spanNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										divNode.innerHTML = ary[2];
										divNode.style.marginLeft = "10px";
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
									}
								}
								if (contentData[elem]["publicMethod"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "公共方法";
									languageFrame.appendChild(h3Node);
									for (let ary of contentData[elem]["publicMethod"])
									{
										pNode = document.createElement("P");
										pNode.className = "functionIntro";
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = ary[0];
										divNode.appendChild(bNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										bNode = document.createElement("B");
										bNode.innerHTML = "定义";
										divNode.appendChild(bNode);
										spanNode = document.createElement("SPAN");
										spanNode.innerHTML = ary[1];
										divNode.appendChild(spanNode);
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
										pNode = document.createElement("P");
										divNode = document.createElement("DIV");
										divNode.innerHTML = ary[2];
										divNode.style.marginLeft = "10px";
										pNode.appendChild(divNode);
										languageFrame.appendChild(pNode);
									}
								}
								if (contentData[elem]["event"])
								{
									h3Node = document.createElement("H3");
									h3Node.innerHTML = "事件";
									languageFrame.appendChild(h3Node);
									tableNode = document.createElement("TABLE");
									tableNode.className = "docTable";
									tableNode.style.width = "100%";
									trNode = document.createElement("TR");
									thNode = document.createElement("TH");
									thNode.innerHTML = "属性";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "类型";
									thNode.style.width = "8em";
									trNode.appendChild(thNode);
									thNode = document.createElement("TH");
									thNode.innerHTML = "介绍";
									trNode.appendChild(thNode);
									tableNode.appendChild(trNode);
									for (let ary of contentData[elem]["event"])
									{
										trNode = document.createElement("TR");
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[0];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[1];
										trNode.appendChild(tdNode);
										tdNode = document.createElement("TD");
										tdNode.innerHTML = ary[2];
										trNode.appendChild(tdNode);
										tableNode.appendChild(trNode);
									}
									languageFrame.appendChild(tableNode);
								}
								langFrameList.appendChild(languageFrame);
								createLangButton("C#");
						}
					}
					function createLangButton(language)
					{
							languageButton = document.createElement("A");
							languageButton.className = "langBtn";
							divNode = document.createElement("DIV");
							divNode.innerHTML = language;
							languageButton.appendChild(divNode);
							languageList.appendChild(languageButton);
							languageButton.href = "JavaScript: void(0);"
							languageButton.addEventListener("click", changeLang)
							if (firstLanguage)
							{
								languageButton.style.background = "#062f1f";
								firstLanguage = false;
							}
					}
				});
		}
	}
}
function changeLang(e)
{
	var tarbtn;
	if (e.target.tagName == "DIV")
	{
		tarbtn = e.target.parentNode;
	}
	else if (e.target.tagName == "A")
	{
		tarbtn = e.target;
	}
	for (var i of document.getElementById("langList").children)
	{
		i.style.background = "";
	}
	tarbtn.style.background = "#062f1f";
	for (var j of document.getElementById("langFrameList").children)
	{
		j.style.display = "none";
	}
	document.getElementById("langFrameList").children[Array.prototype.indexOf.call(tarbtn.parentNode.children, tarbtn) - 1].style.display = "";
}