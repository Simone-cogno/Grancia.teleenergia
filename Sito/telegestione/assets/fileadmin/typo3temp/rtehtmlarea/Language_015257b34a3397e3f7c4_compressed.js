HTMLArea.Language=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.buttonsConfiguration=this.editorConfiguration.buttons;this.useAttribute={};this.useAttribute.lang=(this.buttonsConfiguration.language&&this.buttonsConfiguration.language.useLangAttribute)?this.buttonsConfiguration.language.useLangAttribute:true;this.useAttribute.xmlLang=(this.buttonsConfiguration.language&&this.buttonsConfiguration.language.useXmlLangAttribute)?this.buttonsConfiguration.language.useXmlLangAttribute:false;if(!this.useAttribute.lang&&!this.useAttribute.xmlLang){this.useAttribute.lang=true;}
if(this.getPluginInstance("TextStyle")){this.allowedAttributes=this.getPluginInstance("TextStyle").allowedAttributes;}
if(!this.allowedAttributes&&this.getPluginInstance("InlineElements")){this.allowedAttributes=this.getPluginInstance("InlineElements").allowedAttributes;}
if(!this.allowedAttributes&&this.getPluginInstance("BlockElements")){this.allowedAttributes=this.getPluginInstance("BlockElements").allowedAttributes;}
if(!this.allowedAttributes){this.allowedAttributes=new Array("id","title","lang","xml:lang","dir","class");if(Ext.isIE){this.allowedAttributes.push("className");}}
var pluginInformation={version:'2.0',developer:'Stanislas Rolland',developerUrl:'http://www.sjbr.ca/',copyrightOwner:'Stanislas Rolland',sponsor:this.localize('Technische Universitat Ilmenau'),sponsorUrl:'http://www.tu-ilmenau.de/',license:'GPL'};this.registerPluginInformation(pluginInformation);var buttonList=this.buttonList,buttonId;for(var i=0,n=buttonList.length;i<n;++i){var button=buttonList[i];buttonId=button[0];var buttonConfiguration={id:buttonId,tooltip:this.localize(buttonId+'-Tooltip'),iconCls:'htmlarea-action-'+button[2],action:'onButtonPress',context:button[1]};this.registerButton(buttonConfiguration);}
var buttonId='Language';if(this.buttonsConfiguration[buttonId.toLowerCase()]&&this.buttonsConfiguration[buttonId.toLowerCase()].dataUrl){var dropDownConfiguration={id:buttonId,tooltip:this.localize(buttonId+'-Tooltip'),storeUrl:this.buttonsConfiguration[buttonId.toLowerCase()].dataUrl,action:'onChange'};if(this.buttonsConfiguration.language){dropDownConfiguration.width=this.buttonsConfiguration.language.width?parseInt(this.buttonsConfiguration.language.width,10):200;if(this.buttonsConfiguration.language.listWidth){dropDownConfiguration.listWidth=parseInt(this.buttonsConfiguration.language.listWidth,10);}
if(this.buttonsConfiguration.language.maxHeight){dropDownConfiguration.maxHeight=parseInt(this.buttonsConfiguration.language.maxHeight,10);}}
this.registerDropDown(dropDownConfiguration);}
return true;},buttonList:[['LeftToRight',null,'text-direction-left-to-right'],['RightToLeft',null,'text-direction-right-to-left'],['ShowLanguageMarks',null,'language-marks-show']],onGenerate:function(){var select=this.getButton('Language');if(select){var styleSheet=this.editor._doc.styleSheets[0];select.getStore().each(function(option){var selector='body.htmlarea-show-language-marks *['+'lang="'+option.get('value')+'"]:before';var style='content: "'+option.get('value')+': ";';var rule=selector+' { '+style+' }';if(!Ext.isIE){try{styleSheet.insertRule(rule,styleSheet.cssRules.length);}catch(e){this.appendToLog("onGenerate","Error inserting css rule: "+rule+" Error text: "+e);}}else{styleSheet.addRule(selector,style);}
return true;},this);select.mon(select.getStore(),'load',function(){this.updateValue(select);},this);}},onButtonPress:function(editor,id,target){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;switch(buttonId){case"RightToLeft":case"LeftToRight":this.setDirAttribute(buttonId);break;case"ShowLanguageMarks":this.toggleLanguageMarks();break;default:break;}
return false;},setDirAttribute:function(buttonId){var direction=(buttonId=="RightToLeft")?"rtl":"ltr";var element=this.editor.getParentElement();if(element){if(element.nodeName.toLowerCase()==="bdo"){element.dir=direction;}else{element.dir=(element.dir==direction||element.style.direction==direction)?"":direction;}
element.style.direction="";}},toggleLanguageMarks:function(forceLanguageMarks){var body=this.editor._doc.body;if(!HTMLArea.DOM.hasClass(body,'htmlarea-show-language-marks')){HTMLArea.DOM.addClass(body,'htmlarea-show-language-marks');}else if(!forceLanguageMarks){HTMLArea.DOM.removeClass(body,'htmlarea-show-language-marks');}},onChange:function(editor,combo,record,index){this.applyLanguageMark(combo.getValue());},applyLanguageMark:function(language){var selection=this.editor._getSelection();var statusBarSelection=this.editor.statusBar?this.editor.statusBar.getSelection():null;var range=this.editor._createRange(selection);var parent=this.editor.getParentElement(selection,range);var selectionEmpty=this.editor._selectionEmpty(selection);var endPointsInSameBlock=this.editor.endPointsInSameBlock();var fullNodeSelected=false;if(!selectionEmpty){if(endPointsInSameBlock){var ancestors=this.editor.getAllAncestors();for(var i=0;i<ancestors.length;++i){fullNodeSelected=(statusBarSelection===ancestors[i])&&((!Ext.isIE&&ancestors[i].textContent===range.toString())||(Ext.isIE&&((selection.type!=="Control"&&ancestors[i].innerText===range.text)||(selection.type==="Control"&&ancestors[i].innerText===range.item(0).text))));if(fullNodeSelected){parent=ancestors[i];break;}}
if(!fullNodeSelected&&Ext.isWebKit&&statusBarSelection&&statusBarSelection.textContent===range.toString()){fullNodeSelected=true;parent=statusBarSelection;}}}
if(selectionEmpty||fullNodeSelected){if(parent){this.setLanguageAttributes(parent,language);}}else if(endPointsInSameBlock){if(language!="none"){var newElement=this.editor._doc.createElement("span");this.setLanguageAttributes(newElement,language);this.editor.wrapWithInlineElement(newElement,selection,range);if(!Ext.isIE){range.detach();}}}else{this.setLanguageAttributeOnBlockElements(language);}},getLanguageAttribute:function(element){var xmllang="none";try{xmllang=element.getAttribute("xml:lang")?element.getAttribute("xml:lang"):"none";}catch(e){}
return element.getAttribute("lang")?element.getAttribute("lang"):xmllang;},setLanguageAttributes:function(element,language){if(language=="none"){element.removeAttribute("lang");try{element.removeAttribute("xml:lang");}catch(e){}
if((element.nodeName.toLowerCase()=="span")&&!HTMLArea.hasAllowedAttributes(element,this.allowedAttributes)){this.editor.removeMarkup(element);}}else{if(this.useAttribute.lang){element.setAttribute("lang",language);}
if(this.useAttribute.xmlLang){try{element.setAttribute("xml:lang",language);}catch(e){}}}},getLanguageAttributeFromBlockElements:function(){var selection=this.editor._getSelection();var endBlocks=this.editor.getEndBlocks(selection);var startAncestors=this.editor.getBlockAncestors(endBlocks.start);var endAncestors=this.editor.getBlockAncestors(endBlocks.end);var index=0;while(index<startAncestors.length&&index<endAncestors.length&&startAncestors[index]===endAncestors[index]){++index;}
if(endBlocks.start===endBlocks.end){--index;}
var language=this.getLanguageAttribute(startAncestors[index]);for(var block=startAncestors[index];block;block=block.nextSibling){if(HTMLArea.isBlockElement(block)){if(this.getLanguageAttribute(block)!=language||this.getLanguageAttribute(block)=="none"){language="none";break;}}
if(block==endAncestors[index]){break;}}
return language;},setLanguageAttributeOnBlockElements:function(language){var selection=this.editor._getSelection();var endBlocks=this.editor.getEndBlocks(selection);var startAncestors=this.editor.getBlockAncestors(endBlocks.start);var endAncestors=this.editor.getBlockAncestors(endBlocks.end);var index=0;while(index<startAncestors.length&&index<endAncestors.length&&startAncestors[index]===endAncestors[index]){++index;}
if(endBlocks.start===endBlocks.end){--index;}
for(var block=startAncestors[index];block;block=block.nextSibling){if(HTMLArea.isBlockElement(block)){this.setLanguageAttributes(block,language);}
if(block==endAncestors[index]){break;}}},onUpdateToolbar:function(button,mode,selectionEmpty,ancestors,endPointsInSameBlock){if(mode==='wysiwyg'&&this.editor.isEditable()){var selection=this.editor._getSelection();var statusBarSelection=this.editor.statusBar?this.editor.statusBar.getSelection():null;var range=this.editor._createRange(selection);var parent=this.editor.getParentElement(selection);switch(button.itemId){case'RightToLeft':case'LeftToRight':if(parent){var direction=(button.itemId==='RightToLeft')?'rtl':'ltr';button.setInactive(parent.dir!=direction&&parent.style.direction!=direction);button.setDisabled(/^body$/i.test(parent.nodeName));}else{button.setDisabled(true);}
break;case'ShowLanguageMarks':button.setInactive(!HTMLArea.DOM.hasClass(this.editor._doc.body,'htmlarea-show-language-marks'));break;case'Language':var fullNodeSelected=false;var language=this.getLanguageAttribute(parent);if(!selectionEmpty){if(endPointsInSameBlock){for(var i=0;i<ancestors.length;++i){fullNodeSelected=(statusBarSelection===ancestors[i])&&((!Ext.isIE&&ancestors[i].textContent===range.toString())||(Ext.isIE&&((selection.type!=="Control"&&ancestors[i].innerText===range.text)||(selection.type==="Control"&&ancestors[i].innerText===range.item(0).text))));if(fullNodeSelected){parent=ancestors[i];break;}}
if(!fullNodeSelected&&Ext.isWebKit&&statusBarSelection&&statusBarSelection.textContent===range.toString()){fullNodeSelected=true;parent=statusBarSelection;}
language=this.getLanguageAttribute(parent);}else{language=this.getLanguageAttributeFromBlockElements();}}
this.updateValue(button,language,selectionEmpty,fullNodeSelected,endPointsInSameBlock);break;default:break;}}},updateValue:function(select,language,selectionEmpty,fullNodeSelected,endPointsInSameBlock){var store=select.getStore();store.removeAt(0);if((store.findExact('value',language)!=-1)&&(selectionEmpty||fullNodeSelected||!endPointsInSameBlock)){select.setValue(language);store.insert(0,new store.recordType({text:this.localize('Remove language mark'),value:'none'}));}else{store.insert(0,new store.recordType({text:this.localize('No language mark'),value:'none'}));select.setValue('none');}
select.setDisabled(!(store.getCount()>1)||(selectionEmpty&&this.editor.getParentElement().nodeName.toLowerCase()==='body'));}});