HTMLArea.FindReplace=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){var pluginInformation={version:'2.0',developer:'Cau Guanabara & Stanislas Rolland',developerUrl:'http://www.sjbr.ca',copyrightOwner:'Cau Guanabara & Stanislas Rolland',sponsor:'Independent production & SJBR',sponsorUrl:'http://www.sjbr.ca',license:'GPL'};this.registerPluginInformation(pluginInformation);var buttonId='FindReplace';var buttonConfiguration={id:buttonId,tooltip:this.localize('Find and Replace'),iconCls:'htmlarea-action-find-replace',action:'onButtonPress',dialog:true};this.registerButton(buttonConfiguration);this.marksCleaningRE=/(<span\s+[^>]*id="?htmlarea-frmark[^>]*"?>)([^<>]*)(<\/span>)/gi;return true;},onButtonPress:function(editor,id,target){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;this.buffer=null;this.initVariables();var plugin=this.getPluginInstance('UndoRedo');if(plugin){plugin.stop();var undo=this.getButton('Undo');if(undo){undo.setDisabled(true);}
var redo=this.getButton('Redo');if(redo){redo.setDisabled(true);}}
this.openDialogue(buttonId,'Find and Replace',this.getWindowDimensions({width:410,height:360},buttonId));return false;},openDialogue:function(buttonId,title,dimensions){this.dialog=new Ext.Window({title:this.localize(title),cls:'htmlarea-window',border:false,width:dimensions.width,height:'auto',resizable:!Ext.isIE,iconCls:this.getButton(buttonId).iconCls,listeners:{close:{fn:this.onClose,scope:this}},items:[{xtype:'fieldset',defaultType:'textfield',labelWidth:100,defaults:{labelSeparator:'',width:250,listeners:{change:{fn:this.clearDoc,scope:this}}},listeners:{render:{fn:this.initPattern,scope:this}},items:[{itemId:'pattern',fieldLabel:this.localize('Search for:')},{itemId:'replacement',fieldLabel:this.localize('Replace with:')}]},{xtype:'fieldset',defaultType:'checkbox',title:this.localize('Options'),labelWidth:150,items:[{itemId:'words',fieldLabel:this.localize('Whole words only'),listeners:{check:{fn:this.clearDoc,scope:this}}},{itemId:'matchCase',fieldLabel:this.localize('Case sensitive search'),listeners:{check:{fn:this.clearDoc,scope:this}}},{itemId:'replaceAll',fieldLabel:this.localize('Substitute all occurrences'),listeners:{check:{fn:this.requestReplacement,scope:this}}}]},{xtype:'fieldset',defaultType:'button',title:this.localize('Actions'),defaults:{minWidth:150,disabled:true,style:{marginBottom:'5px'}},items:[{text:this.localize('Clear'),itemId:'clear',listeners:{click:{fn:this.clearMarks,scope:this}}},{text:this.localize('Highlight'),itemId:'hiliteall',listeners:{click:{fn:this.hiliteAll,scope:this}}},{text:this.localize('Undo'),itemId:'undo',listeners:{click:{fn:this.resetContents,scope:this}}}]}],buttons:[this.buildButtonConfig('Next',this.onNext),this.buildButtonConfig('Done',this.onCancel)]});this.show();},initPattern:function(fieldset){var selection=this.editor.getSelectedHTML();if(/\S/.test(selection)){selection=selection.replace(/<[^>]*>/g,'');selection=selection.replace(/&nbsp;/g,'');}
if(/\S/.test(selection)){fieldset.getComponent('pattern').setValue(selection);fieldset.getComponent('replacement').focus();}else{fieldset.getComponent('pattern').focus();}},requestReplacement:function(){if(!this.dialog.find('itemId','replacement')[0].getValue()&&this.dialog.find('itemId','replaceAll')[0].getValue()){TYPO3.Dialog.InformationDialog({title:this.getButton('FindReplace').tooltip.title,msg:this.localize('Inform a replacement word'),fn:function(){this.dialog.find('itemId','replacement')[0].focus();},scope:this});}
this.clearDoc();},onNext:function(){if(!this.dialog.find('itemId','pattern')[0].getValue()){TYPO3.Dialog.InformationDialog({title:this.getButton('FindReplace').tooltip.title,msg:this.localize('Enter the text you want to find'),fn:function(){this.dialog.find('itemId','pattern')[0].focus();},scope:this});return false;}
var fields=['pattern','replacement','words','matchCase','replaceAll'];var params={};Ext.each(fields,function(field){params[field]=this.dialog.find('itemId',field)[0].getValue();},this);this.search(params);return false;},search:function(params){var html=this.editor.getInnerHTML();if(this.buffer==null){this.buffer=html;}
if(this.matches==0){var pattern=new RegExp(params.words?'(?!<[^>]*)(\\b'+params.pattern+'\\b)(?![^<]*>)':'(?!<[^>]*)('+params.pattern+')(?![^<]*>)','g'+(params.matchCase?'':'i'));this.editor.setHTML(html.replace(pattern,'<span id="htmlarea-frmark">'+"$1"+'</span>'));Ext.each(this.editor.document.body.getElementsByTagName('span'),function(mark){if(/^htmlarea-frmark/.test(mark.id)){this.spans.push(mark);}},this);}
this.spanWalker(params.pattern,params.replacement,params.replaceAll);},spanWalker:function(pattern,replacement,replaceAll){this.clearMarks();if(this.spans.length){Ext.each(this.spans,function(mark,i){if(i>=this.matches&&!/[0-9]$/.test(mark.id)){this.matches++;this.disableActions('clear',false);mark.id='htmlarea-frmark_'+this.matches;mark.style.color='white';mark.style.backgroundColor='highlight';mark.style.fontWeight='bold';mark.scrollIntoView(false);var self=this;function replace(button){if(button=='yes'){mark.firstChild.replaceData(0,mark.firstChild.data.length,replacement);self.replaces++;self.disableActions('undo',false);}
self.endWalk(pattern,i);}
if(replaceAll){replace('yes');return true;}else{TYPO3.Dialog.QuestionDialog({title:this.getButton('FindReplace').tooltip.title,msg:this.localize('Substitute this occurrence?'),fn:replace,scope:this});return false;}}},this);}else{this.endWalk(pattern,0);}},endWalk:function(pattern,index){if(index>=this.spans.length-1||!this.spans.length){var message=this.localize('Done')+':<br /><br />';if(this.matches>0){if(this.matches==1){message+=this.matches+' '+this.localize('found item');}else{message+=this.matches+' '+this.localize('found items');}
if(this.replaces>0){if(this.replaces==1){message+=',<br />'+this.replaces+' '+this.localize('replaced item');}else{message+=',<br />'+this.replaces+' '+this.localize('replaced items');}}
this.hiliteAll();}else{message+='"'+pattern+'" '+this.localize('not found');this.disableActions('hiliteall,clear',true);}
TYPO3.Dialog.InformationDialog({title:this.getButton('FindReplace').tooltip.title,msg:message+'.',minWidth:300});}},clearDoc:function(){this.editor.setHTML(this.editor.getInnerHTML().replace(this.marksCleaningRE,"$2"));this.initVariables();this.disableActions('hiliteall,clear',true);},clearMarks:function(){Ext.each(this.editor.document.body.getElementsByTagName('span'),function(mark){if(/^htmlarea-frmark/.test(mark.id)){mark.style.backgroundColor='';mark.style.color='';mark.style.fontWeight='';}},this);this.disableActions('hiliteall',false);this.disableActions('clear',true);},hiliteAll:function(){Ext.each(this.editor.document.body.getElementsByTagName('span'),function(mark){if(/^htmlarea-frmark/.test(mark.id)){mark.style.backgroundColor='highlight';mark.style.color='white';mark.style.fontWeight='bold';}},this);this.disableActions('clear',false);this.disableActions('hiliteall',true);},resetContents:function(){if(this.buffer!=null){var transp=this.editor.getInnerHTML();this.editor.setHTML(this.buffer);this.buffer=transp;this.disableActions('clear',true);}},disableActions:function(actions,disabled){Ext.each(actions.split(/[,; ]+/),function(action){this.dialog.find('itemId',action)[0].setDisabled(disabled);},this);},initVariables:function(){this.matches=0;this.replaces=0;this.spans=new Array();},onCancel:function(){this.clearDoc();var plugin=this.getPluginInstance('UndoRedo');if(plugin){plugin.start();}
this.base();},onClose:function(){this.clearDoc();var plugin=this.getPluginInstance('UndoRedo');if(plugin){plugin.start();}
this.base();}});