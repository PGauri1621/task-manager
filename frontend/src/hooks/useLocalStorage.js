import { useState } from 'react';

export default function useLocalStorage(k,i)
{
    const[d,s]=useState(()=>
        {
            try{
                const v=localStorage.getItem(k);
                return v?JSON.parse(v):i;
            }
            catch{
                return i;
            }
        });
        const set=v=>{
        const val=v instanceof Function?v(d):v;
        s(val);localStorage.setItem(k,JSON.stringify(val));
    };
        return[d,set];
}