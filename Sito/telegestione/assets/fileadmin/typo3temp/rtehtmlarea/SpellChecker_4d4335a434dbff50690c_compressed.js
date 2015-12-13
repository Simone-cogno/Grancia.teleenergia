HTMLArea.SpellChecker=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.pageTSconfiguration=this.editorConfiguration.buttons.spellcheck;this.contentISOLanguage=this.pageTSconfiguration.contentISOLanguage;this.contentCharset=this.pageTSconfiguration.contentCharset;this.spellCheckerMode=this.pageTSconfiguration.spellCheckerMode;this.enablePersonalDicts=this.pageTSconfiguration.enablePersonalDicts;this.userUid=this.editorConfiguration.userUid;this.defaultDictionary=(this.pageTSconfiguration.dictionaries&&this.pageTSconfiguration.dictionaries[this.contentISOLanguage]&&this.pageTSconfiguration.dictionaries[this.contentISOLanguage].defaultValue)?this.pageTSconfiguration.dictionaries[this.contentISOLanguage].defaultValue:'';this.showDictionaries=(this.pageTSconfiguration.dictionaries&&this.pageTSconfiguration.dictionaries.items)?this.pageTSconfiguration.dictionaries.items:'';this.restrictToDictionaries=(this.pageTSconfiguration.dictionaries&&this.pageTSconfiguration.dictionaries.restrictToItems)?this.pageTSconfiguration.dictionaries.restrictToItems:'';var pluginInformation={version:'3.0',developer:'Mihai Bazon & Stanislas Rolland',developerUrl:'http://www.sjbr.ca/',copyrightOwner:'Mihai Bazon & Stanislas Rolland',sponsor:'American Bible Society & SJBR',sponsorUrl:'http://www.sjbr.ca/',license:'GPL'};this.registerPluginInformation(pluginInformation);var buttonId='SpellCheck';var buttonConfiguration={id:buttonId,tooltip:this.localize('SC-spell-check'),iconCls:'htmlarea-action-spell-check',action:'onButtonPress',dialog:true};this.registerButton(buttonConfiguration);},configDefaults:{combo:{editable:true,selectOnFocus:true,typeAhead:true,triggerAction:'all',forceSelection:true,mode:'local',valueField:'value',displayField:'text',helpIcon:true,tpl:'<tpl for="."><div ext:qtip="{value}" style="text-align:left;font-size:11px;" class="x-combo-list-item">{text}</div></tpl>'}},onButtonPress:function(editor,id,target){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;this.openDialogue(buttonId,'Spell Checker',this.getWindowDimensions({width:740,height:600},buttonId));return false;},openDialogue:function(buttonId,title,dimensions){this.dialog=new Ext.Window({title:this.localize(title),cls:'htmlarea-window',bodyCssClass:'spell-check',border:false,width:dimensions.width,height:Ext.isIE?dimensions.height-50:'auto',resizable:!Ext.isIE,iconCls:this.getButton(buttonId).iconCls,listeners:{afterrender:{fn:this.onWindowAfterRender,scope:this},resize:{fn:this.onWindowResize},close:{fn:this.onClose,scope:this}},items:[{xtype:'form',method:'POST',itemId:'spell-check-form',url:this.pageTSconfiguration.path,hidden:true,standardSubmit:true,items:[{xtype:'hidden',name:'editorId',value:this.editor.editorId},{xtype:'hidden',itemId:'content',name:'content',value:this.editor.getHTML()},{xtype:'hidden',itemId:'dictionary',name:'dictionary',value:this.defaultDictionary?this.defaultDictionary:this.contentISOLanguage},{xtype:'hidden',name:'pspell_charset',value:this.contentCharset},{xtype:'hidden',name:'pspell_mode',value:this.spellCheckerMode},{xtype:'hidden',name:'userUid',value:this.userUid},{xtype:'hidden',name:'enablePersonalDicts',value:this.enablePersonalDicts},{xtype:'hidden',name:'showDictionaries',value:this.showDictionaries},{xtype:'hidden',name:'restrictToDictionaries',value:this.restrictToDictionaries}]},{xtype:'box',itemId:'spell-check-iframe',width:dimensions.width-225,autoEl:{name:'contentframe',tag:'iframe',cls:'contentframe',src:Ext.isGecko?'javascript:void(0);':HTMLArea.editorUrl+'popups/blank.html'}},{xtype:'fieldset',title:this.localize('Original word'),cls:'controls',labelWidth:0,defaults:{hideLabel:true,disabled:true,minWidth:160},items:[{xtype:'textfield',itemId:'word',disabled:false},this.buildButtonConfig('Revert',this.onRevertClick)]},{xtype:'fieldset',title:this.localize('Replacement'),cls:'controls',defaultType:'button',labelWidth:0,defaults:{hideLabel:true,disabled:true,minWidth:160},items:[{xtype:'textfield',disabled:false,width:160,itemId:'replacement'},{itemId:'replace',text:this.localize('Replace'),listeners:{click:{fn:this.onReplaceClick,scope:this}}},{itemId:'replaceAll',text:this.localize('Replace all'),listeners:{click:{fn:this.onReplaceAllClick,scope:this}}},{itemId:'ignore',text:this.localize('Ignore'),listeners:{click:{fn:this.onIgnoreClick,scope:this}}},{itemId:'ignoreAll',text:this.localize('Ignore all'),listeners:{click:{fn:this.onIgnoreAllClick,scope:this}}},{itemId:'learn',text:this.localize('Learn'),hidden:!this.enablePersonalDicts,listeners:{click:{fn:this.onLearnClick,scope:this}}}]},{xtype:'fieldset',title:this.localize('Suggestions'),cls:'controls',labelWidth:0,defaults:{hideLabel:true,minWidth:160},items:[Ext.apply({xtype:'combo',itemId:'suggestions',store:new Ext.data.ArrayStore({autoDestroy:true,fields:[{name:'text'},{name:'value'}],data:[]}),listeners:{select:{fn:this.onSuggestionSelect,scope:this}}},this.configDefaults['combo'])]},{xtype:'fieldset',title:this.localize('Dictionary'),cls:'controls',defaultType:'button',labelWidth:0,defaults:{hideLabel:true,disabled:true,minWidth:160},items:[Ext.apply({xtype:'combo',itemId:'dictionaries',disabled:false,store:new Ext.data.ArrayStore({autoDestroy:true,fields:[{name:'text'},{name:'value'}],data:[]}),listeners:{select:{fn:this.onDictionarySelect,scope:this}}},this.configDefaults['combo']),{itemId:'recheck',text:this.localize('Re-check'),listeners:{click:{fn:this.onRecheckClick,scope:this}}}]}],bbar:{defaults:{disabled:true},items:[{xtype:'tbtext',itemId:'spell-check-status',text:this.localize('Please wait. Calling spell checker.'),cls:'status-wait',disabled:false},'->',this.buildButtonConfig('OK',this.onOK),this.buildButtonConfig('Info',this.onInfoClick),this.buildButtonConfig('Cancel',this.onCancel)]}});this.show();},onWindowAfterRender:function(){this.modified=false;this.addToPersonalDictionary=[];this.addToReplacementList=[];this.dialog.getComponent('spell-check-form').getForm().getEl().set({target:'contentframe','accept-charset':this.contentCharset.toUpperCase()});this.dialog.getComponent('spell-check-form').getForm().submit();this.status=this.dialog.getBottomToolbar().getComponent('spell-check-status');this.statusIconClass='status-wait';},onWindowResize:function(window,width,height){var frame=window.getComponent('spell-check-iframe').getEl();if(frame){frame.setSize(width-225,height-75);}},onOK:function(){if(this.modified){this.editor.setHTML(this.cleanDocument(false));}
if((this.addToPersonalDictionary.length||this.addToReplacementList.length)&&this.enablePersonalDicts){var data={cmd:'learn',enablePersonalDicts:this.enablePersonalDicts,userUid:this.userUid,dictionary:this.contentISOLanguage,pspell_charset:this.contentCharset,pspell_mode:this.spellCheckerMode};Ext.each(this.addToPersonalDictionary,function(word,index){data['to_p_dict['+index+']']=word;});Ext.each(this.addToReplacementList,function(replacement,index){data['to_r_list['+index+'][0]']=replacement[0];data['to_r_list['+index+'][1]']=replacement[1];});this.postData(this.pageTSconfiguration.path,data);}
this.close();return false;},onCancel:function(){if(this.modified){TYPO3.Dialog.QuestionDialog({title:this.getButton('SpellCheck').tooltip.title,msg:this.localize('QUIT_CONFIRMATION'),fn:function(button){if(button=='yes'){this.close();}},scope:this});return false;}else{return this.base();}},setStatusIconClass:function(iconCls){this.status.removeClass(this.statusIconClass);this.statusIconClass=iconCls;this.status.addClass(this.statusIconClass);},cleanDocument:function(leaveFixed){var iframeDocument=this.dialog.getComponent('spell-check-iframe').getEl().dom.contentWindow.document;Ext.each(this.misspelledWords.concat(this.correctedWords),function(element){element.onclick=null;element.onmouseover=null;element.onmouseout=null;if(!leaveFixed||!HTMLArea.DOM.hasClass(element,'htmlarea-spellcheck-fixed')){element.parentNode.insertBefore(element.firstChild,element);element.parentNode.removeChild(element);}else{HTMLArea.DOM.removeClass(element,'htmlarea-spellcheck-error');HTMLArea.DOM.removeClass(element,'htmlarea-spellcheck-same');HTMLArea.DOM.removeClass(element,'htmlarea-spellcheck-current');}},this);Ext.each(iframeDocument.getElementsByTagName('a'),function(link){link.onclick=null;},this);return this.editor.iframe.htmlRenderer.render(iframeDocument.body,false);},spellCheckComplete:function(){var contentWindow=this.dialog.getComponent('spell-check-iframe').getEl().dom.contentWindow;this.currentElement=null;this.misspelledWords=[];this.correctedWords=[];this.allWords={};this.suggestedWords=contentWindow.suggestedWords;this.status.setText(this.localize('statusBarReady'));this.setStatusIconClass('status-ready');var id=0;var self=this;Ext.each(contentWindow.document.getElementsByTagName('span'),function(span){if(HTMLArea.DOM.hasClass(span,'htmlarea-spellcheck-error')){this.misspelledWords.push(span);span.onclick=function(event){self.setCurrentWord(this,false);};span.onmouseover=function(event){HTMLArea.DOM.addClass(this,'htmlarea-spellcheck-hover');};span.onmouseout=function(event){HTMLArea.DOM.removeClass(this,'htmlarea-spellcheck-hover');};span.htmlareaId=id++;span.htmlareaOriginalWord=span.firstChild.data;span.htmlareaFixed=false;if(typeof(this.allWords[span.htmlareaOriginalWord])=='undefined'){this.allWords[span.htmlareaOriginalWord]=[];}
this.allWords[span.htmlareaOriginalWord].push(span);}else if(HTMLArea.DOM.hasClass(span,'htmlarea-spellcheck-fixed')){this.correctedWords.push(span);}},this);Ext.each(contentWindow.document.getElementsByTagName('a'),function(link){link.onclick=function(event){return false;};},this);Ext.each(this.dialog.findByType('button'),function(button){button.setDisabled(false);});Ext.each(this.dialog.getBottomToolbar().findByType('button'),function(button){button.setDisabled(false);});if(this.misspelledWords.length){this.currentElement=this.misspelledWords[0];this.setCurrentWord(this.currentElement,true);var dictionaries=contentWindow.dictionaries.split(/,/);if(dictionaries.length){var select=this.dialog.find('itemId','dictionaries')[0];var store=select.getStore();store.removeAll();Ext.each(dictionaries,function(dictionary){store.add(new store.recordType({text:dictionary,value:dictionary}));});select.setValue(contentWindow.selectedDictionary);var selectedIndex=store.find('value',contentWindow.selectedDictionary);select.fireEvent('select',select,store.getAt(selectedIndex),selectedIndex);}}else{if(!this.modified){TYPO3.Dialog.InformationDialog({title:this.getButton('SpellCheck').tooltip.title,msg:this.localize('NO_ERRORS_CLOSING'),fn:this.onOK,scope:this});}else{TYPO3.Dialog.InformationDialog({title:this.getButton('SpellCheck').tooltip.title,msg:this.localize('NO_ERRORS')});}
return false;}},getAbsolutePosition:function(element){var position={x:element.offsetLeft,y:element.offsetTop};if(element.offsetParent){var tmp=this.getAbsolutePosition(element.offsetParent);position.x+=tmp.x;position.y+=tmp.y;}
return position;},setCurrentWord:function(element,scroll){if(scroll){var frame=this.dialog.getComponent('spell-check-iframe').getEl().dom;var position=this.getAbsolutePosition(element);var frameSize={x:frame.offsetWidth-4,y:frame.offsetHeight-4};position.x-=Math.round(frameSize.x/2);if(position.x<0){position.x=0;}
position.y-=Math.round(frameSize.y/2);if(position.y<0){position.y=0;}
frame.contentWindow.scrollTo(position.x,position.y);}
if(this.currentElement){HTMLArea.DOM.removeClass(this.currentElement,'htmlarea-spellcheck-current');Ext.each(this.allWords[this.currentElement.htmlareaOriginalWord],function(word){HTMLArea.DOM.removeClass(word,'htmlarea-spellcheck-same');});}
this.currentElement=element;HTMLArea.DOM.addClass(this.currentElement,'htmlarea-spellcheck-current');var occurrences=this.allWords[this.currentElement.htmlareaOriginalWord];Ext.each(occurrences,function(word){if(word!=this.currentElement){HTMLArea.DOM.addClass(word,'htmlarea-spellcheck-same');}},this);this.dialog.find('itemId','replaceAll')[0].setDisabled(occurrences.length<=1);this.dialog.find('itemId','ignoreAll')[0].setDisabled(occurrences.length<=1);var txt;var txt2;if(occurrences.length==1){txt=this.localize('One occurrence');txt2=this.localize('was found.');}else if(occurrences.length==2){txt=this.localize('Two occurrences');txt2=this.localize('were found.');}else{txt=occurrences.length+' '+this.localize('occurrences');txt2=this.localize('were found.');}
this.status.setText(txt+' '+this.localize('of the word')+' "<b>'+this.currentElement.htmlareaOriginalWord+'</b>" '+txt2);this.setStatusIconClass('status-info');var suggestions=this.suggestedWords[this.currentElement.htmlareaOriginalWord];if(suggestions){suggestions=suggestions.split(/,/);}else{suggestions=[];}
var select=this.dialog.find('itemId','suggestions')[0];var store=select.getStore();store.removeAll();Ext.each(suggestions,function(suggestion){store.add(new store.recordType({text:suggestion,value:suggestion}));});this.dialog.find('itemId','word')[0].setValue(this.currentElement.htmlareaOriginalWord);if(suggestions.length>0){select.setValue(store.getAt(0).get('value'));select.fireEvent('select',select,store.getAt(0),0);}else{this.dialog.find('itemId','replacement')[0].setValue(this.currentElement.innerHTML);}
return false;},onWordMouseOver:function(event,element){HTMLArea.DOM.addClass(element,'htmlarea-spellcheck-hover');},onWordMouseOut:function(event,element){HTMLArea.DOM.removeClass(element,'htmlarea-spellcheck-hover');},onSuggestionSelect:function(select,record,index){this.dialog.find('itemId','replacement')[0].setValue(record.get('value'));},onDictionarySelect:function(select,record,index){this.dialog.find('itemId','dictionary')[0].setValue(record.get('value'));},onRevertClick:function(){this.dialog.find('itemId','replacement')[0].setValue(this.currentElement.htmlareaOriginalWord);this.replaceWord(this.currentElement);HTMLArea.DOM.removeClass(this.currentElement,'htmlarea-spellcheck-fixed');HTMLArea.DOM.addClass(this.currentElement,'htmlarea-spellcheck-error');HTMLArea.DOM.addClass(this.currentElement,'htmlarea-spellcheck-current');return false;},replaceWord:function(element){HTMLArea.DOM.removeClass(element,'htmlarea-spellcheck-hover');HTMLArea.DOM.addClass(element,'htmlarea-spellcheck-fixed');element.htmlareaFixed=true;var replacement=this.dialog.find('itemId','replacement')[0].getValue();if(element.innerHTML!=replacement){this.addToReplacementList.push([element.innerHTML,replacement]);element.innerHTML=replacement;this.modified=true;}},onReplaceClick:function(){this.replaceWord(this.currentElement);var start=this.currentElement.htmlareaId;var index=start;do{++index;if(index==this.misspelledWords.length){index=0;}}while(index!=start&&this.misspelledWords[index].htmlareaFixed);if(index==start){index=0;TYPO3.Dialog.InformationDialog({title:this.getButton('SpellCheck').tooltip.title,msg:this.localize('Finished list of mispelled words')});}
this.setCurrentWord(this.misspelledWords[index],true);return false;},onReplaceAllClick:function(){Ext.each(this.allWords[this.currentElement.htmlareaOriginalWord],function(element){if(element!=this.currentElement){this.replaceWord(element);}},this);return this.onReplaceClick();},onIgnoreClick:function(){this.dialog.find('itemId','replacement')[0].setValue(this.currentElement.htmlareaOriginalWord);return this.onReplaceClick();},onIgnoreAllClick:function(){this.dialog.find('itemId','replacement')[0].setValue(this.currentElement.htmlareaOriginalWord);return this.onReplaceAllClick();},onLearnClick:function(){this.addToPersonalDictionary.push(this.currentElement.htmlareaOriginalWord);return this.onIgnoreAllClick();},onRecheckClick:function(){Ext.each(this.dialog.findByType('button'),function(button){button.setDisabled(true);});Ext.each(this.dialog.getBottomToolbar().findByType('button'),function(button){button.setDisabled(true);});this.status.setText(this.localize('Please wait: changing dictionary to')+': "'+this.dialog.find('itemId','dictionary')[0].getValue()+'".');this.setStatusIconClass('status-wait');this.dialog.find('itemId','content')[0].setValue(this.cleanDocument(true));this.dialog.getComponent('spell-check-form').getForm().submit();},onInfoClick:function(){var info=this.dialog.getComponent('spell-check-iframe').getEl().dom.contentWindow.spellcheckInfo;if(!info){TYPO3.Dialog.InformationDialog({title:this.getButton('SpellCheck').tooltip.title,msg:this.localize('No information available')});}else{var txt='';Ext.iterate(info,function(key,value){txt+=(txt?'<br />':'')+this.localize(key)+': '+value;},this);txt+=' '+this.localize('seconds');TYPO3.Dialog.InformationDialog({title:this.localize('Document information'),msg:txt});}
return false;}});