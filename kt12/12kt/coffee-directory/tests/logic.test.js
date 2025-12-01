import { expect } from 'chai';
import { sortItems, filterByCategory, searchItems } from '../lib/logic.js';

const sample = [
  {id:'a', name:'B', category:'X', flavor:['choco'], strength:2},
  {id:'b', name:'A', category:'Y', flavor:['nut'], strength:5}
];

describe('Logic functions', () => {

  it('sort by name ascending', () => {
    // массив тестовых данных, поле для сортировки, направление сортировки
    const res = sortItems(sample, 'name', 'asc');
    // После сортировки по имени в возрастающем порядке, первый эл-нт а
    expect(res[0].name).to.equal('A');
    // второй
    expect(res[1].name).to.equal('B');
  });

  it('sort by strength descending', () => {
    // порядке убывания
    const res = sortItems(sample, 'strength', 'desc');
    expect(res[0].strength).to.equal(5);
    expect(res[1].strength).to.equal(2);
  });

  it('filter by category', () => {
    // фильтрация товаров категории
    const res = filterByCategory(sample, 'X');
    expect(res).to.have.length(1);
    expect(res[0].id).to.equal('a');
  });

  it('filter with no category returns all', () => {
    // поведение при отсутствии категории фильтра
    const res = filterByCategory(sample, null);
    // возвращаются все товары
    expect(res).to.have.length(2);
  });

  it('search by flavor', () => {
    // поиск по слову
    const res = searchItems(sample, 'nut');
    expect(res).to.have.length(1);
    expect(res[0].id).to.equal('b');
  });

  it('search by name', () => {
    // поиск по имени
    const res = searchItems(sample, 'B');
    expect(res).to.have.length(1);
    expect(res[0].id).to.equal('a');
  });

  it('search with empty text returns all', () => {
    // поведение при пустой строке поиска
    const res = searchItems(sample, '');
    expect(res).to.have.length(2);
  });

});
