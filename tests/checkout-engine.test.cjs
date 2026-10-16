const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const engine=require('../assets/js/checkout-engine.js');
const html=fs.readFileSync(path.join(__dirname,'../game/checkout.html'),'utf8');
const spec=JSON.parse(html.match(/id="checkout-spec">([\s\S]*?)<\/script>/)[1]);
function answer() {
  return {kinds:Object.fromEntries(spec.nodes.map(n=>[n.id,n.kind])),edges:Object.fromEntries(spec.edges.map(e=>[e.key,e.to]))};
}
test('reference model accepts all 19 symbol and connection rules',()=> {
  assert.equal(engine.validate(spec,answer()).total,19);
  assert.deepEqual(engine.validate(spec,answer()).issues,[]);
});
test('every changed connection is detected independently',()=> {
  for(const edge of spec.edges) {
    const a=answer();a.edges[edge.key]=edge.to==='start'?'finish':'start';
    assert.equal(engine.validate(spec,a).issues.length,1,edge.key);
  }
});
test('every incorrect symbol is detected independently',()=> {
  for(const node of spec.nodes) {
    const a=answer();a.kinds[node.id]=node.kind==='step'?'decision':'step';
    assert.equal(engine.validate(spec,a).issues.length,1,node.id);
  }
});
for(const scenario of ['normal','invalid','money','failed']) test('reference simulates '+scenario,()=> {
  const result=engine.simulate(spec,answer(),scenario);
  assert.equal(result.ok,true);
  if(scenario==='normal') assert.deepEqual(result.trace,['start','input','calculate','valid','save','saved','receipt','finish']);
  else {
    assert.equal(result.trace.at(-1),'input');assert(result.trace.includes('error'));
    assert(!result.trace.includes('receipt'));
    if(scenario==='failed') assert(result.trace.includes('save'));
    else assert(!result.trace.includes('save'));
  }
});
test('failed persistence reaching receipt is rejected',()=> {
  const a=answer();a.edges['saved:Tidak']='receipt';
  const r=engine.simulate(spec,a,'failed');assert.equal(r.ok,false);assert.match(r.message,/Nota muncul/);
});
test('invalid input must not reach persistence',()=> {
  const a=answer();a.edges['valid:Tidak']='save';
  assert.match(engine.simulate(spec,a,'invalid').message,/sebelum input lolos/);
});
test('empty answers return actionable diagnostics',()=> {
  const a={kinds:{},edges:{}};assert.equal(engine.validate(spec,a).issues.length,19);
  assert.match(engine.simulate(spec,a,'normal').message,/belum dipilih/);
});
test('unexpected cycles terminate without hanging',()=> {
  const a=answer();a.edges['calculate:']='calculate';
  assert.match(engine.simulate(spec,a,'normal').message,/berputar/);
});
test('skipping calculation is not a successful checkout',()=> {
  const a=answer();a.edges['input:']='valid';
  assert.equal(engine.simulate(spec,a,'normal').ok,false);
});
test('receipt or finish before save must fail',()=> {
  for(const dest of ['receipt','finish']) {
    const a=answer();a.edges['input:']=dest;
    assert.equal(engine.simulate(spec,a,'normal').ok,false);
  }
});
test('save failure cannot be claimed before save was attempted',()=> {
  const a=answer();a.edges['valid:Ya']='error';
  assert.equal(engine.simulate(spec,a,'failed').ok,false);
});
test('game markup includes SVG canvas, shape buttons, and all 9 interactive nodes',()=> {
  assert(html.includes('checkout-svg-canvas'), 'SVG canvas must exist');
  assert(html.includes('checkout-pipeline-wrap'), 'Pipeline wrap must exist');
  for (const node of spec.nodes) {
    assert(html.includes(`data-node="${node.id}"`), `Node ${node.id} must be present in HTML`);
    assert(html.includes(`data-kind="${node.id}"`), `Kind selector for ${node.id} must be present`);
  }
  for (const edge of spec.edges) {
    assert(html.includes(`data-edge="${edge.key}"`), `Edge selector for ${edge.key} must be present`);
  }
  assert.equal((html.match(/class="btn-shape"/g) || []).length, spec.nodes.length * 4);
});
