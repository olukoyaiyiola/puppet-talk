
const $ = id => document.getElementById(id);
let panels = [], characters = [], listening = false, recognition, timer, lastText = '', busy = false;
let config = {mode:'demo', token:'', model:'black-forest-labs/FLUX.1-schnell'};
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const note = s => $('notice').textContent = s;
function drawDemo(text,i) {
 const colors=[['#e8dcfa','#9273c9'],['#d9f2ee','#5c9c9b'],['#ffe8ce','#c27d8b']];
 const [bg,ink]=colors[i%colors.length];
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="'+bg+'"/><circle cx="620" cy="130" r="85" fill="#ffd990"/><path d="M0 370 Q220 200 420 350 T800 320 V600 H0" fill="'+ink+'" opacity=".35"/><path d="M0 440 Q200 310 460 430 T800 400 V600 H0" fill="'+ink+'" opacity=".5"/><path d="M120 390 L220 260 L320 390Z" fill="'+ink+'"/><rect x="160" y="390" width="120" height="90" fill="'+ink+'"/><text x="40" y="65" font-size="25" fill="#37254d" font-family="Georgia">Scene '+(i+1)+'</text><text x="400" y="550" font-size="20" text-anchor="middle" fill="#37254d" font-family="Georgia">Your story is taking shape</text></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
function renderCharacters() {
 $('characterList').innerHTML=characters.map((c,i)=>'<div class="character-card"><input data-char="'+i+'" data-field="name" aria-label="Character name" placeholder="Name" value="'+escapeHTML(c.name)+'"><input data-char="'+i+'" data-field="description" aria-label="Appearance" placeholder="Appearance" value="'+escapeHTML(c.description)+'"><button data-remove="'+i+'">Remove</button></div>').join('');
 $('characterList').querySelectorAll('input').forEach(el=>el.oninput=()=>characters[+el.dataset.char][el.dataset.field]=el.value);
 $('characterList').querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{characters.splice(+el.dataset.remove,1);renderCharacters()});
}
function render() {
 $('comicTitle').textContent=$('storyTitle').value||'Untitled adventure';
 $('count').textContent=panels.length+' PANELS';
 $('panels').innerHTML=panels.length?panels.map((p,i)=>'<article class="panel"><img class="panel-art" alt="Scene illustration" src="'+p.url+'"><div class="panel-info"><small>PANEL '+(i+1)+'</small><p>'+escapeHTML(p.text)+'</p><div class="panel-actions"><button data-act="retry" data-i="'+i+'">Regenerate</button><button data-act="up" data-i="'+i+'">Move up</button><button data-act="down" data-i="'+i+'">Move down</button><button data-act="delete" data-i="'+i+'">Delete</button></div></div></article>').join(''):'<div class="empty"><div class="empty-art">☀<span>☁</span><b>⌂</b></div><h3>Your canvas is waiting</h3><p>Start telling a story, then create your first panel.</p></div>';
 $('panels').querySelectorAll('[data-act]').forEach(el=>el.onclick=async()=>{const i=+el.dataset.i,a=el.dataset.act;if(a==='delete')panels.splice(i,1);if(a==='up'&&i>0)[panels[i-1],panels[i]]=[panels[i],panels[i-1]];if(a==='down'&&i<panels.length-1)[panels[i+1],panels[i]]=[panels[i],panels[i+1]];if(a==='retry'){try{panels[i].url=await generate(panels[i].text,i)}catch(e){note(e.message)}}render()});
}
async function generate(text,i) {
 if(config.mode==='demo')return drawDemo(text,i);
 if(!config.token)throw Error('Enter a Hugging Face token in Settings.');
 const characterNotes=characters.map(c=>c.name+': '+c.description).join('; ');
 const prompt='Child-friendly illustrated story panel. Art style: '+$('style').value+'. Story: '+text+'. Consistent characters: '+characterNotes+'. No written text, violence or adult content.';
 const response=await fetch('https://router.huggingface.co/hf-inference/models/'+config.model,{method:'POST',headers:{Authorization:'Bearer '+config.token,'Content-Type':'application/json',Accept:'image/png'},body:JSON.stringify({inputs:prompt})});
 if(!response.ok)throw Error('Image generation failed (HTTP '+response.status+'). Check API access, model or CORS.');
 const blob=await response.blob();if(!blob.type.startsWith('image/'))throw Error('The service did not return an image.');
 return await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
}
async function makePanel() {
 if(busy)return;
 const all=$('transcript').value.trim();
 const text=all.startsWith(lastText)?all.slice(lastText.length).trim():all;
 if(!text){note('Tell or type something new first.');return}
 busy=true;$('panelBtn').disabled=true;note('Drawing your scene...');
 try{const url=await generate(text,panels.length);panels.push({text,url});lastText=all;render();note('Your panel is ready!')}
 catch(e){note(e.message)}finally{busy=false;$('panelBtn').disabled=false}
}
function setMic(on){listening=on;$('micBtn').textContent=on?'■ Stop telling':'🎙 Start telling';$('micTitle').textContent=on?'We are listening...':'Your story starts here';$('sessionStatus').textContent=on?'● Recording':'● Ready to imagine';clearInterval(timer);if(on&&+$('interval').value)timer=setInterval(()=>{if($('transcript').value.trim()!==lastText)makePanel()},+$('interval').value*1000)}
$('storyTitle').oninput=render;
$('addCharacter').onclick=()=>{characters.push({name:'',description:''});renderCharacters()};
$('panelBtn').onclick=makePanel;
$('clearTextBtn').onclick=()=>{if(confirm('Clear transcript?')){$('transcript').value='';lastText=''}};
$('interval').onchange=()=>{if(listening)setMic(true)};
$('micBtn').onclick=()=>{
 if(listening){setMic(false);recognition?.stop();return}
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){note('Speech recognition unavailable. Type your story instead.');return}
 recognition=new SR();recognition.continuous=true;recognition.interimResults=true;recognition.lang='en-NG';
 let base=$('transcript').value.trim();
 recognition.onresult=e=>{let finals='',temp='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0].transcript;if(e.results[i].isFinal)finals+=t+' ';else temp+=t}if(finals)base=(base+' '+finals).trim();$('transcript').value=(base+' '+temp).trim()};
 recognition.onerror=e=>{note('Speech recognition: '+e.error);if(['not-allowed','audio-capture','service-not-allowed'].includes(e.error))setMic(false)};
 recognition.onend=()=>{if(listening){try{recognition.start()}catch{setMic(false)}}};
 try{recognition.start();setMic(true);note('Listening...')}catch(e){note(e.message)}
};
$('settingsBtn').onclick=()=>{$('mode').value=config.mode;$('hfToken').value=config.token;$('hfModel').value=config.model;$('settingsDialog').showModal()};
$('saveSettings').onclick=()=>{config={mode:$('mode').value,token:$('hfToken').value.trim(),model:$('hfModel').value.trim()};note('Settings saved for this session.')};
$('resetBtn').onclick=()=>{if(confirm('Delete all panels?')){panels=[];lastText='';$('transcript').value='';render()}};
$('exportBtn').onclick=()=>{
 if(!panels.length){note('Create a panel before exporting.');return}
 const title=escapeHTML($('storyTitle').value);
 const pages=panels.map((p,i)=>'<article><h2>Scene '+(i+1)+'</h2><img src="'+p.url+'"><p>'+escapeHTML(p.text)+'</p></article>').join('');
 const html='<!doctype html><html><head><meta charset="utf-8"><title>'+title+'</title><style>body{font:16px Georgia;max-width:900px;margin:30px auto;padding:20px}h1{text-align:center}article{break-inside:avoid;margin:25px 0}img{width:100%}@media print{button{display:none}}</style></head><body><h1>'+title+'</h1><button onclick="window.print()">Print / Save as PDF</button>'+pages+'</body></html>';
 const url=URL.createObjectURL(new Blob([html],{type:'text/html'})),a=document.createElement('a');a.href=url;a.download='puppet-talk-comic.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);note('Comic exported. Open it and print to PDF.');
};
render();
