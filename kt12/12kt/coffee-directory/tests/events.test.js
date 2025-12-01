import { expect } from 'chai';

describe('events', ()=>{
  it('item-selected event detail contains id', ()=>{
    const ev = new CustomEvent('item-selected', { detail: { id: 'c1' }, bubbles:true, composed:true });
    expect(ev.detail).to.deep.equal({ id:'c1' });
  });
});
