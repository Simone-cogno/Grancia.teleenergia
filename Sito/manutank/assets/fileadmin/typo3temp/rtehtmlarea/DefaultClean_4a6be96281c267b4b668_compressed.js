HTMLArea.DefaultClean=HTMLArea.Plugin.extend({constructor:function(editor,pluginName){this.base(editor,pluginName);},configurePlugin:function(editor){this.pageTSConfiguration=this.editorConfiguration.buttons.cleanword;var pluginInformation={version:'2.0',developer:'Stanislas Rolland',developerUrl:'http://www.sjbr.ca/',copyrightOwner:'Stanislas Rolland',sponsor:'SJBR',sponsorUrl:'http://www.sjbr.ca/',license:'GPL'};this.registerPluginInformation(pluginInformation);var buttonId='CleanWord';var buttonConfiguration={id:buttonId,tooltip:this.localize(buttonId+'-Tooltip'),action:'onButtonPress',hide:true,hideInContextMenu:true};this.registerButton(buttonConfiguration);},onButtonPress:function(editor,id,target){var buttonId=this.translateHotKey(id);buttonId=buttonId?buttonId:id;this.clean();return false;},onGenerate:function(){this.editor.iframe.mon(Ext.get(Ext.isIE?this.editor.document.body:this.editor.document.documentElement),'paste',this.wordCleanHandler,this);},clean:function(){function clearClass(node){var newc=node.className.replace(/(^|\s)mso.*?(\s|$)/ig,' ');if(newc!=node.className){node.className=newc;if(!/\S/.test(node.className)){if(!HTMLArea.is_opera){node.removeAttribute('class');if(HTMLArea.is_ie){node.removeAttribute('className');}}else{node.className='';}}}}
function clearStyle(node){if(HTMLArea.is_ie)var style=node.style.cssText;else var style=node.getAttribute('style');if(style){var declarations=style.split(/\s*;\s*/);for(var i=declarations.length;--i>=0;){if(/^mso|^tab-stops/i.test(declarations[i])||/^margin\s*:\s*0..\s+0..\s+0../i.test(declarations[i]))declarations.splice(i,1);}
node.setAttribute('style',declarations.join('; '));}}
function stripTag(el){if(HTMLArea.is_ie){el.outerHTML=HTMLArea.htmlEncode(el.innerText);}else{var txt=document.createTextNode(HTMLArea.getInnerText(el));el.parentNode.insertBefore(txt,el);el.parentNode.removeChild(el);}}
function checkEmpty(el){if(/^(span|b|strong|i|em|font)$/i.test(el.nodeName)&&!el.firstChild)el.parentNode.removeChild(el);}
function parseTree(root){var tag=root.nodeName.toLowerCase(),next;switch(root.nodeType){case 1:if(/^(meta|style|title|link)$/.test(tag)){root.parentNode.removeChild(root);return false;break;}
case 3:case 9:case 11:if((HTMLArea.is_ie&&root.scopeName!='HTML')||(!HTMLArea.is_ie&&/:/.test(tag))||/o:p/.test(tag)){stripTag(root);return false;}else{clearClass(root);clearStyle(root);for(var i=root.firstChild;i;i=next){next=i.nextSibling;if(i.nodeType!=3&&parseTree(i)){checkEmpty(i);}}}
return true;break;default:root.parentNode.removeChild(root);return false;break;}}
parseTree(this.editor._doc.body);if(HTMLArea.is_safari){this.editor.cleanAppleStyleSpans(this.editor._doc.body);}},wordCleanHandler:function(event){this.clean.defer(250,this);}});