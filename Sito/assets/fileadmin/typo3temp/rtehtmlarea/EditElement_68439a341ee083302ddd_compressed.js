HTMLArea.EditElement=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.pageTSConfiguration=this.editorConfiguration.buttons.editelement;this.removedFieldsets=(this.pageTSConfiguration&&this.pageTSConfiguration.removeFieldsets)?this.pageTSConfiguration.removeFieldsets:'';this.properties=(this.pageTSConfiguration&&this.pageTSConfiguration.properties)?this.pageTSConfiguration.properties:'';this.removedProperties=(this.properties&&this.properties.removed)?this.properties.removed:'';var pluginInformation={version:'1.0',developer:'Stanislas Rolland',developerUrl:'http://www.sjbr.ca/',copyrightOwner:'Stanislas Rolland',sponsor:'SJBR',sponsorUrl:'http://www.sjbr.ca/',license:'GPL'};this.registerPluginInformation(pluginInformation);var buttonId='EditElement';var buttonConfiguration={id:buttonId,tooltip:this.localize('editElement'),action:'onButtonPress',dialog:true,iconCls:'htmlarea-action-element-edit'};this.registerButton(buttonConfiguration);return true;},configDefaults:{combo:{editable:true,selectOnFocus:true,typeAhead:true,triggerAction:'all',forceSelection:true,mode:'local',valueField:'value',displayField:'text',helpIcon:true,tpl:'<tpl for="."><div ext:qtip="{value}" style="text-align:left;font-size:11px;" class="x-combo-list-item">{text}</div></tpl>'}},onButtonPress:function(editor,id){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;this.element=this.editor.getParentElement();if(this.element&&!/^body$/i.test(this.element.nodeName)){this.openDialogue(buttonId,'editElement',this.getWindowDimensions({width:450},buttonId),this.buildTabItemsConfig(this.element),this.buildButtonsConfig(this.element,this.okHandler,this.deleteHandler));}
return false;},openDialogue:function(buttonId,title,dimensions,tabItems,buttonsConfig){this.dialog=new Ext.Window({title:this.getHelpTip('',title),cls:'htmlarea-window',border:false,width:dimensions.width,height:'auto',resizable:!Ext.isIE,iconCls:this.getButton(buttonId).iconCls,listeners:{close:{fn:this.onClose,scope:this}},items:{xtype:'tabpanel',activeTab:0,defaults:{xtype:'container',layout:'form',defaults:{labelWidth:150}},listeners:{tabchange:{fn:this.syncHeight,scope:this}},items:tabItems},buttons:buttonsConfig});this.show();},buildTabItemsConfig:function(element){var tabItems=[];var generalTabItemConfig=[];if(this.removedFieldsets.indexOf('identification')==-1){this.addConfigElement(this.buildIdentificationFieldsetConfig(element),generalTabItemConfig);}
if(this.removedFieldsets.indexOf('style')==-1&&this.removedProperties.indexOf('className')==-1){this.addConfigElement(this.buildClassFieldsetConfig(element),generalTabItemConfig);}
tabItems.push({title:this.localize('general'),itemId:'general',items:generalTabItemConfig});if(this.removedFieldsets.indexOf('language')==-1&&this.getPluginInstance('Language')){var languageTabItemConfig=[];this.addConfigElement(this.buildLanguageFieldsetConfig(element),languageTabItemConfig);tabItems.push({title:this.localize('Language'),itemId:'language',items:languageTabItemConfig});}
if(this.removedFieldsets.indexOf('events')==-1){var eventsTabItemConfig=[];this.addConfigElement(this.buildEventsFieldsetConfig(element),eventsTabItemConfig);tabItems.push({title:this.localize('events'),itemId:'events',items:eventsTabItemConfig});}
return tabItems;},buildIdentificationFieldsetConfig:function(element){var itemsConfig=[];if(this.removedProperties.indexOf('id')==-1){itemsConfig.push({itemId:'id',fieldLabel:this.getHelpTip('id','id'),value:element?element.getAttribute('id'):'',width:((this.properties['id']&&this.properties['id'].width)?this.properties['id'].width:300)});}
if(this.removedProperties.indexOf('title')==-1){itemsConfig.push({itemId:'title',fieldLabel:this.getHelpTip('title','title'),value:element?element.getAttribute('title'):'',width:((this.properties['title']&&this.properties['title'].width)?this.properties['title'].width:300)});}
return{xtype:'fieldset',title:this.localize('identification'),defaultType:'textfield',labelWidth:100,defaults:{labelSeparator:':'},items:itemsConfig};},buildClassFieldsetConfig:function(element){var itemsConfig=[];var stylingCombo=this.buildStylingField('className','className','className');this.setStyleOptions(stylingCombo,element);itemsConfig.push(stylingCombo);return{xtype:'fieldset',title:this.localize('className'),labelWidth:100,defaults:{labelSeparator:':'},items:itemsConfig};},buildStylingField:function(fieldName,fieldLabel,cshKey){return new Ext.form.ComboBox(Ext.apply({xtype:'combo',itemId:fieldName,fieldLabel:this.getHelpTip(fieldLabel,cshKey),width:((this.properties['className']&&this.properties['className'].width)?this.properties['className'].width:300),store:new Ext.data.ArrayStore({autoDestroy:true,fields:[{name:'text'},{name:'value'},{name:'style'}],data:[[this.localize('No style'),'none']]})},{tpl:'<tpl for="."><div ext:qtip="{value}" style="{style}text-align:left;font-size:11px;" class="x-combo-list-item">{text}</div></tpl>'},this.configDefaults['combo']));},setStyleOptions:function(comboBox,element){var nodeName=element.nodeName.toLowerCase();this.stylePlugin=this.getPluginInstance(HTMLArea.isBlockElement(element)?'BlockStyle':'TextStyle');if(comboBox&&this.stylePlugin){var classNames=HTMLArea.DOM.getClassNames(element);this.stylePlugin.buildDropDownOptions(comboBox,nodeName);this.stylePlugin.setSelectedOption(comboBox,classNames,'noUnknown');}},buildLanguageFieldsetConfig:function(element){var itemsConfig=[];var languagePlugin=this.getPluginInstance('Language');var languageConfigurationUrl;if(this.editorConfiguration.buttons&&this.editorConfiguration.buttons.language&&this.editorConfiguration.buttons.language.dataUrl){languageConfigurationUrl=this.editorConfiguration.buttons.language.dataUrl;}
if(languagePlugin&&languageConfigurationUrl&&this.removedProperties.indexOf('language')==-1){var selectedLanguage=!Ext.isEmpty(element)?languagePlugin.getLanguageAttribute(element):'none';function initLanguageStore(store){if(selectedLanguage!=='none'){store.removeAt(0);store.insert(0,new store.recordType({text:languagePlugin.localize('Remove language mark'),value:'none'}));}}
var languageStore=new Ext.data.JsonStore({autoDestroy:true,autoLoad:true,root:'options',fields:[{name:'text'},{name:'value'}],url:languageConfigurationUrl,listeners:{load:initLanguageStore}});itemsConfig.push(Ext.apply({xtype:'combo',fieldLabel:languagePlugin.getHelpTip('languageCombo','Language'),itemId:'lang',store:languageStore,width:((this.properties['language']&&this.properties['language'].width)?this.properties['language'].width:200),value:selectedLanguage},this.configDefaults['combo']));}
if(this.removedProperties.indexOf('direction')==-1){itemsConfig.push(Ext.apply({xtype:'combo',fieldLabel:languagePlugin.getHelpTip('directionCombo','Text direction'),itemId:'dir',store:new Ext.data.ArrayStore({autoDestroy:true,fields:[{name:'text'},{name:'value'}],data:[[languagePlugin.localize('Not set'),'not set'],[languagePlugin.localize('RightToLeft'),'rtl'],[languagePlugin.localize('LeftToRight'),'ltr']]}),width:((this.properties['direction']&&this.properties['dirrection'].width)?this.properties['direction'].width:200),value:!Ext.isEmpty(element)&&element.dir?element.dir:'not set'},this.configDefaults['combo']));}
return{xtype:'fieldset',title:this.localize('Language'),labelWidth:100,defaults:{labelSeparator:':'},items:itemsConfig};},buildEventsFieldsetConfig:function(element){var itemsConfig=[];var events=['onkeydown','onkeypress','onkeyup','onclick','ondblclick','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup'];if(!/^(base|bdo|br|frame|frameset|head|html|iframe|meta|param|script|style|title)$/i.test(element.nodeName)){Ext.each(events,function(event){if(this.removedProperties.indexOf(event)==-1){itemsConfig.push({itemId:event,fieldLabel:this.getHelpTip(event,event),value:element?element.getAttribute(event):''});}},this);}
return itemsConfig.length?{xtype:'fieldset',title:this.getHelpTip('events','events'),defaultType:'textfield',labelWidth:100,defaults:{labelSeparator:':',width:((this.properties['event']&&this.properties['event'].width)?this.properties['event'].width:300)},items:itemsConfig}:null;},buildButtonsConfig:function(element,okHandler,deleteHandler){var buttonsConfig=[this.buildButtonConfig('OK',okHandler)];if(element){buttonsConfig.push(this.buildButtonConfig('Delete',deleteHandler));}
buttonsConfig.push(this.buildButtonConfig('Cancel',this.onCancel));return buttonsConfig;},okHandler:function(button,event){this.restoreSelection();var textFields=this.dialog.findByType('textfield');Ext.each(textFields,function(field){this.element.setAttribute(field.getItemId(),field.getValue());},this);var comboFields=this.dialog.findByType('combo');Ext.each(comboFields,function(field){var itemId=field.getItemId();var value=field.getValue();switch(itemId){case'className':this.stylePlugin.applyClassChange(this.element,value);break;case'lang':this.getPluginInstance('Language').setLanguageAttributes(this.element,value);break;case'dir':this.element.setAttribute(itemId,(value=='not set')?'':value);break;}},this);this.close();event.stopEvent();},deleteHandler:function(button,event){this.restoreSelection();if(this.element){HTMLArea.removeFromParent(this.element);}
this.close();event.stopEvent();},onUpdateToolbar:function(button,mode,selectionEmpty,ancestors){if((mode==='wysiwyg')&&this.editor.isEditable()){button.setDisabled(!ancestors.length||/^body$/i.test(ancestors[0].nodeName));if(this.dialog){this.dialog.focus();}}}});