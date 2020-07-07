import * as all from '@/utils/dict'

export function getValueText(value, valname){
    let dict =  all[valname]
    for(let info of dict){
       if(info.value == value){
          return info.label
       }
    }
}