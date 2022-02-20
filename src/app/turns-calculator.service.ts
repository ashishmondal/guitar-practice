import { Injectable } from '@angular/core';
import * as seedrandom from 'seedrandom';

export type ExerciseList = { [key: string]: number };

@Injectable({
  providedIn: 'root'
})
export class TurnsCalculatorService {

  random = seedrandom(new Date().toDateString())

  constructor() { }

  getTurns(list: ExerciseList, count: number, repeat: boolean) {
    const max = 10;
    const total = Object.keys(list).reduce((p, c) => p + (max - list[c]), 0);
    const items = Object.keys(list).reduce((p, c) => {
      p[c] = (max - list[c]) / total;
      return p;
    }, {} as ExerciseList);

    const order = Object.keys(list).reduce((p, c, i) => {
      p[c] = i;
      return p;
    }, {} as ExerciseList);

    console.log(order)

    const getPseudoRandom = (items: ExerciseList) => {
      let totalWeight = 0,
        ranges = [],
        rnd = this.random()
      for (const itemName in items) {
        ranges.push({
          itemName,
          max: totalWeight += items[itemName]
        })
      }
      return ranges
        .find(({ max }) => max > rnd * totalWeight)!
        .itemName
    };

    let result: ExerciseList = {};

    let i =0

    while (i < count) {
      const next = getPseudoRandom(items);

      if (!repeat && result[next]) {
        continue;
      }

      result[next] = (result[next] ?? 0) + 1;
      i++;
    }

    return Object.entries(result)
      .sort(([a,], [b,]) => order[a] - order[b])
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {} as ExerciseList)
  }

}

