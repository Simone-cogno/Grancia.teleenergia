HTMLArea.SelectFont=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.buttonsConfiguration=this.editorConfiguration.buttons;this.disablePCexamples=this.editorConfiguration.disablePCexamples;if(this.getPluginInstance("TextStyle")){this.getPluginInstance("TextStyle").addAllowedAttribute("style");this.allowedAttributes=this.getPluginInstance("TextStyle").allowedAttributes;}
if(this.getPluginInstance("InlineElements")){this.getPluginInstance("InlineElements").addAllowedAttribute("style");if(!this.allowedAllowedAttributes){this.allowedAttributes=this.getPluginInstance("InlineElements").allowedAttributes;}}
if(this.getPluginInstance("BlockElements")){this.getPluginInstance("BlockElements").addAllowedAttribute("style");}
if(!this.allowedAttributes){this.allowedAttributes=new Array("id","title","lang","xml:lang","dir","class","style");if(Ext.isIE){this.allowedAttributes.push("className");}}
var pluginInformation={version:'2.0',developer:'Stanislas Rolland',developerUrl:'http://www.sjbr.ca/',copyrightOwner:'Stanislas Rolland',sponsor:'SJBR',sponsorUrl:'http://www.sjbr.ca/',license:'GPL'};this.registerPluginInformation(pluginInformation);Ext.each(this.dropDownList,function(dropDown){var buttonId=dropDown[0];if(this.isButtonInToolbar(buttonId)){var dropDownConfiguration={id:buttonId,tooltip:this.localize(buttonId.toLowerCase()),storeUrl:this.buttonsConfiguration[dropDown[2]].dataUrl,action:'onChange',tpl:this.disablePCexamples?'':'<tpl for="."><div ext:qtip="{value}" style="'+dropDown[3]+'" class="x-combo-list-item">{text}</div></tpl>'};if(this.buttonsConfiguration[dropDown[2]]){if(this.editorConfiguration.buttons[dropDown[2]].width){dropDownConfiguration.width=parseInt(this.editorConfiguration.buttons[dropDown[2]].width,10);}
if(this.editorConfiguration.buttons[dropDown[2]].listWidth){dropDownConfiguration.listWidth=parseInt(this.editorConfiguration.buttons[dropDown[2]].listWidth,10);}
if(this.editorConfiguration.buttons[dropDown[2]].maxHeight){dropDownConfiguration.maxHeight=parseInt(this.editorConfiguration.buttons[dropDown[2]].maxHeight,10);}}
this.registerDropDown(dropDownConfiguration);}
return true;},this);return true;},dropDownList:[['FontName',null,'fontstyle','font-family:{value};text-align:left;font-size:11px;'],['FontSize',null,'fontsize','text-align:left;font-size:{value};']],styleProperty:{FontName:"fontFamily",FontSize:"fontSize"},cssProperty:{FontName:"font-family",FontSize:"font-size"},onGenerate:function(){Ext.each(this.dropDownList,function(dropDown){var select=this.getButton(dropDown[0]);if(select){select.mon(select.getStore(),'load',function(){select.setValue('none');});}},this);},onChange:function(editor,combo,record,index){var param=combo.getValue();editor.focus();var element,fullNodeSelected=false;var selection=editor._getSelection();var range=editor._createRange(selection);var parent=editor.getParentElement(selection,range);var selectionEmpty=editor._selectionEmpty(selection);var statusBarSelection=editor.statusBar?editor.statusBar.getSelection():null;if(!selectionEmpty){var ancestors=editor.getAllAncestors();var fullySelectedNode=editor.getFullySelectedNode(selection,range,ancestors);if(fullySelectedNode){fullNodeSelected=true;parent=fullySelectedNode;}}
if(selectionEmpty||fullNodeSelected){element=parent;this.setStyle(element,combo.itemId,param);if((element.nodeName.toLowerCase()==="span")&&!HTMLArea.hasAllowedAttributes(element,this.allowedAttributes)){editor.removeMarkup(element);}}else if(statusBarSelection){element=statusBarSelection;this.setStyle(element,combo.itemId,param);if((element.nodeName.toLowerCase()==="span")&&!HTMLArea.hasAllowedAttributes(element,this.allowedAttributes)){editor.removeMarkup(element);}}else if(editor.endPointsInSameBlock()){element=editor._doc.createElement("span");this.setStyle(element,combo.itemId,param);editor.wrapWithInlineElement(element,selection,range);if(!Ext.isIE){range.detach();}}
return false;},setStyle:function(element,buttonId,value){element.style[this.styleProperty[buttonId]]=(value&&value!=='none')?value:'';if(Ext.isIE&&(!value||value=='none')){element.style.removeAttribute(this.styleProperty[buttonId],false);}
if(Ext.isOpera){element.style.cssText=element.style.cssText.replace(/\"/g,"\'");if(!/\S/.test(element.style[this.styleProperty[buttonId]])){element.style.cssText=element.style.cssText.replace(/font-family: /gi,"");}}},onUpdateToolbar:function(select,mode,selectionEmpty,ancestors,endPointsInSameBlock){var editor=this.editor;if(mode==='wysiwyg'&&editor.isEditable()){var statusBarSelection=this.editor.statusBar?this.editor.statusBar.getSelection():null;var parentElement=statusBarSelection?statusBarSelection:editor.getParentElement();var value=parentElement.style[this.styleProperty[select.itemId]];if(!value){if(!Ext.isIE){if(editor.document.defaultView&&editor.document.defaultView.getComputedStyle(parentElement,null)){value=editor.document.defaultView.getComputedStyle(parentElement,null).getPropertyValue(this.cssProperty[select.itemId]);}}else{value=parentElement.currentStyle[this.styleProperty[select.itemId]];}}
var store=select.getStore();var index=-1;if(value){index=store.findBy(function(record,id){return record.get('value').replace(/[\"\']/g,"")==value.replace(/, /g,",").replace(/[\"\']/g,"");});}
if(index!=-1){select.setValue(store.getAt(index).get('value'));}else if(store.getCount()){select.setValue('none');}
select.setDisabled(!endPointsInSameBlock||(selectionEmpty&&/^body$/i.test(parentElement.nodeName)));}}});