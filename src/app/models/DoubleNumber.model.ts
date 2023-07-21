import { AndarNumber } from "./AndarNumber.model";
import { BaharNumber } from "./BaharNumber.model";
import {SingleNumber} from "./SingleNumber.model";


export class DoubleNumber{

  doubleNumberCombinationId: number;
  singleNumber?: SingleNumber;
  doubleNumber?: number;
  andarNumber?: AndarNumber;
  baharNumber?: BaharNumber;
  visibleDoubleNumber?: number;
}
