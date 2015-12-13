HTMLArea.DefinitionList=HTMLArea.BlockElements.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.buttonsConfiguration=this.editorConfiguration.buttons;var parentPlugin=this.editor.plugins.BlockElements.instance;this.tags=parentPlugin.tags;this.useClass=parentPlugin.useClass;this.useBlockquote=parentPlugin.useBlockquote;this.useAlignAttribute=parentPlugin.useAlignAttribute;this.allowedBlockElements=parentPlugin.allowedBlockElements;this.indentedList=null;this.standardBlockElements=parentPlugin.standardBlockElements;this.formatBlockItems=parentPlugin.formatBlockItems;var pluginInformation={version:"1.0",developer:"Stanislas Rolland",developerUrl:"http://www.sjbr.ca/",copyrightOwner:"Stanislas Rolland",sponsor:this.localize("Technische Universitat Ilmenau"),sponsorUrl:"http://www.tu-ilmenau.de/",license:"GPL"};this.registerPluginInformation(pluginInformation);Ext.each(this.buttonList,function(button){var buttonId=button[0];var buttonConfiguration={id:buttonId,tooltip:this.localize(buttonId+'-Tooltip'),contextMenuTitle:this.localize(buttonId+'-contextMenuTitle'),helpText:this.localize(buttonId+'-helpText'),iconCls:'htmlarea-action-'+button[5],action:'onButtonPress',context:button[1],hotKey:((this.buttonsConfiguration[button[3]]&&this.buttonsConfiguration[button[3]].hotKey)?this.buttonsConfiguration[button[3]].hotKey:(button[2]?button[2]:null)),noAutoUpdate:button[4]};this.registerButton(buttonConfiguration);},this);return true;},buttonList:[['Indent',null,'TAB','indent',false,'indent'],['Outdent',null,'SHIFT-TAB','outdent',false,'outdent'],['DefinitionList',null,null,'definitionlist',true,'definition-list'],['DefinitionItem','dd,dt',null,'definitionitem',false,'definition-list-item']],onGenerate:Ext.emptyFn,onButtonPress:function(editor,id,target,className){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;this.editor.focus();var selection=editor._getSelection();var range=editor._createRange(selection);var statusBarSelection=this.editor.statusBar?this.editor.statusBar.getSelection():null;var parentElement=statusBarSelection?statusBarSelection:this.editor.getParentElement(selection,range);if(target){parentElement=target;}
while(parentElement&&(!HTMLArea.isBlockElement(parentElement)||/^(li)$/i.test(parentElement.nodeName))){parentElement=parentElement.parentNode;}
switch(buttonId){case"Indent":if(/^(dd|dt)$/i.test(parentElement.nodeName)&&this.indentDefinitionList(parentElement,range)){break;}else{this.base(editor,id,target,className);}
break;case"Outdent":if(/^(dt)$/i.test(parentElement.nodeName)&&this.outdentDefinitionList(selection,range)){break;}else{this.base(editor,id,target,className);}
break;case"DefinitionList":var bookmark=this.editor.getBookmark(range);this.insertDefinitionList();this.editor.selectRange(this.editor.moveToBookmark(bookmark));break;case"DefinitionItem":var bookmark=this.editor.getBookmark(range);this.remapNode(parentElement,(parentElement.nodeName.toLowerCase()==="dt")?"dd":"dt");this.editor.selectRange(this.editor.moveToBookmark(bookmark));break;default:this.base(editor,id,target,className);}
return false;},remapNode:function(node,nodeName){var newNode=this.editor.convertNode(node,nodeName);var attributes=node.attributes,attributeName,attributeValue;for(var i=attributes.length;--i>=0;){attributeName=attributes.item(i).nodeName;attributeValue=node.getAttribute(attributeName);if(attributeValue)newNode.setAttribute(attributeName,attributeValue);}
if(Ext.isIE){if(node.style.cssText){newNode.style.cssText=node.style.cssText;}
if(node.className){newNode.setAttribute("class",node.className);if(!newNode.className){newNode.setAttribute("className",node.className);}}else{newNode.removeAttribute("class");newNode.removeAttribute("className");}}
if(this.tags&&this.tags[nodeName]&&this.tags[nodeName].allowedClasses){if(newNode.className&&/\S/.test(newNode.className)){var allowedClasses=this.tags[nodeName].allowedClasses;var classNames=newNode.className.trim().split(" ");for(var i=classNames.length;--i>=0;){if(!allowedClasses.test(classNames[i])){HTMLArea._removeClass(newNode,classNames[i]);}}}}
return newNode;},insertDefinitionList:function(){var selection=this.editor._getSelection();var endBlocks=this.editor.getEndBlocks(selection);var list=null;if(this.editor._selectionEmpty(selection)){if(/^(body|div|address|pre|blockquote|li|td|dd)$/i.test(endBlocks.start.nodeName)){list=this.editor._doc.createElement("dl");var term=list.appendChild(this.editor._doc.createElement("dt"));while(endBlocks.start.firstChild){term.appendChild(endBlocks.start.firstChild);}
list=endBlocks.start.appendChild(list);}else if(/^(p|h[1-6])$/i.test(endBlocks.start.nodeName)){var list=endBlocks.start.parentNode.insertBefore(this.editor._doc.createElement("dl"),endBlocks.start);endBlocks.start=list.appendChild(endBlocks.start);endBlocks.start=this.remapNode(endBlocks.start,"dt");}}else if(endBlocks.start!=endBlocks.end&&/^(p|h[1-6])$/i.test(endBlocks.start.nodeName)){var paragraphs=endBlocks.start.nodeName.toLowerCase()==="p";list=this.wrapSelectionInBlockElement("dl");var items=list.childNodes;for(var i=0,n=items.length;i<n;++i){var paragraphItem=items[i].nodeName.toLowerCase()==="p";this.remapNode(items[i],paragraphs?((i%2)?"dd":"dt"):(paragraphItem?"dd":"dt"));}}
return list;},indentDefinitionList:function(parentElement,range){var selection=this.editor._getSelection();var endBlocks=this.editor.getEndBlocks(selection);if(this.editor._selectionEmpty(selection)&&/^dd$/i.test(parentElement.nodeName)){var list=parentElement.appendChild(this.editor._doc.createElement("dl"));var term=list.appendChild(this.editor._doc.createElement("dt"));if(!Ext.isIE){if(Ext.isWebKit){term.innerHTML="<br />";}else{term.appendChild(this.editor._doc.createTextNode(""));}}else{term.innerHTML="\x20";}
this.editor.selectNodeContents(term,false);return true;}else if(endBlocks.start&&/^dt$/i.test(endBlocks.start.nodeName)&&endBlocks.start.previousSibling){var sibling=endBlocks.start.previousSibling;var bookmark=this.editor.getBookmark(range);if(/^dd$/i.test(sibling.nodeName)){var list=this.wrapSelectionInBlockElement("dl");list=sibling.appendChild(list);if(list.previousSibling&&/^dl$/i.test(list.previousSibling.nodeName)){while(list.firstChild){list.previousSibling.appendChild(list.firstChild);}
HTMLArea.removeFromParent(list);}}else if(/^dt$/i.test(sibling.nodeName)){var definition=this.editor._doc.createElement("dd");definition.appendChild(this.wrapSelectionInBlockElement("dl"));sibling.parentNode.insertBefore(definition,sibling.nextSibling);}
this.editor.selectRange(this.editor.moveToBookmark(bookmark));return true;}
return false;},outdentDefinitionList:function(selection,range){var endBlocks=this.editor.getEndBlocks(selection);if(/^dt$/i.test(endBlocks.start.nodeName)&&/^dl$/i.test(endBlocks.start.parentNode.nodeName)&&/^dd$/i.test(endBlocks.start.parentNode.parentNode.nodeName)&&!endBlocks.end.nextSibling){var bookmark=this.editor.getBookmark(range);var dl=endBlocks.start.parentNode;var dd=dl.parentNode;if(this.editor._selectionEmpty(selection)){dd.parentNode.insertBefore(endBlocks.start,dd.nextSibling);}else{var selected=this.wrapSelectionInBlockElement("dl");while(selected.lastChild){dd.parentNode.insertBefore(selected.lastChild,dd.nextSibling);}
selected.parentNode.removeChild(selected);}
if(!dl.hasChildNodes()){dd.removeChild(dl);if(!dd.hasChildNodes()){dd.parentNode.removeChild(dd);}}
this.editor.selectRange(this.editor.moveToBookmark(bookmark));return true;}
return false;},onUpdateToolbar:function(button,mode,selectionEmpty,ancestors){var editor=this.editor;if(mode==='wysiwyg'&&this.editor.isEditable()){var statusBarSelection=this.editor.statusBar?this.editor.statusBar.getSelection():null;var parentElement=statusBarSelection?statusBarSelection:editor.getParentElement();if(!/^(body)$/i.test(parentElement.nodeName)){var endBlocks=editor.getEndBlocks(editor._getSelection());switch(button.itemId){case'Outdent':if(/^(dt)$/i.test(endBlocks.start.nodeName)&&/^(dl)$/i.test(endBlocks.start.parentNode.nodeName)&&/^(dd)$/i.test(endBlocks.start.parentNode.parentNode.nodeName)&&!endBlocks.end.nextSibling){button.setDisabled(false);}else{this.base(button,mode,selectionEmpty,ancestors);}
break;case'DefinitionList':button.setDisabled(!(selectionEmpty&&/^(p|div|address|pre|blockquote|h[1-6]|li|td|dd)$/i.test(endBlocks.start.nodeName))&&!(endBlocks.start!=endBlocks.end&&/^(p|h[1-6])$/i.test(endBlocks.start.nodeName)));break;}}else{switch(button.itemId){case'Outdent':this.base(button,mode,selectionEmpty,ancestors);break;}}}}});